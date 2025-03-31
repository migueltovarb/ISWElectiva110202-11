from AppReclamos.models import Reclamo
from rest_framework import serializers

class reclamo_serializer(serializers.ModelSerializer):
    class Meta:
        model=Reclamo
        fields=['id','asunto','empresa','descripcion','fecha_creacion']