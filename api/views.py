import datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from quiz.pagination import CustomPagination
from quiz.models import City, School, Standard, Quiz, Question, Score
from users.models import Profile
from api.serializers import CitiesSerializer, SchoolSerializer, StandardSerializer
from api.serializers import QuizSerializer, QuestionSerializer, AnswerSerializer
from api.serializers import ScoreSerializer, ProfileSerializer
from forms import UserCreationForm, UserProfileForm
# Create your views here.

#User Login
class UserLoginView(CustomPagination):
    """
    Create/ login users
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def post(self, request):
        if 'signup' in request.data:
            #Signup
            form = UserCreationForm(request.data)
            if form.is_valid():
                new_user = form.save()
                new_user = authenticate(
                	username=request.data['username'],
                    password=request.data['password'],
                )
                login(request, new_user)
                #Create Profile for the new user
                dict_for_profile = {
                    'name': request.data['name'],
                }
                profile_form = UserProfileForm(dict_for_profile)
                if profile_form.is_valid():
                    user_profile = profile_form.save(commit=False)
                    user_profile.city = City.objects.get(id=request.data['city'])
                    user_profile.school = School.objects.get(id=request.data['school'])
                    user_profile.standard = Standard.objects.get(id=request.data['standard'])
                    user_profile.user = new_user
                    user_profile.save()
                    return Response({'id': new_user.id, 
                                     'username': new_user.username,
                                     'token': new_user.auth_token.key})
            else:
                return Response({'errors': form.errors, "status": status.HTTP_400_BAD_REQUEST})
        else:
            #SingIn
            username = request.data['username']
            password = request.data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return Response({'id': user.id, 
                                     'username': user.username,
                                     'email': user.email,
                                     'token': user.auth_token.key})
                else:
                    # Return a 'disabled account' error message
                    return Response({'errors': form.errors})
            else:

            	return Response({'errors': "Incorrect username or password","status" :status.HTTP_400_BAD_REQUEST})


class CityListView(CustomPagination):
    """
    Get cities
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request):
        cities = City.objects.all()
        serializer = CitiesSerializer(cities, many=True)
        return Response(serializer.data)


class CitySchoolListView(CustomPagination):
    """
    Get schools in a city
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, pk):
        schools = School.objects.filter(city_id=pk)
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)


class StandardListView(CustomPagination):
    """
    Get standards
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, pk):
        standards = Standard.objects.filter(school_id=pk)
        serializer = StandardSerializer(standards, many=True)
        return Response(serializer.data)


class QuizListView(CustomPagination):
    """
    Get quizes
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request):
        quizes = Quiz.objects.filter()
        serializer = QuizSerializer(quizes, many=True)
        return Response(serializer.data)


class QuestionListView(CustomPagination):
    """
    Get questions
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, pk):
        questions = Question.objects.filter(quiz__id=pk)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


class AnswerListView(CustomPagination):
    """
    Get answers
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def post(self, request, u_id, q_id):
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'errors': serializer.errors, "status": status.HTTP_400_BAD_REQUEST})


class ScoreView(CustomPagination):
    """
    Get scores
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def post(self, request, u_id, q_id):
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'errors': serializer.errors, "status": status.HTTP_400_BAD_REQUEST})


class UserQuizListView(CustomPagination):
    """
    Get given user attempted quizes
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, u_id):
        quizes = Score.objects.filter(owned_by__id=u_id).order_by('-created_on')
        serializer = ScoreSerializer(quizes, many=True)
        return Response(serializer.data)


class LeaderBoardListView(CustomPagination):
    """
    Get leaderboard
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request):
        user_ids = []
        if int(request.query_params['city']) > 0:
            city_id = request.query_params['city']
            user_ids = Profile.objects.filter(city_id=city_id).values_list('user_id', flat=True)

        if int(request.query_params['school']) > 0:
            school_id = request.query_params['school']
            user_ids = Profile.objects.filter(school_id=school_id).values_list('user_id', flat=True)
        if int(request.query_params['city']) > 0 or int(request.query_params['school']) > 0:
            quizes = Score.objects.filter(owned_by__id__in=user_ids).order_by('-score')[:5]
        else:
            quizes = Score.objects.all().order_by('-score')[:5]
        serializer = ScoreSerializer(quizes, many=True)
        for score in serializer.data:
            profile = ProfileSerializer(Profile.objects.filter(user=score['owned_by']), many=True)
            score.update({'profile_details': profile.data})
        return Response(serializer.data)


class SchoolListView(CustomPagination):
    """
    Get schools
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request):
        schools = School.objects.all()
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)


class StaffQuizListView(CustomPagination):
    """
    Get scores of student of the logged in staff
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, s_id):
        user_ids = []
        # Get Staff's Profile object
        profile = Profile.objects.get(user=request.user)
        user_ids = Profile.objects.filter(standard_id=profile.standard_id).values_list('user_id', flat=True)
        scores = Score.objects.filter(owned_by__id__in=user_ids).order_by('-created_on')
        serializer = ScoreSerializer(scores, many=True)
        for score in serializer.data:
            profile = ProfileSerializer(Profile.objects.filter(user=score['owned_by']), many=True)
            score.update({'profile_details': profile.data})
        return Response(serializer.data)