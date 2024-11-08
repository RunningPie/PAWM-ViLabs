from django import forms
from django.contrib.auth.models import User

class RegisterForm(forms.ModelForm):
    username = forms.CharField(widget=forms.TextInput, help_text='', max_length=255, required=True, label="username")
    password = forms.CharField(widget=forms.PasswordInput, required=True, label="Password")
    password_confirm = forms.CharField(widget=forms.PasswordInput, required=True, label="Confirm Password")
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')
        
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password and password_confirm and password != password_confirm:
            print("berhasil2")
            raise forms.ValidationError("Passwords do not match")
        
        return cleaned_data