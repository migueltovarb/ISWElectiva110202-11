from rest_framework import serializers
from AppReclamos.models import Reclamo, Comentario

class comentario_serializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'reclamo', 'texto', 'fecha_comentario']

class reclamo_serializer(serializers.ModelSerializer):
    comentarios = comentario_serializer(many=True, read_only=True)
    evidencia = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Reclamo
        fields = ['id', 'asunto', 'empresa', 'descripcion', 'evidencia', 'comentarios', 'fecha_creacion']
