# Generated by Django 5.0.4 on 2024-04-28 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_remove_device_rating_device'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='quantity',
            field=models.IntegerField(default=1),
        ),
    ]
