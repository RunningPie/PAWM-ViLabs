from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.contrib.auth.models import User
from .forms import RegisterForm

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = User.objects.create(username=username, password=password)
            login(request, user)
            return redirect('/')
        else:
            form = RegisterForm()
            return render(request, 'register.html', {'form': form})
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            return render(request, 'login.html', {'error': 'Invalid username or password'})
    else:
        return render(request, 'login.html')

def logout(request):
    if request.method == "POST":
        logout(request)
        return redirect('login')
    else:
        return redirect('/')
    
def index(request):
    return render(request, 'index.html')
def aboutus(request):
    return render(request, 'aboutus.html')
@login_required
def courses(request):
    return render(request, 'courses.html')
@login_required
def decom(request):
    return render(request, 'decom.html')
def comingsoon(request):
    return render(request, 'comingsoon.html')