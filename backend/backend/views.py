from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import update_last_login

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        
        # Обновляем last_login вручную
        update_last_login(None, token.user)
        
        return Response({
            'token': token.key,
            'username': token.user.username,
            'last_login': token.user.last_login,
        })