from django.test import TestCase
from AppReclamos.models import Reclamo, Comentario
from django.utils import timezone

class ReclamoModelTest(TestCase):

    def setUp(self):
        self.reclamo = Reclamo.objects.create(
            asunto="Producto defectuoso",
            empresa="Empresa XYZ",
            descripcion="El producto llegó roto",
            fecha_creacion=timezone.now()
        )

    def test_crear_reclamo(self):
        reclamo = Reclamo.objects.get(id=self.reclamo.id)
        self.assertEqual(reclamo.asunto, "Producto defectuoso")
        self.assertEqual(reclamo.empresa, "Empresa XYZ")
        self.assertEqual(reclamo.descripcion, "El producto llegó roto")
    
    def test_fecha_creacion(self):
        reclamo = Reclamo.objects.get(id=self.reclamo.id)
        self.assertTrue(isinstance(reclamo.fecha_creacion, timezone.datetime))

    def test_relacion_comentarios(self):
        comentario = Comentario.objects.create(
            reclamo=self.reclamo,
            texto="Comentario de prueba"
        )
        self.assertEqual(comentario.reclamo, self.reclamo)
        self.assertEqual(self.reclamo.comentarios.count(), 1)
        self.assertEqual(comentario.texto, "Comentario de prueba")
