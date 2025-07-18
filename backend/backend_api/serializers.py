from rest_framework import serializers
from .models import Recipe, RecipeStep, Category, Comment, SavedRecipe
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели CustomUser.
    Здесь мы выбираем основные поля: id, username, first_name, last_name, email, phone, avatar.
    """
    
    last_login = serializers.DateTimeField(format=None, read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "avatar",
            "last_login",
            ]
        
        read_only_fields = ["id", "username"]  # Например, username делаем только для чтения, если нужно
        
class CategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Category
    """
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]
        read_only_fields = ["id", "name"]
        
        
class RecipeStepSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели RecipeStep.
    """
    recipe_id = serializers.PrimaryKeyRelatedField(   # При POST/PUT отправляется только recipe_id.
        queryset=Recipe.objects.all(), source='recipe', write_only=True
    )
    
    class Meta:
        model = RecipeStep
        fields = [
            "id",
            "recipe_id",
            "step_number",
            "description",
            "image",
        ]
        read_only_fields = ["id", "recipe"]
        
        
class RecipeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Recipe.
    Поле author можно отдать как вложенный объект пользователя (nested), 
    и добавить дополнительное поле author_id для записи (write-only).
    """
    
    author = CustomUserSerializer(read_only=True)   # Вложенный (nested) сериализатор: при чтении отдаём всю информацию о пользователе-авторе.
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset = Category.objects.all(),
        source = 'category',
        write_only = True
    )
    steps = RecipeStepSerializer(many=True, required=False)
    
    class Meta:
        model = Recipe
        fields = [
            "id",
            "name",
            "description",
            "author",
            "ingredients",
            "cooking_time",
            "published",
            "update_published",
            "image",
            "category",   # read_only, для ответа
            "category_id", # write_only, для записи
            "steps",
            ]
        
        read_only_fields = ["id", "author", "published", "update_published"]
    
    def create(self, validated_data):
        steps_data =  validated_data.pop('steps', [])
        recipe = Recipe.objects.create(**validated_data)
        for step_data in steps_data:
            RecipeStep.objects.create(recipe=recipe, **step_data)
        return recipe
        
        
class CommentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Comment.
    """
    recipe = RecipeSerializer(read_only=True)
    author = CustomUserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            "id",
            "recipe",
            "comment",
            "author",
            "likes_count",
            "comments_count",
            "created",
        ]
        read_only_fields = ["id", "recipe", "author"]
        
    def get_likes_count(self, obj):           # сериализация функции likes_count для подсчета лайков
        return obj.likes_count()
    
    def get_comments_count(self, obj):         # сериализация функции comments_count для подсчета лайков
        return obj.comments_count()
    
class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    """
    Сериализатор для регистрации пользователя
    """
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'last_name', 'first_name', 'phone', 'avatar')
        
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username = validated_data['username'],
            email = validated_data.get('email'),
            password = validated_data['password'],
            last_name = validated_data.get('last_name', ''),
            first_name = validated_data.get('first_name', ''),
            phone = validated_data.get('phone', ''),
            avatar = validated_data.get('avatar', None),
        )
        return user
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
class RecipeShortSerializer(serializers.ModelSerializer):
    """Сериализатор для вывода нужных нам полей сохраненных рецептов в личном кабинете"""
    saved_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Recipe
        fields = [
            "id",
            "name",
            "image",
            "saved_count",
            ]
    
class SavedRecipeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для сохраненных рецептов
    """
    recipe = RecipeShortSerializer(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(),
        source='recipe',
        write_only=True
    )

    class Meta:
        model = SavedRecipe
        fields = [
            "id",
            "user",
            "recipe",
            "recipe_id",
            "saved_at"
        ]
        read_only_fields = ["id", "saved_at", "recipe", "user"]