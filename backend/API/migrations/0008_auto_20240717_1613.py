# Generated by Django 3.2.23 on 2024-07-17 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0007_auto_20240717_1241'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventos',
            name='anticipo',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='eventos',
            name='pagado',
            field=models.BooleanField(default=False),
        ),
    ]
