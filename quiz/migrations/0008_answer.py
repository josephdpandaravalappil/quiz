# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('quiz', '0007_auto_20170122_1622'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.BooleanField(max_length=50)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('answered_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('question', models.ForeignKey(to='quiz.Question')),
                ('quiz', models.ForeignKey(to='quiz.Quiz')),
            ],
        ),
    ]
