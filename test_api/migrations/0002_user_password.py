# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-21 10:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default=123, max_length=30),
            preserve_default=False,
        ),
    ]
