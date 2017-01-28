# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0011_auto_20170127_1759'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='type',
            field=models.CharField(default=1, max_length=1, choices=[(b'e', b'Essay'), (b'm', b'Multiple Choice')]),
            preserve_default=False,
        ),
    ]
