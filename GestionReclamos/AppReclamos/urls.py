from django.urls import path
from .views import  ReclamosApiView

urlpatterns = [
    path('crear', ReclamosApiView.as_view()),
    path('obtener-todos', ReclamosApiView.as_view()),
]