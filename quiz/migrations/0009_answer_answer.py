# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0008_answer'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='answer',
            field=models.TextField(default=1),
            preserve_default=False,
        ),
    ]
