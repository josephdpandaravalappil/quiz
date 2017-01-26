from django.conf.urls import patterns, include, url
from api.views import UserLoginView, CityListView, SchoolListView, StandardListView
from api.views import QuizListView, QuestionListView, AnswerListView, ScoreView
from api.views import UserQuizListView, LeaderBoardListView, CitySchoolListView
from api.views import StaffQuizListView

urlpatterns = patterns('',
   
   url(r'^cities/$', CityListView.as_view(), name='api_cities'),
   url(r'^schools/$', SchoolListView.as_view(), name='api_schools'),
   url(r'^quizes/$', QuizListView.as_view(), name='api_quizes'),
   url(r'^lboard/$', LeaderBoardListView.as_view(), name='api_lboard'),

   url(r'^users/login$', UserLoginView.as_view(), name='api_login'),

   url(r'^schools/(?P<pk>[0-9]+)/standards/$', StandardListView.as_view(), name='api_standard'),
   url(r'^cities/(?P<pk>[0-9]+)/schools/$', CitySchoolListView.as_view(), name='api_city_schools'),
   url(r'^quizes/(?P<pk>[0-9]+)/questions/$', QuestionListView.as_view(), name='api_questions'),
   url(r'^users/(?P<u_id>[0-9]+)/quizes/$', UserQuizListView.as_view(), name='api_user_quizes'),
   url(r'^staff/(?P<s_id>[0-9]+)/quizes/$', StaffQuizListView.as_view(), name='api_staff_quizes'),
   
   url(r'^users/(?P<u_id>[0-9]+)/quizes/(?P<q_id>[0-9]+)/answers/$', AnswerListView.as_view(), name='api_answers'),
   url(r'^users/(?P<u_id>[0-9]+)/quizes/(?P<q_id>[0-9]+)/score/$', ScoreView.as_view(), name='api_score'),
)