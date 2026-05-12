from django.db import models
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

# Автоматически создаёт Profile при регистрации нового User
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
# Create your models here.
class Book(models.Model):
    book_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    genres = models.CharField(max_length=200, default='N/A')
    author = models.CharField(max_length=100)
    published_date = models.DateField()
    description = models.TextField(blank=True)
    pages = models.IntegerField()
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title
    
class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Review for {self.book.title} by {self.user.username}"

    
# class Payment(models.Model):
#     book = models.ForeignKey(Book, on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     payment_date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Payment for {self.book.title} - ${self.amount}"
    
class Bookmark(models.Model):
    Status_CHOICES = [
        ('read', 'Read'),
        ('planned', 'Planned'),
        ('reading', 'Reading'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
        ('favorite', 'Favorite'),
    ]
    Bookmark_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=Status_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
