from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Resume
from .forms import ResumeForm
from django.db.models import fields
from . import views
User = get_user_model() 

BASE_REQUIRED_DATA = {
    'full_name': 'Test Name',
    'email': 'test@example.com',
    'phone': '1234567890',
    'about': 'A brief professional summary.',
    'age': 30,
    
    'skills': 'Python, Django, HTML, CSS', 
    'languages': 'English, Hindi',
    'achievements': 'Cert 1, Award 2',
    
    'education1': 'BSc | Test College | 2018',
    'project1': 'Test Project | 3 Months | Web App',
    'experience1': 'Test Company | Developer | 1 Year',
    
    'education2': '', 
    'education3': '', 
    'project2': '',
    'experience2': '',
}


class ResumeModelAndFormTest(TestCase):
    """Tests the Model structure and custom form validation (Experiment CO3)."""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='testuser', password='password123')
        
        cls.resume_data = BASE_REQUIRED_DATA.copy() 
        cls.resume_data['user'] = cls.user
        
        cls.resume = Resume.objects.create(**cls.resume_data)


    def test_resume_model_fields(self):
        """Verifies basic model fields and __str__ method."""
        self.assertEqual(self.resume.full_name, 'Test Name')
        self.assertEqual(self.resume.user, self.user)
        self.assertEqual(str(self.resume), 'Test Name')

    def test_skills_validation_enforcement(self):
        """Tests the custom validation requiring at least 3 skills."""
        
        # Test valid data (4 skills) - Should pass
        data_valid = self.resume_data.copy() 
        data_valid['skills'] = 'Skill A, Skill B, Skill C, Skill D'
        form_valid = ResumeForm(data=data_valid)
        self.assertTrue(form_valid.is_valid(), f"Form should be valid: {form_valid.errors}") 

        # Test invalid data (2 skills) - Should fail
        data_invalid = self.resume_data.copy() 
        data_invalid['skills'] = 'Skill A, Skill B'
        form_invalid = ResumeForm(data=data_invalid)
        self.assertFalse(form_invalid.is_valid(), "Form should be invalid with less than 3 skills.")
        self.assertIn('skills', form_invalid.errors)


class SecureResumeViewTest(TestCase):
    """Tests the view behavior for authentication and secure CRUD operations (Experiment CO5)."""

    def setUp(self):
        Resume.objects.all().delete()
        
        self.client = Client()
        self.user = User.objects.create_user(username='owner', password='password123')
        self.other_user = User.objects.create_user(username='intruder', password='password123')
        
        # Create one clean resume owned by the 'owner' for testing
        initial_data = BASE_REQUIRED_DATA.copy()
        initial_data['user'] = self.user
        initial_data['full_name'] = 'Owner Resume' 
        self.resume = Resume.objects.create(**initial_data) # This creates 1 resume. Start count is 1.
        
        # Define URLs using reverse lookup
        self.detail_url = reverse('resume_detail', args=[self.resume.id])
        self.edit_url = reverse('resume_edit', args=[self.resume.id])
        self.delete_url = reverse('resume_delete', args=[self.resume.id])
        self.create_url = reverse('resume_create') # Maps to /resume/create/
        
        # Data needed for posting requests (complete data set)
        self.valid_post_data = BASE_REQUIRED_DATA.copy()


    # --- Authentication and Security Tests ---

    def test_view_protection(self):
        """Tests that unauthenticated access redirects to login."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 302)

    def test_read_detail_security_fail(self):
        """Tests that an intruder cannot view another user's resume."""
        self.client.login(username='intruder', password='password123')
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 404) 

    # --- CRUD Tests (Create, Update, Delete) ---

    def test_create_resume_success(self):
        """Tests the successful creation of a new resume (C) via POST."""
        self.client.login(username='owner', password='password123')
        
        post_data_copy = self.valid_post_data.copy()
        post_data_copy['full_name'] = 'New Resume Post'
        
        initial_count = Resume.objects.count() # Get count before POST (Should be 1)
        
        response = self.client.post(self.create_url, data=post_data_copy, follow=True)
        
        # Should redirect successfully (resulting in a 200 status on the final detail view)
        self.assertEqual(response.status_code, 200) 
        self.assertEqual(Resume.objects.count(), initial_count + 1, 
                         "The total resume count did not increase by 1 after creation.")
                         
        # Check existence using the name
        self.assertTrue(Resume.objects.filter(full_name='New Resume Post', user=self.user).exists(),
                        "Could not find the newly created resume object.")


    def test_update_resume_success(self):
        """Tests successful editing of an existing resume (U)."""
        self.client.login(username='owner', password='password123')
        
        updated_data = self.valid_post_data.copy()
        updated_data['full_name'] = 'Updated Name' 
        
        response = self.client.post(self.edit_url, data=updated_data, follow=True)

        # Check for successful update and redirection
        self.assertEqual(response.status_code, 200) 
        
        # Refresh instance from database before checking value
        self.resume.refresh_from_db() 
        self.assertEqual(self.resume.full_name, 'Updated Name')

    def test_delete_resume_success(self):
        """Tests the successful deletion of an existing resume (D) via POST."""
        self.client.login(username='owner', password='password123')
        
        # Send POST request to the delete URL
        response = self.client.post(self.delete_url, follow=True)
        
        # Should redirect successfully (back to resume_create)
        self.assertEqual(response.status_code, 200) 
        
        # Check that the object no longer exists
        self.assertFalse(Resume.objects.filter(id=self.resume.id).exists())
