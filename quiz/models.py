from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class City(models.Model):

    name = models.CharField(max_length=30)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return self.name


class School(models.Model):

    name = models.CharField(max_length=30)
    city = models.ForeignKey(City)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return self.name


class Standard(models.Model):

    name = models.CharField(max_length=30)
    school = models.ForeignKey(School)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return self.name


class Quiz(models.Model):

    name = models.CharField(max_length=30)
    starts = models.DateTimeField()
    ends = models.DateTimeField()
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return self.name


class Question(models.Model):

    TYPE_CHOICES = (
        ('e', 'Essay'),
        ('m', 'Multiple Choice'),
    )

    question = models.CharField(max_length=200)
    choice_a = models.CharField(max_length=50, blank=True)
    choice_b = models.CharField(max_length=50, blank=True)
    choice_c = models.CharField(max_length=50, blank=True)
    choice_d = models.CharField(max_length=50, blank=True)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    ans = models.TextField()
    mark = models.IntegerField()
    quiz = models.ManyToManyField(Quiz, related_name='quiz')
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return 'Qus: ' + self.question + ', Ans: ' + self.ans


class Answer(models.Model):

    quiz = models.ForeignKey(Quiz)
    question = models.ForeignKey(Question)
    status = models.BooleanField(max_length=50)
    answer = models.TextField()
    answered_by = models.ForeignKey(User)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __unicode__(self):
       return self.quiz    


class Score(models.Model):

    score = models.IntegerField()
    quiz = models.ForeignKey(Quiz)
    owned_by = models.ForeignKey(User)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)