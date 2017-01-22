# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0003_school'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='school',
            name='country',
        ),
        migrations.RemoveField(
            model_name='school',
            name='state',
        ),
        migrations.AddField(
            model_name='school',
            name='city',
            field=models.ForeignKey(default=1, to='quiz.City'),
            preserve_default=False,
        ),
    ]
