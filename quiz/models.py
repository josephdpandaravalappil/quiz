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


class Quiz(models.Model):

    name = models.CharField(max_length=30)
    starts = models.DateTimeField()
    duration = models.TimeField()
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)


class Question(models.Model):

    question = models.CharField(max_length=200)
    choice_a = models.CharField(max_length=50)
    choice_b = models.CharField(max_length=50)
    choice_c = models.CharField(max_length=50)
    choice_d = models.CharField(max_length=50)
    ans = models.TextField()
    mark = models.IntegerField()
    quiz = models.ManyToManyField(Quiz, related_name='quiz')
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)


class Answer(models.Model):

    quiz = models.ForeignKey(Quiz)
    question = models.ForeignKey(Question)
    status = models.BooleanField(max_length=50)
    answer = models.TextField()
    answered_by = models.ForeignKey(User)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)


class Score(models.Model):

    score = models.IntegerField()
    quiz = models.ForeignKey(Quiz)
    owned_by = models.ForeignKey(User)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)