from rest_framework import generics, permissions, status, viewsets
from .models import Recipe, RecipeStep, Category, Comment, CustomUser, SavedRecipe
from .serializers import RecipeSerializer, RecipeStepSerializer, CategorySerializer, CommentSerializer, SavedRecipeSerializer, RecipeShortSerializer
from .serializers import CustomUserSerializer, CustomUserRegistrationSerializer, ChangePasswordSerializer
from django.http import HttpResponse
from .permissions import IsAuthorOrReadOnly, IsCommmentAuthorOrReadOnly, IsRecipeStepAuthorOrReadOnly
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from django.db.models import Count
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404


# Create your views here.

CustomUser = get_user_model()

def home(request):
    return HttpResponse("API работает! Перейдите на /recipes/")

class RecipePagination(PageNumberPagination):
    """Вьюха для пагинации"""
    page_size = 10

class RecipeListCreateView(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthorOrReadOnly]
    pagination_class = RecipePagination
    
    def perform_create(self, serializer):
        # Если хотим автоматически брать автора из request.user, не заставляя клиента указывать author_id
        serializer.save(author=self.request.user)
        
    def get_queryset(self):
        queryset = Recipe.objects.all().order_by('-published') # сортировка по убыванию (новые сверху)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset
        
class RecipeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthorOrReadOnly]
    
class RecipeStepListCreateView(generics.ListCreateAPIView):
    queryset = RecipeStep.objects.all()
    serializer_class = RecipeStepSerializer
    permission_classes = [IsRecipeStepAuthorOrReadOnly]

    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id')
        return RecipeStep.objects.filter(recipe_id=recipe_id)
    
    def perform_create(self, serializer):
        serializer.save()
        
class RecipeStepRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecipeStep.objects.all()
    serializer_class = RecipeStepSerializer
    permission_classes = [IsRecipeStepAuthorOrReadOnly]
     
    def perform_create(self, serializer):   
        recipe = get_object_or_404(Recipe, pk=self.kwargs['recipe_id'])
        serializer.save(recipe=recipe)
        
    
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthorOrReadOnly]
    
class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]
    
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id')
        return Comment.objects.filter(recipe_id=recipe_id)
    
    def perform_create(self, serializer):
        recipe_id = self.kwargs.get('recipe_id')
        recipe = Recipe.objects.get(pk=recipe_id)
        serializer.save(author=self.request.user, recipe=recipe)
    
class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsCommmentAuthorOrReadOnly]
    
class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserRegistrationSerializer
    permission_classes = []  # Разрешено всем
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  
    
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    
class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
        
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]    
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': 'Неверный пароль!'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'success': 'Пароль успешно изменен!'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
class MyCommentView(ListAPIView):
    """view для списка комментариев юзера"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Comment.objects.filter(author=self.request.user).order_by('-created')   # сортировку по убыванию (то есть от новых к старым).
    

@api_view(["POST"])              
@permission_classes([IsAuthenticated])
def toggle_like_comment(request, comment_id):
    """view для лайков"""
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return Response({"error": "Комментарий не найден"}, status=status.HTTP_404_NOT_FOUND)
    
    user = request.user
    if user in comment.likes.all():  
        comment.likes.remove(user)
        liked = False
    else:
        comment.likes.add(user)
        liked = True
        
    return Response({"liked": liked, "likes_count": comment.likes.count()})

class SavedRecipeViewSet(viewsets.ModelViewSet):
    """вьюха для SavedRecipe"""
    serializer_class = SavedRecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedRecipe.objects.filter(user=self.request.user)
    
    @method_decorator(cache_page(60*5))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        user = self.request.user
        recipe = serializer.validated_data["recipe"]
        
        if SavedRecipe.objects.filter(user=user, recipe=recipe).exists():
            raise ValidationError("Рецепт уже сохранен!")
        serializer.save(user=user)

class MyRecipesView(ListAPIView):
    """view для списка рецептов юзера"""
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Recipe.objects.filter(author=self.request.user)
    

@api_view(['GET'])                    
@permission_classes([AllowAny])
@cache_page(60 * 5)   # кэш на 5 минут
def popular_recipes(request):                             # функция-обработчик для популярных рецептов
    top_rec = int(request.query_params.get("limit", 5))
    recipes = Recipe.objects.annotate(saved_count = Count('saved_recipes')).order_by('-saved_count')[:top_rec]
    
    serializer = RecipeShortSerializer(recipes, many=True)
    return Response(serializer.data)