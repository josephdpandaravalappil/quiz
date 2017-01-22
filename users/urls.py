from django.conf.urls import patterns, include, url
from django.contrib import admin
from views import LogInView


urlpatterns = patterns('',

    url(r'^users/', include(admin.site.urls)),
    url(r'^login$', LogInView.as_view(), name='login'),
)
