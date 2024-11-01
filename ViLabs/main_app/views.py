from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.http import url_has_allowed_host_and_scheme
from django.contrib.auth.models import User
from .forms import RegisterForm

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = User.objects.create(username=username)
            user.set_password(password)
            user.save()
            login(request, user)
            return redirect('/')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    next_url = request.GET.get('next') if request.method == 'GET' else request.POST.get('next')
    default_url = '/'
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            if next_url and url_has_allowed_host_and_scheme(
                url=next_url,
                allowed_hosts={request.get_host()},
                require_https=request.is_secure()
            ):
                return redirect(next_url)
            return redirect(default_url)
        else:
            return render(request, 'login.html', {
                'error': 'Invalid username or password',
                'next': next_url
            })
    
    return render(request, 'login.html', {'next': next_url})

def logout_view(request):
    logout(request)
    return redirect('login')
    
@login_required
def profile_view(request):
    return render(request, 'profile.html', {'logged_in': request.user.is_authenticated})

def index_view(request):
    return render(request, 'index.html', {'logged_in': request.user.is_authenticated})

def aboutus_view(request):
    return render(request, 'aboutus.html', {'logged_in': request.user.is_authenticated})

@login_required
def courses_view(request):
    return render(request, 'courses.html', {'logged_in': True})

@login_required
def decom_view(request):
    return render(request, 'decom.html', {'logged_in': True})

def comingsoon_view(request):
    return render(request, 'comingsoon.html', {'logged_in': request.user.is_authenticated})
