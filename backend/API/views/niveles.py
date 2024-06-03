from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Nivel
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
import json

# CRUD COMPLETO DE LA TABLA DE nivel
class Nivel_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        try:
            requ = json.loads(request.body)
            verify = verify_token(requ["headers"])
            print(verify)
            requ = requ["body"]
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)
            Nivel.objects.create(nombre=requ['nombre'].title(), descripcion=requ['descripcion'])
            datos = {
                "status": True,
                'message': "Registro Completado"
            }
            return JsonResponse(datos)

        except Exception as error:
            print(f"Error consulta post - {error}", )
            datos = {
                "status": False,
                'message': f"Error al registrar: {error}"
            }
            return JsonResponse(datos)

    def put(self, request, id):
        try:
            requ = json.loads(request.body)
            verify=verify_token(requ["headers"])
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)
            nivel = list(Nivel.objects.filter(id=id).values())
            if len(nivel) > 0:
                nivel = Nivel.objects.get(id=id)
                nivel.nombre = requ['nombre']
                nivel.descripcion = requ['descripcion']
                nivel.save()
                datos = {
                    "status": True,
                    'message': "Exito. Registro editado"
                }
            else:
                datos = {
                    "status": False,
                    'message': "Error. Registro no encontrado"
                }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error de consulta put - {error}")
            datos = {
                "status": False,
                'message': f"Error al editar: {error}",
            }
            return JsonResponse(datos)

    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"]
                }
                return JsonResponse(datos)
            nivel = list(Nivel.objects.filter(id=id).values())
            if len(nivel) > 0:
                Nivel.objects.filter(id=id).delete()
                datos = {
                    "status": True,
                    'message': "Registro Eliminado"
                }
            else:
                datos  = {
                    "status": False,
                    'message': "Registro no encontrado"
                }
            return JsonResponse(datos)
        except models.ProtectedError as error:
            print(f"Error de proteccion  - {str(error)}")
            datos = {
                "status": False,
                'message': "Error. Item protejido no se puede eliminar"
            }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error consulta delete - {error}", )
            datos = {
                "status": False,
                'message': f"Error al eliminar: {error}"
            }
            return JsonResponse(datos)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify=verify_token(request.headers)
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                    "data": None
                }
                return JsonResponse(datos)
            if (id > 0):
                query = """
                SELECT * FROM niveles WHERE niveles.id=%s;
                """
                cursor.execute(query, [int(id)])
                nivel = dictfetchall(cursor)
                if(len(nivel)>0):
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": nivel[0]
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Nivel no encontrado",
                        "data": None
                    }
            else:
                if("all" in request.GET and request.GET["all"]=="true"):
                    query = """
                    SELECT * FROM niveles ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    niveles = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM niveles ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    niveles = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET["desc"]=="true"):
                    query = """
                    SELECT * FROM niveles ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    niveles = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM niveles ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    niveles = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM niveles;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(niveles)>0:
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": niveles,
                        "pages": int(result[0]["pages"]),
                        "total":result[0]["total"],
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Error. No se encontraron registros",
                        "data": None,
                        "pages": None,
                        "total":0
                    }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error consulta get - {error}")
            datos = {
                "status": False,
                'message': f"Error de consulta: {error}",
                "data": None,
                "pages": None,
                "total":0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
