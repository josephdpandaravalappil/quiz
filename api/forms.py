from django.forms import ModelForm
from django.contrib.auth.models import User

from users.models import Profile


class UserCreationForm(ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password', 'is_staff']

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['name']
        exclude = ['city', 'school', 'standard', 'user']
