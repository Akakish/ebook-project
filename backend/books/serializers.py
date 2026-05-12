import django
from rest_framework import serializers
from .models import Book, Bookmark, Profile, Review, Category
from django.contrib.auth.models import User


class BookSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.category:
            representation['category'] = CategorySerializer(instance.category).data
        return representation


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['role']

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
