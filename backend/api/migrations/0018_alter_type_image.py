# Generated by Django 5.0.4 on 2024-06-04 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_type_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='type',
            name='image',
            field=models.ImageField(upload_to='type/'),
        ),
    ]
