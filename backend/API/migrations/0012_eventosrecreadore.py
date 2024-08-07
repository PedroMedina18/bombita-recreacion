# Generated by Django 3.2.23 on 2024-08-04 10:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0011_auto_20240802_1023'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventosRecreadore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('evento', models.ForeignKey(db_column='evento_id', on_delete=django.db.models.deletion.CASCADE, related_name='recreador', to='API.eventos')),
                ('recreador', models.ForeignKey(db_column='recreador_id', on_delete=django.db.models.deletion.CASCADE, related_name='evento', to='API.recreadores')),
            ],
            options={
                'db_table': 'recreadores_eventos',
            },
        ),
    ]
