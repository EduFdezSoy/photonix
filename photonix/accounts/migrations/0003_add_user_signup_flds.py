# Generated by Django 3.0.7 on 2020-12-16 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_crt_fld_has_config_persional_info'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='has_configured_image_analysis',
            field=models.BooleanField(default=False, help_text='true if user has configured image analysis?'),
        ),
        migrations.AddField(
            model_name='user',
            name='has_configured_importing',
            field=models.BooleanField(default=False, help_text='true if user has configured importing?'),
        ),
        migrations.AddField(
            model_name='user',
            name='has_created_library',
            field=models.BooleanField(default=False, help_text='true if user has created his library?'),
        ),
    ]
