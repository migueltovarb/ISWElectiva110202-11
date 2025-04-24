from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from AppReclamos.models import Reclamo
from AppReclamos.serializers import reclamo_serializer, comentario_serializer

class ReclamosApiViewTest(APITestCase):
    def test_crear_reclamo(self):
        url = reverse('reclamos_api_crear')
        data = {
            'asunto': 'Problema con el servicio',
            'empresa': 'Empresa X',
            'descripcion': 'No se ha solucionado el problema después de varios intentos.'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('asunto', response.data)
        self.assertIn('empresa', response.data)
        self.assertIn('descripcion', response.data)

    def test_crear_reclamo_incompleto(self):
        url = reverse('reclamos_api_crear')
        data = {
            'asunto': 'Problema con el servicio',
            # 'empresa' y 'descripcion' faltan
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_listar_reclamos(self):
        url = reverse('reclamos_api_listar')
        Reclamo.objects.create(asunto='Problema con el servicio', empresa='Empresa X', descripcion='Descripción del reclamo')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['asunto'], 'Problema con el servicio')

    def test_listar_reclamos_por_id(self):
        reclamo = Reclamo.objects.create(asunto='Problema con el servicio', empresa='Empresa X', descripcion='Descripción del reclamo')
        url = reverse('reclamos_api_listar') + '?id=' + str(reclamo.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], reclamo.id)

    def test_filtrar_reclamos_por_empresa(self):
        url = reverse('reclamos_api_listar')
        Reclamo.objects.create(asunto='Problema con el servicio', empresa='Empresa X', descripcion='Descripción del reclamo')
        Reclamo.objects.create(asunto='Problema con el producto', empresa='Empresa Y', descripcion='Descripción del reclamo')
        response = self.client.get(url, {'empresa': 'Empresa X'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['empresa'], 'Empresa X')

class ComentariosApiViewTest(APITestCase):
    def setUp(self):
        self.reclamo = Reclamo.objects.create(asunto='Problema con el servicio', empresa='Empresa X', descripcion='Descripción del reclamo')

    def test_agregar_comentario(self):
        url = reverse('comentarios_api', kwargs={'reclamo_id': self.reclamo.id})
        data = {'texto': 'Este es un comentario sobre el reclamo.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('comentarios', response.data)
        self.assertEqual(len(response.data['comentarios']), 1)

    def test_comentario_a_reclamo_inexistente(self):
        url = reverse('comentarios_api', kwargs={'reclamo_id': 999})  # Usamos un ID que no existe
        data = {'texto': 'Este reclamo no existe.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Reclamo no encontrado')

    def test_comentario_sin_texto(self):
        url = reverse('comentarios_api', kwargs={'reclamo_id': self.reclamo.id})
        data = {'texto': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
