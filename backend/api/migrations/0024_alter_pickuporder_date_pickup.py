# Generated by Django 5.0.4 on 2024-06-06 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_alter_deliveryorder_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pickuporder',
            name='date_pickup',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
