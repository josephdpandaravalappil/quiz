from django.views.generic import View
from django.shortcuts import render


class HomeView(View):
    template_name = 'quiz/home.html'

    def get(self, request):
        return render(request, self.template_name)


class QuizView(View):
    template_name = 'quiz/quiz.html'

    def get(self, request):
        return render(request, self.template_name)


class QuestionView(View):
    template_name = 'quiz/question.html'

    def get(self, request):
        return render(request, self.template_name)


class QuizReviewView(View):
    template_name = 'quiz/review.html'

    def get(self, request, u_id, q_id):
        return render(request, self.template_name)
