from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Recipe(models.Model):
    name = models.CharField(verbose_name="Название рецепта", max_length=100)
    description = models.TextField(verbose_name="Описание рецепта", max_length=1000)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Автор рецепта", related_name="recipes")
    ingredients = models.TextField(verbose_name="Ингредиенты", max_length=500)
    cooking_time = models.PositiveIntegerField(verbose_name="Время приготовления в минутах", help_text="Укажите время в минутах")
    published = models.DateTimeField(verbose_name="Дата первой публикации", auto_now_add=True)
    update_published = models.DateTimeField(verbose_name="Дата псоледнего редактирования", auto_now=True)
    image = models.ImageField(verbose_name="Фото рецепта", upload_to="recipe_images", blank=True, null=True)
    category = models.ForeignKey("Category", verbose_name="Категория", on_delete=models.PROTECT, blank=True, null=True)
    
    def __str__(self):
        return f"{self.name}, Автор: {self.author}, Дата публикации: {self.published}"
    
    class Meta:
        verbose_name = "Рецепт"
        verbose_name_plural = "Рецепты"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["name", "author"], name="unique_recipe")
        ]
        
class Category(models.Model):
    name = models.CharField(verbose_name="Название категории", max_length=60, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ["name"]
    
class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps", verbose_name="Рецепт")   
    step_number = models.PositiveIntegerField(verbose_name="Номер шага")   
    description = models.TextField(verbose_name="Описание шага",  max_length=600)  
    image = models.ImageField(verbose_name="Фото шага", upload_to="recipe_steps", blank=True, null=True)
    
    def __str__(self):
        return f"{self.recipe.name} - Шаг {self.step_number}"
    
    class Meta:
        verbose_name = "Шаг рецепта"
        verbose_name_plural = "Шагы рецепта"
        ordering = ["step_number"]
        
        
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    
    def __str__(self):
        return f"{self.username}"
    
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["last_name"]
        
class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="comments", verbose_name="Комментарии")  
    comment = models.TextField(verbose_name="Комментарий",  max_length=600)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="comment_author", verbose_name="Автор комментарий")
    likes = models.ManyToManyField(CustomUser, related_name="liked_comments", blank=True, verbose_name="Понравилось (лайки)")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    def likes_count(self):
        return self.likes.count()
    
    def comments_count(self):
        return Comment.objects.count()
    
    def __str__(self):
        return f"{self.author}: {self.comment[:30]}"
    
    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"
        ordering = ["recipe"]
    

class SavedRecipe(models.Model):
    """Модель для сохранения рецепта"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="saved_recipes")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="saved_recipes")
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'recipe')
        
        
    
    
        
    
