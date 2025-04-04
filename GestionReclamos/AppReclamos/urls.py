from django.urls import path
from .views import  ReclamosApiView

urlpatterns = [
    path('crear', ReclamosApiView.as_view()),
    path('listar-reclamos', ReclamosApiView.as_view()),
]