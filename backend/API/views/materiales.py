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
            jd = json.loads(request.body)
            verify = verify_token(jd["headers"])
            jd = jd["body"]
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)
            Materiales.objects.create(nombre=jd['nombre'].title(), descripcion=jd['descripcion'], total=jd['total'])
            datos = {
                "status": True,
                'message': "Registro Completado"
            }
            return JsonResponse(datos)

        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Compruebe Datos"
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
            materiales = list(Materiales.objects.filter(id=id).values())
            if len(materiales) > 0:
                Materiales.objects.filter(id=id).delete()
                datos = {
                    "status": True,
                    'message': "Registro Eliminado"
                }
            else:
                datos  = {
                    "status": False,
                    'message': "Registro No Encontrado"
                }
            return JsonResponse(datos)
        except models.ProtectedError as e:
            print("Erorr de proteccion")
            print(str(e))
            datos = {
                "status": False,
                'message': "Error. Item protejido no se puede eliminar"
            }
            return JsonResponse(datos)

    def put(self, request, id):
        try:
            jd = json.loads(request.body)
            materiales = list(Materiales.objects.filter(id=id).values())
            if len(materiales) > 0:
                materiales = Materiales.objects.get(id=id)
                materiales.nombre = jd['nombre']
                materiales.descripcion = jd['descripcion']
                materiales.total = jd['total']
                materiales.save()
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
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
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
                SELECT * FROM mat WHERE materiales.id=%s;
                """
                cursor.execute(query, [int(id)])
                material = dictfetchall(cursor)
                if(len(material)>0):
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": material[0]
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
                    SELECT * FROM materiales ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    materiales = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM materiales ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    materiales = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET["desc"]=="true"):
                    query = """
                    SELECT * FROM materiales ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
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
                        "status": True,
                        'message': "Exito",
                        "data": materiales,
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
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
                "pages": None,
                "total":0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
