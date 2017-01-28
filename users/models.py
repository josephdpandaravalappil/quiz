from django.db import models
from django.contrib.auth.models import User

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from quiz.models import City, School, Standard
# Create your models here.


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Create your models here.
class Profile(models.Model):
    name = models.CharField(max_length=30, blank=True)
    user = models.ForeignKey(User)
    city = models.ForeignKey(City)
    school = models.ForeignKey(School)
    standard = models.ForeignKey(Standard)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return self.name