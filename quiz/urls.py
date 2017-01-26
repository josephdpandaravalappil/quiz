from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from views import HomeView, QuizView, QuestionView

urlpatterns = [
    # Examples:
    # url(r'^$', 'quiz.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', HomeView.as_view(), name='home_view'),
    url(r'^quiz/$', login_required((QuizView.as_view())), name='quiz_view'),
    url(r'^questions/$', login_required(QuestionView.as_view()), name='question_view'),

    url(r'^users/', include('users.urls')),
    url(r'^api/', include('api.urls')),
]
