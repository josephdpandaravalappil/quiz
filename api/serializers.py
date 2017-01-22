from rest_framework import serializers
from quiz.models import City, School, Standard


class CitiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = ('id', 'name')


class SchoolSerializer(serializers.ModelSerializer):

    class Meta:
        model = School
        fields = ('id', 'name')


class StandardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Standard
        fields = ('id', 'name')        


