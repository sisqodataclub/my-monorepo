# backend/cv/serializers.py

from rest_framework import serializers
from .models import (
    # Legacy models
    Resume, Education, Experience, Project,
    Skill, Language, Achievement,
    # New profile models
    ProfileEducation, ProfileExperience, ProfileProject,
    ProfileSkill, ProfileLanguage, ProfileAchievement,
    # Others
    JobApplication, Tag
)

# ============================================================================
# Legacy Nested Serializers (read-only for new usage)
# ============================================================================

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


# ============================================================================
# New Profile Serializers (full CRUD)
# ============================================================================

class ProfileEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileEducation
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileExperience
        fields = [
            'id', 'company', 'position', 'start_date', 'end_date',
            'is_current', 'description', 'location',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileProject
        fields = [
            'id', 'name', 'description', 'url', 'start_date', 'end_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSkill
        fields = ['id', 'name', 'proficiency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileLanguage
        fields = ['id', 'name', 'proficiency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileAchievement
        fields = ['id', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# Resume Serializer (supports both legacy nested and new profile IDs)
# ============================================================================

class ResumeSerializer(serializers.ModelSerializer):
    # Legacy nested fields – now read-only (for backward compatibility)
    educations = EducationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    achievements = AchievementSerializer(many=True, read_only=True)

    # New profile ID lists – writeable
    profile_education_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
        help_text="List of ProfileEducation IDs (ordered)"
    )
    profile_experience_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
        help_text="List of ProfileExperience IDs (ordered)"
    )
    profile_project_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
        help_text="List of ProfileProject IDs (ordered)"
    )
    profile_skill_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
        help_text="List of ProfileSkill IDs (ordered)"
    )
    profile_language_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
        help_text="List of ProfileLanguage IDs (ordered)"
    )
    profile_achievement_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
        help_text="List of ProfileAchievement IDs (ordered)"
    )

    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'title',
            'full_name', 'about', 'age', 'email', 'phone',
            # Legacy nested fields (read-only)
            'educations', 'experiences', 'projects',
            'skills', 'languages', 'achievements',
            # New profile ID lists
            'profile_education_ids', 'profile_experience_ids',
            'profile_project_ids', 'profile_skill_ids',
            'profile_language_ids', 'profile_achievement_ids',
            'section_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Pop the new ID lists (they are stored directly)
        profile_education_ids = validated_data.pop('profile_education_ids', [])
        profile_experience_ids = validated_data.pop('profile_experience_ids', [])
        profile_project_ids = validated_data.pop('profile_project_ids', [])
        profile_skill_ids = validated_data.pop('profile_skill_ids', [])
        profile_language_ids = validated_data.pop('profile_language_ids', [])
        profile_achievement_ids = validated_data.pop('profile_achievement_ids', [])

        # Legacy nested data is read-only, so we ignore them (they won't be in validated_data)
        section_order = validated_data.pop('section_order', None)

        resume = Resume.objects.create(**validated_data)

        if section_order is not None:
            resume.section_order = section_order

        # Assign the ID lists
        resume.profile_education_ids = profile_education_ids
        resume.profile_experience_ids = profile_experience_ids
        resume.profile_project_ids = profile_project_ids
        resume.profile_skill_ids = profile_skill_ids
        resume.profile_language_ids = profile_language_ids
        resume.profile_achievement_ids = profile_achievement_ids
        resume.save()

        return resume

    def update(self, instance, validated_data):
        # Pop the new ID lists
        profile_education_ids = validated_data.pop('profile_education_ids', None)
        profile_experience_ids = validated_data.pop('profile_experience_ids', None)
        profile_project_ids = validated_data.pop('profile_project_ids', None)
        profile_skill_ids = validated_data.pop('profile_skill_ids', None)
        profile_language_ids = validated_data.pop('profile_language_ids', None)
        profile_achievement_ids = validated_data.pop('profile_achievement_ids', None)
        section_order = validated_data.pop('section_order', None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if section_order is not None:
            instance.section_order = section_order

        # Update ID lists if provided
        if profile_education_ids is not None:
            instance.profile_education_ids = profile_education_ids
        if profile_experience_ids is not None:
            instance.profile_experience_ids = profile_experience_ids
        if profile_project_ids is not None:
            instance.profile_project_ids = profile_project_ids
        if profile_skill_ids is not None:
            instance.profile_skill_ids = profile_skill_ids
        if profile_language_ids is not None:
            instance.profile_language_ids = profile_language_ids
        if profile_achievement_ids is not None:
            instance.profile_achievement_ids = profile_achievement_ids

        instance.save()
        return instance


# ============================================================================
# JobApplication Serializer (unchanged)
# ============================================================================

class JobApplicationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = JobApplication
        fields = [
            'id', 'user', 'job_link', 'company', 'position',
            'date_applied', 'deadline_date',
            'status', 'resume_used', 'notes',
            'tags', 'tag_names', 'status_updated_at',
            'highest_stage_reached',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'user', 'created_at', 'updated_at',
            'status_updated_at', 'highest_stage_reached'
        ]

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
