import json
from tkinter import Canvas
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from AppReclamos.models import Reclamo
from .serializers import reclamo_serializer, comentario_serializer
from django.http import HttpResponse
from reportlab.pdfgen import canvas # type: ignore
from reportlab.lib.pagesizes import A4 # type: ignore
from django.http import HttpResponse
from AppReclamos.models import Reclamo
from datetime import datetime

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
    


class ExportarReclamosPDF(APIView):
    def get(self, request, *args, **kwargs):
        # Definir nombre del archivo dinámico, basado en la fecha actual
        current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"Reclamos_Hechos_actuales_{current_time}.pdf"

        # Respuesta con el tipo de contenido para un PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        # Crear el objeto canvas para generar el PDF
        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4
        y = height - 50

        # Título del documento
        p.setFont("Helvetica-Bold", 18)
        p.drawString(100, y, "Listado de Reclamos")
        y -= 40

        # Línea separadora
        p.setLineWidth(1)
        p.line(50, y, width - 50, y)
        y -= 20

        # Obtener los reclamos desde la base de datos
        reclamos = Reclamo.objects.all()

        p.setFont("Helvetica", 12)
        for reclamo in reclamos:
            # Asunto
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y, f"Asunto: {reclamo.asunto}")
            y -= 25  # Aumentamos el espacio después del asunto

            # Empresa
            p.setFont("Helvetica", 10)
            p.drawString(50, y, f"Empresa: {reclamo.empresa}")
            y -= 20  # Espacio adicional para separar la empresa

            # Descripción (con truncamiento de texto)
            p.setFont("Helvetica", 10)
            p.drawString(50, y, f"Descripción: {reclamo.descripcion[:100]}...")
            y -= 30  # Aumentamos el espacio después de la descripción

            # Agregar los comentarios si los tiene
            comentarios = reclamo.comentarios.all()
            if comentarios:
                p.setFont("Helvetica-Bold", 10)
                p.drawString(50, y, "Comentarios:")
                y -= 15  # Espacio para los comentarios
                p.setFont("Helvetica", 10)
                for comentario in comentarios:
                    p.drawString(50, y, f"- {comentario.texto[:80]}...")
                    y -= 15  # Espacio entre los comentarios

            # Separador entre reclamos
            y -= 30  # Espacio adicional entre los reclamos

            # Verificar si el espacio es suficiente, si no, agregamos una nueva página
            if y < 100:
                p.showPage()
                y = height - 50

        p.showPage()
        p.save()

        return response


        
        
