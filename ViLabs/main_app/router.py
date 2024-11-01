from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.profile_view, name='profile'),
    path('aboutus/', views.aboutus_view, name='aboutus'),
    path('courses/', views.courses_view, name='courses'),
    path('decom/', views.decom_view, name='decom'),
    path('comingsoon/', views.comingsoon_view, name='comingsoon'),
]