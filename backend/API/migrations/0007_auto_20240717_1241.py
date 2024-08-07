# Generated by Django 3.2.23 on 2024-07-17 12:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0006_auto_20240717_1234'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personas',
            name='telefono_secundario',
            field=models.BigIntegerField(blank=True, default=None, null=True),
        ),
        migrations.CreateModel(
            name='Pagos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monto', models.FloatField()),
                ('referencia', models.BigIntegerField(blank=True, default=None, null=True)),
                ('capture', models.FileField(blank=True, null=True, upload_to='capture_pago')),
                ('evento', models.ForeignKey(db_column='evento_id', on_delete=django.db.models.deletion.CASCADE, related_name='pago', to='API.eventos')),
                ('metodoPago', models.ForeignKey(db_column='metodo_pago_id', on_delete=django.db.models.deletion.CASCADE, related_name='evento', to='API.metodospago')),
            ],
            options={
                'db_table': 'pagos',
            },
        ),
    ]
