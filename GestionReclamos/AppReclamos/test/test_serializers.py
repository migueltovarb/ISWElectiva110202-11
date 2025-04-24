from django.test import TestCase
from AppReclamos.models import Reclamo, Comentario
from AppReclamos.serializers import reclamo_serializer, comentario_serializer
from django.utils import timezone

class ReclamoSerializerTest(TestCase):

    def setUp(self):
        self.reclamo = Reclamo.objects.create(
            asunto="Producto defectuoso",
            empresa="Empresa XYZ",
            descripcion="El producto llegó roto",
            fecha_creacion=timezone.now()
        )
        self.serializer = reclamo_serializer(instance=self.reclamo)

    def test_reclamo_serializer(self):
        data = self.serializer.data
        self.assertEqual(data['asunto'], "Producto defectuoso")
        self.assertEqual(data['empresa'], "Empresa XYZ")
        self.assertEqual(data['descripcion'], "El producto llegó roto")
        self.assertTrue('fecha_creacion' in data)

    def test_comentarios_en_reclamo_serializer(self):
        comentario = Comentario.objects.create(
            reclamo=self.reclamo,
            texto="Comentario de prueba"
        )
        self.serializer = reclamo_serializer(instance=self.reclamo)
        data = self.serializer.data
        self.assertEqual(len(data['comentarios']), 1)
        self.assertEqual(data['comentarios'][0]['texto'], "Comentario de prueba")

class ComentarioSerializerTest(TestCase):

    def setUp(self):
        self.reclamo = Reclamo.objects.create(
            asunto="Producto defectuoso",
            empresa="Empresa XYZ",
            descripcion="El producto llegó roto",
            fecha_creacion=timezone.now()
        )
        self.comentario_data = {
            "reclamo": self.reclamo.id,
            "texto": "Comentario de prueba"
        }

    def test_comentario_serializer_valid(self):
        serializer = comentario_serializer(data=self.comentario_data)
        self.assertTrue(serializer.is_valid())
        comentario = serializer.save()
        self.assertEqual(comentario.texto, "Comentario de prueba")

    def test_comentario_serializer_invalid(self):
        invalid_data = {
            "reclamo": 999,  # ID no existente
            "texto": ""
        }
        serializer = comentario_serializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("reclamo", serializer.errors)
        self.assertIn("texto", serializer.errors)
