# Generated by Django 3.2.23 on 2024-06-30 17:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0003_eventossobrecargos_sobrecargos'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventosServicios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('evento', models.ForeignKey(db_column='evento_id', on_delete=django.db.models.deletion.CASCADE, related_name='servicio', to='API.eventos')),
            ],
            options={
                'db_table': 'servicios_eventos',
            },
        ),
        migrations.RenameModel(
            old_name='PermisosCargos',
            new_name='Privilegios',
        ),
        migrations.RenameField(
            model_name='cargos',
            old_name='img_logo',
            new_name='img',
        ),
        migrations.RenameField(
            model_name='recreadores',
            old_name='img_perfil',
            new_name='img',
        ),
        migrations.RemoveField(
            model_name='clientes',
            name='fecha_actualizacion',
        ),
        migrations.AlterField(
            model_name='actividades',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='cargos',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='cargos',
            name='nombre',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='generos',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='materiales',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='nivel',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='permisos',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='servicios',
            name='descripcion',
            field=models.CharField(default='hd', max_length=500),
        ),
        migrations.AlterField(
            model_name='sobrecargos',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterField(
            model_name='tipodocumento',
            name='descripcion',
            field=models.CharField(default='hd', max_length=300),
        ),
        migrations.AlterModelTable(
            name='eventossobrecargos',
            table='sobrecargo_eventos',
        ),
        migrations.AlterModelTable(
            name='materialesactividad',
            table='materiales_actividades',
        ),
        migrations.AlterModelTable(
            name='privilegios',
            table='privilegios',
        ),
        migrations.AlterModelTable(
            name='serviciosactividades',
            table='servicios_actividades',
        ),
        migrations.AlterModelTable(
            name='serviciosmateriales',
            table='servicios_materiales',
        ),
        migrations.DeleteModel(
            name='ServiciosRecreadores',
        ),
        migrations.AddField(
            model_name='eventosservicios',
            name='servicios',
            field=models.ForeignKey(db_column='servicios_id', on_delete=django.db.models.deletion.CASCADE, related_name='evento', to='API.servicios'),
        ),
    ]
