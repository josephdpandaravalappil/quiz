# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0006_auto_20170122_1332'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='ends',
        ),
        migrations.AddField(
            model_name='quiz',
            name='duration',
            field=models.TimeField(default="02:00:00"),
            preserve_default=False,
        ),
    ]
