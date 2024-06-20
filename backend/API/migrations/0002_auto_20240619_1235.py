# Generated by Django 3.2.23 on 2024-06-19 17:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cargos',
            name='descripcion',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='generos',
            name='descripcion',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='nivel',
            name='descripcion',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='permisos',
            name='descripcion',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='servicios',
            name='descripcion',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='serviciosmateriales',
            name='cantidad',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='tipodocumento',
            name='descripcion',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]
