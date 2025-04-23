from AppReclamos.models import Reclamo, Comentario
from rest_framework import serializers

class comentario_serializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'reclamo', 'texto', 'fecha_comentario']

class reclamo_serializer(serializers.ModelSerializer):
    comentarios = comentario_serializer(many=True, read_only=True)  # Relación con Comentarios

    class Meta:
        model = Reclamo
        fields = ['id', 'asunto', 'empresa', 'descripcion', 'comentarios', 'fecha_creacion']