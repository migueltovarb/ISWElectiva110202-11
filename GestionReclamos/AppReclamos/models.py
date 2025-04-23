from django.db import models

class Reclamo(models.Model):
    asunto = models.CharField(max_length=255)
    empresa = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

class Comentario(models.Model):
    reclamo = models.ForeignKey(Reclamo, on_delete=models.CASCADE, related_name="comentarios")
    texto = models.TextField()
    fecha_comentario = models.DateTimeField(auto_now_add=True)