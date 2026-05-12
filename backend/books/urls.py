from django.urls import path
from .views import *

urlpatterns = [
    # Users
    path('users/', users_list),
    path('users/login', login),
    path('users/register', register),
    path('users/<int:pk>/', users_detail),
    path('users/<int:pk>/update/', users_update),
    path('users/<int:pk>/delete/', users_delete),

    # Books
    path('books/', books_list),
    path('books/create/', books_create),
    path('books/<int:pk>/', books_detail),
    path('books/<int:pk>/update/', books_update),
    path('books/<int:pk>/delete/', books_delete),
    
    # Bookmark CRUD
    path('bookmarks/', bookmarks_list),
    path('bookmarks/create/', bookmark_create),
    path('bookmarks/<int:pk>/update/', bookmark_update),
    path('bookmarks/<int:pk>/delete/', bookmark_delete),

    # Reviews CRUD
    path('reviews/', reviews_list),
    path('reviews/create/', reviews_create),
    path('reviews/detail/<int:pk>/', reviews_detail_book),
    path('reviews/detail/<int:user_pk>/<int:book_pk>/', reviews_detail_user),
    path('reviews/update/<int:pk>/', reviews_update),
    path('reviews/delete/<int:pk>/', reviews_delete),

    # Categories CRUD
    path('categories/', categories_list),
    path('categories/create/', category_create),
    path('categories/<int:pk>/update/', category_update),
    path('categories/<int:pk>/delete/', category_delete),
]
