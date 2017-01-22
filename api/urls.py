from django.conf.urls import patterns, include, url
from api.views import UserLoginView, CityListView, SchoolListView, StandardListView

urlpatterns = patterns('',
   
   url(r'^schools/(?P<pk>[0-9]+)/standards/$', StandardListView.as_view(), name='api_standard'),
   url(r'^cities/(?P<pk>[0-9]+)/schools/$', SchoolListView.as_view(), name='api_schools'),
   url(r'^cities/$', CityListView.as_view(), name='api_cities'),
   url(r'^users/login$', UserLoginView.as_view(), name='api_login'),
)