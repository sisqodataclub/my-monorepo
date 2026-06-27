from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import DetailView
from django.urls import reverse
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from rest_framework import viewsets
from rest_framework.permissions import AllowAny  # <-- changed from IsAuthenticated
from django.contrib.auth import logout
from .models import Resume, JobApplication  # <-- added JobApplication
from .forms import ResumeForm
from .serializers import ResumeSerializer, JobApplicationSerializer  # <-- added

User = get_user_model()

# -----------------------------------------------------------------
# WEB VIEWS (for server-rendered pages) – authentication removed
# -----------------------------------------------------------------

def create_resume(request, resume_id=None):
    """Handles creating/editing a resume – no login required."""
    if resume_id:
        resume_instance = get_object_or_404(Resume, id=resume_id)  # no user filter
    else:
        resume_instance = None

    if request.method == "POST":
        form = ResumeForm(request.POST, instance=resume_instance)
        if form.is_valid():
            resume = form.save(commit=False)
            # resume.user is optional; we don't set it now
            resume.save()
            return redirect(reverse('resume_detail', kwargs={'resume_id': resume.id}))
    else:
        form = ResumeForm(instance=resume_instance)

    return render(request, 'resumesite/resume_form.html', {
        'form': form,
        'resume_id': resume_id,
        'is_edit': resume_id is not None
    })
edit_resume = create_resume

def resume_detail(request, resume_id):
    """Fetches a resume by ID – no user ownership check."""
    resume = get_object_or_404(Resume, id=resume_id)
    skills_list = [s.strip() for s in resume.skills.split(',') if s.strip()]
    languages_list = [l.strip() for l in resume.languages.split(',') if l.strip()]
    achievements_list = [a.strip() for a in resume.achievements.split(',') if a.strip()]

    return render(request, 'resumesite/resume_detail.html', {
        'resume': resume,
        'skills_list': skills_list,
        'languages_list': languages_list,
        'achievements_list': achievements_list,
    })

def delete_resume(request, resume_id):
    """Delete a resume – no login required."""
    resume = get_object_or_404(Resume, id=resume_id)
    if request.method == 'POST':
        resume.delete()
        return redirect('resume_create')

    return HttpResponse(f"""
        <div class="form-container" style="text-align: center;">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to permanently delete the resume for <strong>{resume.full_name}</strong>?</p>
            <form method='POST' action=''>
                {% csrf_token %}
                <button type='submit' style='background-color: red; color: white; padding: 10px; border: none; cursor: pointer;'>
                    Yes, Delete
                </button>
            </form>
            <p style='margin-top: 15px;'><a href='{reverse('resume_detail', kwargs={'resume_id': resume.id})}'>No, Go Back</a></p>
        </div>
    """)

def register(request):
    """User registration (still uses Django auth – but you can use HVT later)."""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

class ResumeDetailView(DetailView):
    model = Resume
    template_name = 'resumesite/resume_detail.html'
    context_object_name = 'resume'

    def get_queryset(self):
        # No user filtering – return all resumes
        return Resume.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        resume = context.get('resume')
        if resume:
            context['skills_list'] = [s.strip() for s in resume.skills.split(',') if s.strip()]
            context['languages_list'] = [l.strip() for l in resume.languages.split(',') if l.strip()]
            context['achievements_list'] = [a.strip() for a in resume.achievements.split(',') if a.strip()]
        return context

def react_demo_view(request):
    return render(request, 'resumesite/react_demo.html')

def custom_logout(request):
    logout(request)
    return render(request, 'registration/logged_out.html')

# -----------------------------------------------------------------
# API VIEWSETS (no authentication required)
# -----------------------------------------------------------------

class ResumeViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for Resumes – anyone can create, read, update, delete.
    """
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [AllowAny]   # <-- no auth required

    # No need to override perform_create – user is optional

class JobApplicationViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for Job Applications – anyone can create, read, update, delete.
    """
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [AllowAny]
