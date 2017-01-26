from rest_framework import serializers
from django.contrib.auth.models import User
from quiz.models import City, School, Standard, Quiz, Question, Answer, Score
from users.models import Profile


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User


class CitiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = ('id', 'name')


class ProfileSerializer(serializers.ModelSerializer):
    city_details = CitiesSerializer(source='city', read_only=True)
    school_details = CitiesSerializer(source='school', read_only=True)
    standard_details = CitiesSerializer(source='standard', read_only=True)
    class Meta:
        model = Profile
        fields = ('id', 'name', 'city_details', 'school_details', 'standard_details')


class SchoolSerializer(serializers.ModelSerializer):

    class Meta:
        model = School
        fields = ('id', 'name')


class StandardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Standard
        fields = ('id', 'name')


class QuizSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quiz
        fields = ('id', 'name', 'starts', 'duration')


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = ('id', 'question', 'choice_a', 'choice_b',
                  'choice_c', 'choice_d', 'mark', 'ans')


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ('id', 'question', 'quiz', 'status', 'answered_by', 'answer')


class ScoreSerializer(serializers.ModelSerializer):
    quiz_details = QuizSerializer(source='quiz', read_only=True)
    user_details = UserSerializer(source='owned_by', read_only=True)
    profile_details = ProfileSerializer(source='user_details', read_only=True)

    class Meta:
        model = Score
        fields = ('id', 'quiz', 'created_on', 'quiz_details', 'score', 'owned_by', 'user_details', 'profile_details')
