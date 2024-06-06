from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Materiales
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
import json

# CRUD COMPLETO DE LA TABLA DE materiales
class Materiales_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            Materiales.objects.create(nombre=req['nombre'].title(), descripcion=req['descripcion'], total=req['total'])
            datos = {
                'status': True,
                'message': "Registro de material completado"
            }
            return JsonResponse(datos)

        except Exception as error:
            print(f"Error consulta post - {error}", )
            datos = {
                'status': False,
                'message': f"Error al registrar: {error}"
            }
            return JsonResponse(datos)

    def put(self, request, id):
        try:
            req = json.loads(request.body)
            verify=verify_token(req['headers'])
            req = req['body']
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            material = list(Materiales.objects.filter(id=id).values())
            if len(material) > 0:
                material = Materiales.objects.get(id=id)
                material.nombre = req['nombre']
                material.descripcion = req['descripcion']
                material.total = req['total']
                material.save()
                datos = {
                    'status': True,
                    'message': "Exito. Registro editado"
                }
            else:
                datos = {
                    'status': False,
                    'message': "Error. Registro no encontrado"
                }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error de consulta put - {error}")
            datos = {
                'status': False,
                'message': f"Error al editar: {error}",
            }
            return JsonResponse(datos)

    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            material = list(Materiales.objects.filter(id=id).values())
            if len(material) > 0:
                Materiales.objects.filter(id=id).delete()
                datos = {
                    'status': True,
                    'message': "Registro eliminado"
                }
            else:
                datos  = {
                    'status': False,
                    'message': "Registro no encontrado"
                }
            return JsonResponse(datos)
        except models.ProtectedError as error:
            print(f"Error de proteccion  - {str(error)}")
            datos = {
                'status': False,
                'message': "Error. Item protejido no se puede eliminar"
            }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error consulta delete - {error}", )
            datos = {
                'status': False,
                'message': f"Error al eliminar: {error}"
            }
            return JsonResponse(datos)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                    'data': None
                }
                return JsonResponse(datos)

            if (id > 0):
                query = """
                SELECT * FROM mat WHERE materiales.id=%s;
                """
                cursor.execute(query, [int(id)])
                material = dictfetchall(cursor)
                if(len(material)>0):
                    datos = {
                        'status': True,
                        'message': "Exito",
                        'data': material[0]
                    }
                else:
                    datos = {
                        'status': False,
                        'message': "Material no encontrado",
                        'data': None
                    }
            else:
                if("all" in request.GET and request.GET['all']=="true"):
                    query = """
                    SELECT * FROM materiales ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    materiales = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM materiales ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    materiales = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET['desc']=="true"):
                    query = """
                    SELECT * FROM materiales ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    materiales = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM materiales ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    materiales = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM materiales;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(materiales)>0:
                    datos = {
                        'status': True,
                        'message': "Exito",
                        'data': materiales,
                        "pages": int(result[0]['pages']),
                        "total":result[0]['total'],
                    }
                else:
                    datos = {
                        'status': False,
                        'message': "Error. No se encontraron registros",
                        'data': None,
                        "pages": None,
                        "total":0
                    }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error consulta get - {error}")
            datos = {
                'status': False,
                'message': f"Error de consulta: {error}",
                'data': None,
                "pages": None,
                "total":0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
