from django.conf.urls import include, url
from django.contrib import admin
from views import HomeView

urlpatterns = [
    # Examples:
    # url(r'^$', 'quiz.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', HomeView.as_view(), name='home_view'),

    url(r'^users/', include('users.urls')),
]
