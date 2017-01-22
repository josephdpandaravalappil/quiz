from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class City(models.Model):

    name = models.CharField(max_length=30)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)


class School(models.Model):

    name = models.CharField(max_length=30)
    city = models.ForeignKey(City)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)


class Standard(models.Model):

    name = models.CharField(max_length=30)
    school = models.ForeignKey(School)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
