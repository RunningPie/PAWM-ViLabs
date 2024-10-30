from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=200, unique=True, primary_key=True)
    password = models.CharField(max_length=20)