from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Materiales
from django.db import IntegrityError, connection
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

    # def get(self, request, id=0):
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
                SELECT * FROM mat WHERE niveles.id=%s;
                """
                cursor.execute(query, [int(id)])
                actividad = dictfetchall(cursor)
                if(len(actividad)>0):
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": actividad[0]
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
                    SELECT * FROM actividades ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    activiades = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM actividades ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    activiades = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET["desc"]=="true"):
                    query = """
                    SELECT * FROM actividades ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    activiades = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM actividades ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    activiades = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(*) / 25) AS total FROM actividades;
                """
                cursor.execute(query)
                pages = dictfetchall(cursor)
                if len(activiades)>0:
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": activiades,
                        "pages":pages[0]["total"]
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Error. No se encontraron registros",
                        "data": None,
                        "pages":None
                    }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
                "data": None,
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
