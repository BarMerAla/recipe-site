from . import views
from django.urls import path
from .views import (
    RecipeListCreateView, RecipeRetrieveUpdateDestroyView, RecipeStepListCreateView, 
    RecipeStepRetrieveUpdateDestroyView, CategoryListCreateView, CategoryRetrieveUpdateDestroyView,
    CommentListCreateView, CommentRetrieveUpdateDestroyView, UserRegistrationView, 
    UserProfileView, UserProfileUpdateView, ChangePasswordView,
    MyCommentView, toggle_like_comment, SavedRecipeViewSet,
    MyRecipesView, popular_recipes
)
from rest_framework.routers import DefaultRouter
from django.views.decorators.cache import cache_page

router = DefaultRouter()

urlpatterns = [
    path('', views.home),
    path('recipes/', cache_page(60*15)(RecipeListCreateView.as_view())),
    path('recipes/<int:pk>/', RecipeRetrieveUpdateDestroyView.as_view()),
    path('recipes/<int:recipe_id>/comments/', CommentListCreateView.as_view()),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view()),
    path('recipes/<int:recipe_id>/steps/', RecipeStepListCreateView.as_view()),
    path('recipes/<int:recipe_id>/steps/<int:pk>/', RecipeStepRetrieveUpdateDestroyView.as_view()),
    path('categories/', CategoryListCreateView.as_view()),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view()),
    path('register/', UserRegistrationView.as_view()),
    path('profile/me/', UserProfileView.as_view()),
    path('profile/update/', UserProfileUpdateView.as_view()),
    path('profile/change-password/', ChangePasswordView.as_view()),
    path('profile/my-comments/', cache_page(60*5)(MyCommentView.as_view())), 
    path('comments/<int:comment_id>/like/', toggle_like_comment, name="toggle_like_comment"), 
    path('my-recipes/', cache_page(60/5)(MyRecipesView.as_view()), name="my-recipes"), 
    path('recipes/popular/', popular_recipes),
]

router.register(r'saved-recipes', SavedRecipeViewSet, basename='saved-recipe')

urlpatterns += router.urls
