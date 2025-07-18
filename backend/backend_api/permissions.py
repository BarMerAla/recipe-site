from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Разрешает создание и изменение рецептов юзеру и админу. Удалять может только admin
    """
    def has_object_permission(self, request, view, obj):
        # Разрешаем чтение (GET, HEAD, OPTIONS) всем авторизованным
        if request.method in permissions.SAFE_METHODS:
            return True
        # Изменять может только автор и admin
        if request.method in ['PUT', 'PATCH']:
            return obj.author == request.user or request.user.is_staff or request.user.is_admin
        # Удалять — только admin
        if request.method in ['DELETE']:
            return request.user.is_staff or request.user.is_admin
        return False
    
class IsCommmentAuthorOrReadOnly(permissions.BasePermission):
    """
    Создать и редактировать комментарии может только автор комментария, а удалять может admin и user
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method in ['PUT', 'PATCH']:
            return obj.author == request.user
        if request.method in ['DELEET']:
            return request.user.is_staff or request.user.is_admin
        return False
    
class IsRecipeStepAuthorOrReadOnly(permissions.BasePermission):
    """
    Создать, редактировать и удалять шаги рецепта может автор рецепта и admin
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Редактировать/удалять — только автор рецепта или админ
        return obj.recipe.author == request.user or request.user.is_staff or request.user.is_admin