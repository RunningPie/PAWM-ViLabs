from django.db import models
from django.db.models import JSONField
from django.contrib.auth.models import User

# Create your models here
class UserProgress (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_id = models.CharField(max_length=100)
    progress = JSONField()
    completed = models.BooleanField(default=False)
    reset = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Progress for {self.user.username} on {self.exercise_id}"