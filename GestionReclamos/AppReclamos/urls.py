from django.urls import path
from .views import ReclamosApiView, ComentarioApiView

urlpatterns = [
    path('crear', ReclamosApiView.as_view(), name='reclamos_api_crear'),
    path('listar-reclamos/', ReclamosApiView.as_view(), name='reclamos_api_listar'),
    path('comentar/<int:reclamo_id>/', ComentarioApiView.as_view(), name='comentarios_api'),
]
