# pdf_converter/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from .models import EmailLoginCode
from .auth_service import AuthService
from django.http import Http404

def login_page(request):
    """Show the email input form."""
    return render(request, 'pdf_converter/login.html')

def request_login_code(request):
    """Handle the POST of the email form."""
    if request.method == 'POST':
        email = request.POST.get('email')
        AuthService.send_login_email(request, email)
        # Redirect to a "Check your inbox" page
        return render(request, 'pdf_converter/check_inbox.html', {'email': email})
    return redirect('pdf_converter:login_page')

def verify_login(request, code):
    """Handle the magic link click."""
    try:
        login_code = EmailLoginCode.objects.get(code=code)
    except EmailLoginCode.DoesNotExist:
        raise Http404("Invalid or expired login link.")
    
    if not login_code.is_valid():
        raise Http404("This link has expired or has already been used.")
    
    # Mark as used so it can't be reused
    login_code.is_used = True
    login_code.save()
    
    # Log the user in
    user = login_code.user
    login(request, user)
    
    # Set session expiry to 7 days (604800 seconds)
    request.session.set_expiry(604800)
    
    # Redirect to the protected dashboard
    return redirect('pdf_converter:dashboard')

@login_required
def dashboard(request):
    # Protected view!
    return render(request, 'pdf_converter/dashboard.html', {
        'user': request.user
    })
