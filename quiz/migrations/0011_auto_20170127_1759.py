# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0010_score'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='duration',
        ),
        migrations.AddField(
            model_name='quiz',
            name='ends',
            field=models.DateTimeField(default=datetime.datetime(2017, 1, 27, 12, 29, 52, 286301, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
