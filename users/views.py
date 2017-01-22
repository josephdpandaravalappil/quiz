from django.shortcuts import render
from django.views.generic import View

# Create your views here.


class LogInView(View):
    template_name = 'users/login.html'

    def get(self,request):
        return render(request, self.template_name)
