# Generated by Django 5.0.4 on 2024-06-07 11:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_alter_pickuporder_date_pickup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pickuporder',
            name='order',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pickup_order', to='api.order'),
        ),
        migrations.CreateModel(
            name='Accounting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('status', models.CharField()),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.device')),
            ],
        ),
    ]
