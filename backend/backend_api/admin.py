from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Чтобы добавить новые поля в админку:
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone', 'avatar')}),
    )
    add_fieldsets =  UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone', 'avatar')}),
    )
    # Можно добавить, какие поля показывать в списке
    list_display = ('username', 'email', 'last_name', 'first_name', 'phone', 'is_staff')
    
@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('name', 'author', 'cooking_time', 'published', 'category')
    search_fields = ('name', 'author__username')
    
@admin.register(RecipeStep)
class RecipeStepAdmin(admin.ModelAdmin):
    list_display = ('recipe', 'step_number', 'description')
    search_fields = ('recipe__name',)
    
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ('name',)
    
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipe', 'author', 'comment', 'created']
    search_fields = ('recipe',)
    exclude = ("likes",)  # убрали из админки возможность ставить лайки
    
@admin.register(SavedRecipe)
class SavedRecipeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'recipe', 'saved_at']
    search_fields = ('user',)
   
    