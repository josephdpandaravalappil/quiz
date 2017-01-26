from django.shortcuts import render
from django.views.generic import View
from django.contrib.auth import logout
from django.http import HttpResponse, Http404
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
# Create your views here.


class LogInView(View):
    template_name = 'users/login.html'

    def get(self, request):
        return render(request, self.template_name)


class LogOutView(View):

    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse('home_view'))


class ProfileView(View):

    template_name = 'users/profile.html'

    def get(self, request):

        if self.request.user.is_staff:
            return render(request, 'users/staff_profile.html')
        return render(request, self.template_name)
