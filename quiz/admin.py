from django.contrib import admin
from import_export import resources
from import_export.admin import ImportMixin
from models import City, School, Standard, Quiz, Question
# Register your models here.


# import-export resource
class QuestionResource(resources.ModelResource):

    class Meta:
        model = Question
        fields = ('id', 'question', 'choice_a', 'choice_b', 'choice_c', 'choice_d',
        		'type', 'ans', 'mark')


class QuestionAdmin(ImportMixin, admin.ModelAdmin):
    resource_class = QuestionResource


admin.site.register(City)
admin.site.register(School)
admin.site.register(Standard)
admin.site.register(Quiz)
admin.site.register(Question, QuestionAdmin)
