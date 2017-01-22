from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.shortcuts import render

from django.contrib.auth import authenticate, login, logout
from quiz.pagination import CustomPagination
from quiz.models import City, School, Standard
from api.serializers import CitiesSerializer, SchoolSerializer, StandardSerializer
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
                    # 'city': City.objects.get(id=request.data['city']),
                    # 'school': School.objects.get(id=request.data['school']),
                    # 'standard': Standard.objects.get(id=request.data['standard']),
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


class SchoolListView(CustomPagination):
    """
    Get schools
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, pk):
        schools = School.objects.filter(city_id=pk)
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)


class StandardListView(CustomPagination):
    """
    Get schools
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def get(self, request, pk):
        standards = Standard.objects.filter(school_id=pk)
        serializer = StandardSerializer(standards, many=True)
        return Response(serializer.data)