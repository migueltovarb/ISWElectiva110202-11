from django.urls import path
from .views import ReclamosApiView, ComentarioApiView, ExportarReclamosPDF

urlpatterns = [
    path('crear', ReclamosApiView.as_view(), name='reclamos_api_crear'),
    path('listar-reclamos/', ReclamosApiView.as_view(), name='reclamos_api_listar'),
    path('comentar/<int:reclamo_id>/', ComentarioApiView.as_view(), name='comentarios_api'),
    path('exportar-pdf/', ExportarReclamosPDF.as_view(), name='exportar_reclamos_pdf'),
]
