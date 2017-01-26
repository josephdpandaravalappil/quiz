# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0005_standard'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('question', models.CharField(max_length=200)),
                ('choice_a', models.CharField(max_length=50)),
                ('choice_b', models.CharField(max_length=50)),
                ('choice_c', models.CharField(max_length=50)),
                ('choice_d', models.CharField(max_length=50)),
                ('ans', models.TextField()),
                ('mark', models.IntegerField()),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
                ('starts', models.DateTimeField()),
                ('ends', models.DateTimeField()),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ManyToManyField(related_name='quiz', to='quiz.Quiz'),
        ),
    ]
