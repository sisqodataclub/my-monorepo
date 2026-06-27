from django import forms
from .models import Resume

class ResumeForm(forms.ModelForm):
    def clean_skills(self):
        skills_raw = self.cleaned_data.get('skills')
        
        # Split and strip whitespace from the list of skills
        skills_list = [s.strip() for s in skills_raw.split(',') if s.strip()]
        
        # Enforce the rule: minimum 3 skills
        if len(skills_list) < 3:
            raise forms.ValidationError(
                "Please list at least three distinct skills, separated by commas."
            )
        
        return skills_raw

    class Meta:
        model = Resume
        exclude = ('user',) 
        
        # 3. Widget Definitions (Necessary for the test POST data)
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Full Name'}),
            'about': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Summary'}),
            'age': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Age'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Phone'}),
            'skills': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Python, Django, HTML'}),
            'languages': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'English, Hindi'}),
            'achievements': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Awards'}),
            'education1': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Degree, College, Year'}),
            'education2': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Optional'}),
            'education3': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Optional'}),
            'project1': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Title, Duration, Description'}),
            'project2': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Optional'}),
            'experience1': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Company, Position, Details'}),
            'experience2': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Optional'}),
        }