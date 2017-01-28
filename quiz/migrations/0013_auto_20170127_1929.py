# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0012_question_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='choice_a',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice_b',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice_c',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice_d',
            field=models.CharField(max_length=50, blank=True),
        ),
    ]
