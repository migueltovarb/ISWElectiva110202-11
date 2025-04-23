from django.urls import path
from .views import  ReclamosApiView, ComentarioApiView

urlpatterns = [
    path('crear', ReclamosApiView.as_view()),
    path('listar-reclamos', ReclamosApiView.as_view()),
    path('comentar/<int:reclamo_id>/', ComentarioApiView.as_view()),  # Correctamente configurado
]