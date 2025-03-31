from django.db import models

class Reclamo(models.Model):
    asunto = models.CharField(max_length=255)
    empresa = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)