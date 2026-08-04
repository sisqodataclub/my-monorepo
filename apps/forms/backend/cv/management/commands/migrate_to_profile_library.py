# backend/cv/management/commands/migrate_to_profile_library.py

"""
One‑time data migration script:
- Populates the new Profile* tables (ProfileEducation, ProfileExperience, etc.)
  from existing legacy nested data (Education, Experience, etc.).
- Deduplicates per user using get_or_create.
- Updates each Resume with the ordered list of profile IDs.
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q
from cv.models import (
    Resume,
    Education,
    Experience,
    Project,
    Skill,
    Language,
    Achievement,
    ProfileEducation,
    ProfileExperience,
    ProfileProject,
    ProfileSkill,
    ProfileLanguage,
    ProfileAchievement,
)


class Command(BaseCommand):
    help = "Migrate existing resume sections to the new profile library (deduplicated per user)."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run in dry-run mode: show what would be done without saving changes.',
        )
        parser.add_argument(
            '--resume-id',
            type=int,
            help='Migrate only a specific resume ID (for testing).',
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        resume_id = options.get('resume_id')

        self.stdout.write(self.style.SUCCESS("🚀 Starting migration to profile library..."))

        # Build queryset
        queryset = Resume.objects.all()
        if resume_id:
            queryset = queryset.filter(id=resume_id)
            if not queryset.exists():
                self.stdout.write(self.style.ERROR(f"❌ Resume with ID {resume_id} not found."))
                return

        total_resumes = queryset.count()
        self.stdout.write(f"📊 Found {total_resumes} resume(s) to process.")

        processed_count = 0
        skipped_count = 0
        error_count = 0

        for resume in queryset.iterator():
            processed_count += 1
            self.stdout.write(f"\n🔄 [{processed_count}/{total_resumes}] Processing resume #{resume.id}: '{resume.title or resume.full_name}'")

            try:
                with transaction.atomic():
                    # --- 1. Migrate Education ---
                    education_ids = []
                    for edu in resume.educations.all().order_by('order', '-start_date'):
                        obj, created = ProfileEducation.objects.get_or_create(
                            user=resume.user,
                            institution=edu.institution,
                            degree=edu.degree,
                            field_of_study=edu.field_of_study,
                            defaults={
                                'start_date': edu.start_date,
                                'end_date': edu.end_date,
                                'description': edu.description,
                            }
                        )
                        # If existing, optionally merge description (keep the longest)
                        if not created and edu.description and len(edu.description) > len(obj.description):
                            obj.description = edu.description
                            obj.save()
                        education_ids.append(obj.id)

                    # --- 2. Migrate Experience ---
                    experience_ids = []
                    for exp in resume.experiences.all().order_by('order', '-start_date'):
                        obj, created = ProfileExperience.objects.get_or_create(
                            user=resume.user,
                            company=exp.company,
                            position=exp.position,
                            defaults={
                                'start_date': exp.start_date,
                                'end_date': exp.end_date,
                                'is_current': exp.is_current,
                                'description': exp.description,
                                'location': exp.location,
                            }
                        )
                        if not created and exp.description and len(exp.description) > len(obj.description):
                            obj.description = exp.description
                            obj.save()
                        experience_ids.append(obj.id)

                    # --- 3. Migrate Project ---
                    project_ids = []
                    for proj in resume.projects.all().order_by('order', '-start_date'):
                        obj, created = ProfileProject.objects.get_or_create(
                            user=resume.user,
                            name=proj.name,
                            defaults={
                                'description': proj.description,
                                'url': proj.url,
                                'start_date': proj.start_date,
                                'end_date': proj.end_date,
                            }
                        )
                        if not created and proj.description and len(proj.description) > len(obj.description):
                            obj.description = proj.description
                            obj.save()
                        project_ids.append(obj.id)

                    # --- 4. Migrate Skill ---
                    skill_ids = []
                    for skill in resume.skills.all().order_by('name'):
                        obj, created = ProfileSkill.objects.get_or_create(
                            user=resume.user,
                            name=skill.name,
                            defaults={'proficiency': skill.proficiency}
                        )
                        if not created and skill.proficiency and not obj.proficiency:
                            obj.proficiency = skill.proficiency
                            obj.save()
                        skill_ids.append(obj.id)

                    # --- 5. Migrate Language ---
                    language_ids = []
                    for lang in resume.languages.all().order_by('name'):
                        obj, created = ProfileLanguage.objects.get_or_create(
                            user=resume.user,
                            name=lang.name,
                            defaults={'proficiency': lang.proficiency}
                        )
                        if not created and lang.proficiency and not obj.proficiency:
                            obj.proficiency = lang.proficiency
                            obj.save()
                        language_ids.append(obj.id)

                    # --- 6. Migrate Achievement ---
                    achievement_ids = []
                    for ach in resume.achievements.all():
                        obj, created = ProfileAchievement.objects.get_or_create(
                            user=resume.user,
                            description=ach.description,
                            defaults={}
                        )
                        achievement_ids.append(obj.id)

                    # --- 7. Update the Resume with the new ID lists ---
                    if not dry_run:
                        resume.profile_education_ids = education_ids
                        resume.profile_experience_ids = experience_ids
                        resume.profile_project_ids = project_ids
                        resume.profile_skill_ids = skill_ids
                        resume.profile_language_ids = language_ids
                        resume.profile_achievement_ids = achievement_ids
                        resume.save(update_fields=[
                            'profile_education_ids',
                            'profile_experience_ids',
                            'profile_project_ids',
                            'profile_skill_ids',
                            'profile_language_ids',
                            'profile_achievement_ids',
                        ])
                        self.stdout.write(self.style.SUCCESS(
                            f"   ✅ Updated resume #{resume.id} with "
                            f"{len(education_ids)} educations, {len(experience_ids)} experiences, "
                            f"{len(project_ids)} projects, {len(skill_ids)} skills, "
                            f"{len(language_ids)} languages, {len(achievement_ids)} achievements."
                        ))
                    else:
                        self.stdout.write(f"   🔍 [DRY RUN] Would update resume #{resume.id} with:")
                        self.stdout.write(f"      - Educations: {len(education_ids)}")
                        self.stdout.write(f"      - Experiences: {len(experience_ids)}")
                        self.stdout.write(f"      - Projects: {len(project_ids)}")
                        self.stdout.write(f"      - Skills: {len(skill_ids)}")
                        self.stdout.write(f"      - Languages: {len(language_ids)}")
                        self.stdout.write(f"      - Achievements: {len(achievement_ids)}")

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"   ❌ Error processing resume #{resume.id}: {str(e)}"))
                error_count += 1
                if not dry_run:
                    # Rollback the transaction for this resume
                    pass  # atomic() will rollback automatically on exception

        # Final summary
        self.stdout.write("\n" + "=" * 60)
        if dry_run:
            self.stdout.write(self.style.WARNING("🔍 DRY RUN COMPLETED – No changes were saved."))
        else:
            self.stdout.write(self.style.SUCCESS("✅ MIGRATION COMPLETED SUCCESSFULLY!"))
        self.stdout.write(f"📊 Processed: {processed_count} resumes")
        self.stdout.write(f"⚠️  Skipped: {skipped_count} resumes (no data to migrate)")
        self.stdout.write(f"❌ Errors: {error_count} resumes")
        self.stdout.write("=" * 60)

        if error_count > 0:
            self.stdout.write(self.style.WARNING(
                "⚠️  Some resumes had errors. Please check the logs above."
            ))
