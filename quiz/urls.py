from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from quiz import settings
from views import HomeView, QuizView, QuestionView, QuizReviewView


urlpatterns = [
    # Examples:
    # url(r'^$', 'quiz.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', HomeView.as_view(), name='home_view'),
    url(r'^quiz/$', login_required((QuizView.as_view())), name='quiz_view'),
    url(r'^questions/$', login_required(QuestionView.as_view()), name='question_view'),
    url(r'^users/(?P<u_id>[0-9]+)/quizes/(?P<q_id>[0-9]+)/review/$', QuizReviewView.as_view(), name='quiz_review'),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^users/', include('users.urls')),
    url(r'^api/', include('api.urls')),
]
