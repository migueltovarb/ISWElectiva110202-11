import json
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from AppReclamos.models import Reclamo
from .serializers import reclamo_serializer

class ReclamosApiView(APIView):

    def post(self, request, *args, **kwargs):
        data={
            'asunto':request.data.get('asunto'),  
            'empresa':request.data.get('empresa'),
            'descripcion':request.data.get('descripcion'),
        }

        serializador=reclamo_serializer(data=data)
        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_201_CREATED)
        
        return Response(serializador.data, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        lista_reclamos=Reclamo.objects.all()
        serializer_reclamos=reclamo_serializer(lista_reclamos, many=True)
        return Response(serializer_reclamos.data, status=status.HTTP_200_OK)
    

        
        
