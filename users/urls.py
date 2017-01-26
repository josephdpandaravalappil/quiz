from django.conf.urls import patterns, include, url
from django.contrib import admin
from views import LogInView, LogOutView, ProfileView
from django.contrib.auth.decorators import login_required


urlpatterns = patterns('',

    url(r'^users/', include(admin.site.urls)),
    url(r'^profile/$', login_required(ProfileView.as_view()), name='profile_view'),
    url(r'^login$', LogInView.as_view(), name='login'),
    url(r'^logout$', LogOutView.as_view(), name='logout'),
)
