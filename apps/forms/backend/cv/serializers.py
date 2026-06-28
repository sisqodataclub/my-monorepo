from rest_framework import serializers
from .models import Resume, JobApplication

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = (
            'id', 'user', 'full_name', 'about', 'age', 'email', 'phone',
            'skills', 'languages', 'education1', 'education2', 'education3',
            'project1', 'project2', 'experience1', 'experience2',
            'achievements', 'created_at', 'updated_at'
        )
        read_only_fields = ('user', 'created_at', 'updated_at')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        list_fields = ['skills', 'languages', 'achievements']
        for field_name in list_fields:
            value = representation.get(field_name)
            if value:
                representation[field_name] = [s.strip() for s in value.split(',') if s.strip()]
            else:
                representation[field_name] = []
        return representation

    def to_internal_value(self, data):
        mutable_data = data.copy()
        list_fields = ['skills', 'languages', 'achievements']
        for field_name in list_fields:
            value = mutable_data.get(field_name)
            if isinstance(value, list):
                mutable_data[field_name] = ', '.join([str(s).strip() for s in value if str(s).strip()])
        return super().to_internal_value(mutable_data)


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = (
            'id', 'user', 'job_link', 'company', 'position', 'date_applied',
            'status', 'resume_used', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('user', 'created_at', 'updated_at')
