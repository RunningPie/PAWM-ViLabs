from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('aboutus/', views.aboutus, name='aboutus'),
    path('courses/', views.courses, name='courses'),
    path('decom/', views.decom, name='decom'),
    path('comingsoon/', views.comingsoon, name='comingsoon'),
]