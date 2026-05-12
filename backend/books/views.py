# from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import Book, Bookmark, Category, Review
from .serializers import BookSerializer, BookmarkSerializer, ReviewSerializer, UserSerializer, CategorySerializer


# User
@api_view(['GET'])
def users_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def users_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'Error': 'Not found'}, status=404)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)
    
@csrf_exempt
@api_view(['PUT', 'PATCH'])
def users_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'Error': 'Not found'}, status=404)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # Если передана роль — обновляем профиль отдельно
        role = request.data.get('role')
        if role:
            user.profile.role = role
            user.profile.save()

        return Response(UserSerializer(user).data)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@csrf_exempt
def register(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password:
            return Response({'Error': 'Missing data'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'Error': 'This user already exists'}, status=400)
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        return Response({
            'Message': 'User created',
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.profile.role,
        }, status=201)
    
@api_view(['POST'])
@csrf_exempt
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'Error': 'Invalid credentials'}, status=400)

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.profile.role
    })
    
@api_view(['DELETE'])
@csrf_exempt
def users_delete(request, pk):
    if request.method == 'DELETE':
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        
        user.delete()
        return Response(status=204)

 
# Books CRUD
@api_view(['GET'])
def books_list(request):
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)

@api_view(['GET'])
def books_detail(request, pk):
    if request.method == 'GET':
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        
        serializer = BookSerializer(book, context={'request': request})
        return Response(serializer.data)
    
@api_view(['POST'])
@csrf_exempt
def books_create(request):
    serializer = BookSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['PUT', 'PATCH'])
@csrf_exempt
def books_update(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'Error': 'Not found'}, status=404)
    
    serializer = BookSerializer(book, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@csrf_exempt
def books_delete(request, pk):
    if request.method == 'DELETE':
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        
        book.delete()
        return Response(status=204)





# Bookmark CRUD
@api_view(['GET'])
def bookmarks_list(request):
    if request.method == 'GET':
        bookmarks = Bookmark.objects.all()
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@csrf_exempt
def bookmark_create(request):
    if request.method == 'POST':
        serializer = BookmarkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
@api_view(['PATCH', 'PUT'])
@csrf_exempt
def bookmark_update(request, pk):
    try:
        bookmark = Bookmark.objects.get(pk=pk)
    except Bookmark.DoesNotExist:
        return Response({'Error': 'Not found'}, status=404)
    
    serializer = BookmarkSerializer(bookmark, data = request.data, partial = True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@csrf_exempt
def bookmark_delete(request, pk):
    if request.method == 'DELETE':
        try:
            bookmark = Bookmark.objects.get(pk=pk)
        except Bookmark.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        bookmark.delete()
        return Response(status=204)
    



# Reviews CRUD
@api_view(['GET'])
def reviews_list(request):
    if request.method == 'GET':
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
@api_view(['GET'])
def reviews_detail_book(request, pk):
    if request.method == 'GET':
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    
@api_view(['GET'])
def reviews_detail_user(request, user_pk, book_pk):
    if request.method == 'GET':
        try:
            review = Review.objects.get(user__pk=user_pk, book__pk=book_pk)
        except Review.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    
@api_view(['POST'])
@csrf_exempt
def reviews_create(request):
    if request.method == 'POST':
        serializer = ReviewSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'PATCH'])
@csrf_exempt
def reviews_update(request, pk):
    try:
        review = Review.objects.get(pk=pk)
    except Review.DoesNotExist:
        return Response({'Error': 'Not Found'}, status=404)
    serializer = ReviewSerializer(review, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@csrf_exempt
def reviews_delete(request, pk):
    if request.method == 'DELETE':
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        review.delete()
        return Response(status=204)


# Categories CRUD
@api_view(['GET'])
def categories_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@csrf_exempt
def category_create(request):
    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'PATCH'])
@csrf_exempt
def category_update(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'Error': 'Not found'}, status=404)
    
    serializer = CategorySerializer(category, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@csrf_exempt
def category_delete(request, pk):
    if request.method == 'DELETE':
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'Error': 'Not found'}, status=404)
        category.delete()
        return Response(status=204)
    
