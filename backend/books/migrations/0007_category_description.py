# Generated manually for adding description field to Category

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0006_remove_category_book_book_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]