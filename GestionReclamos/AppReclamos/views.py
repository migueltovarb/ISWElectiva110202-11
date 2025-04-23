import json
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from AppReclamos.models import Reclamo
from .serializers import reclamo_serializer, comentario_serializer

class ReclamosApiView(APIView):
    def post(self, request, *args, **kwargs):
        data = {
            'asunto': request.data.get('asunto'),
            'empresa': request.data.get('empresa'),
            'descripcion': request.data.get('descripcion'),
        }

        serializador = reclamo_serializer(data=data)
        if serializador.is_valid():
            serializador.save()
            return Response(serializador.data, status=status.HTTP_201_CREATED)

        return Response(serializador.data, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        reclamos = Reclamo.objects.all()

        id_param = request.query_params.get('id')
        if id_param:
            reclamos = reclamos.filter(id=id_param)

        asunto_param = request.query_params.get('asunto')
        if asunto_param:
            reclamos = reclamos.filter(asunto__icontains=asunto_param)

        empresa_param = request.query_params.get('empresa')
        if empresa_param:
            reclamos = reclamos.filter(empresa__icontains=empresa_param)

        serializer = reclamo_serializer(reclamos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ComentarioApiView(APIView):
    def post(self, request, reclamo_id, *args, **kwargs):
        try:
            reclamo = Reclamo.objects.get(id=reclamo_id)
        except Reclamo.DoesNotExist:
            return Response({"error": "Reclamo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'reclamo': reclamo.id,
            'texto': request.data.get('texto'),
        }

        serializer = comentario_serializer(data=data)
        if serializer.is_valid():
            comentario = serializer.save()

            reclamo_data = reclamo_serializer(reclamo).data
            reclamo_data['comentarios'] = comentario_serializer(comentario.reclamo.comentarios.all(), many=True).data

            return Response(reclamo_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        
        
