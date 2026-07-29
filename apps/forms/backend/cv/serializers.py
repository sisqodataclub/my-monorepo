from rest_framework import serializers
from .models import (
    Resume, Education, Experience, Project,
    Skill, Language, Achievement, JobApplication, Tag
)

# ========== Nested Serializers ==========

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date', 'description', 'order'
        ]

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'start_date', 'end_date', 'is_current',
            'description', 'location', 'order'
        ]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'url', 'start_date', 'end_date', 'order'
        ]

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'proficiency']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'proficiency']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'description']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


# ========== Resume Serializer (with nested writes) ==========

class ResumeSerializer(serializers.ModelSerializer):
    educations = EducationSerializer(many=True, required=False)
    experiences = ExperienceSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True, required=False)
    achievements = AchievementSerializer(many=True, required=False)

    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'title',
            'full_name', 'about', 'age', 'email', 'phone',
            'educations', 'experiences', 'projects',
            'skills', 'languages', 'achievements',
            'section_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        educations_data = validated_data.pop('educations', [])
        experiences_data = validated_data.pop('experiences', [])
        projects_data = validated_data.pop('projects', [])
        skills_data = validated_data.pop('skills', [])
        languages_data = validated_data.pop('languages', [])
        achievements_data = validated_data.pop('achievements', [])
        section_order = validated_data.pop('section_order', None)

        resume = Resume.objects.create(**validated_data)

        if section_order is not None:
            resume.section_order = section_order
            resume.save(update_fields=['section_order'])

        for edu_data in educations_data:
            Education.objects.create(resume=resume, **edu_data)
        for exp_data in experiences_data:
            Experience.objects.create(resume=resume, **exp_data)
        for proj_data in projects_data:
            Project.objects.create(resume=resume, **proj_data)
        for skill_data in skills_data:
            Skill.objects.create(resume=resume, **skill_data)
        for lang_data in languages_data:
            Language.objects.create(resume=resume, **lang_data)
        for ach_data in achievements_data:
            Achievement.objects.create(resume=resume, **ach_data)

        return resume

    def update(self, instance, validated_data):
        educations_data = validated_data.pop('educations', None)
        experiences_data = validated_data.pop('experiences', None)
        projects_data = validated_data.pop('projects', None)
        skills_data = validated_data.pop('skills', None)
        languages_data = validated_data.pop('languages', None)
        achievements_data = validated_data.pop('achievements', None)
        section_order = validated_data.pop('section_order', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if section_order is not None:
            instance.section_order = section_order
        instance.save()

        def update_related(related_manager, data_serializer, data_list):
            related_manager.all().delete()
            for item_data in data_list:
                related_manager.create(**item_data)

        if educations_data is not None:
            update_related(instance.educations, EducationSerializer, educations_data)
        if experiences_data is not None:
            update_related(instance.experiences, ExperienceSerializer, experiences_data)
        if projects_data is not None:
            update_related(instance.projects, ProjectSerializer, projects_data)
        if skills_data is not None:
            update_related(instance.skills, SkillSerializer, skills_data)
        if languages_data is not None:
            update_related(instance.languages, LanguageSerializer, languages_data)
        if achievements_data is not None:
            update_related(instance.achievements, AchievementSerializer, achievements_data)

        return instance


# ========== JobApplication Serializer ==========

class JobApplicationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'user', 'job_link', 'company', 'position',
            'date_applied', 'deadline_date',
            'status', 'resume_used', 'notes',
            'tags', 'tag_names', 'status_updated_at',
            'highest_stage_reached',  # <-- added
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'status_updated_at', 'highest_stage_reached']

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        application = JobApplication.objects.create(**validated_data)
        for name in tag_names:
            if name.strip():
                tag, _ = Tag.objects.get_or_create(name=name.strip())
                application.tags.add(tag)
        return application

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tag_names', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            instance.tags.clear()
            for name in tag_names:
                if name.strip():
                    tag, _ = Tag.objects.get_or_create(name=name.strip())
                    instance.tags.add(tag)
        return instance
