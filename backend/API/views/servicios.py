from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Servicios, ServiciosActividades, Materiales, Serviciosmateriales, ServiciosRecreadores, Recreadores, Actividades
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
from ..funtions.time import duration
import datetime
import json


class Servicios_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                    "data": None
                }
                return JsonResponse(datos)

            if (id > 0):
                query = """
                SELECT * FROM mat WHERE servicios.id=%s;
                """
                cursor.execute(query, [int(id)])
                servicio = dictfetchall(cursor)
                if (len(servicio) > 0):
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": servicio[0]
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Servicio no encontrado",
                        "data": None
                    }
            else:
                if ("all" in request.GET and request.GET["all"] == "true"):
                    query = """
                    SELECT * FROM servicios ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    servicios = dictfetchall(cursor)
                elif ("page" in request.GET):
                    query = """
                    SELECT * FROM servicios ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    servicios = dictfetchall(cursor)
                elif ("page" in request.GET and "desc" in request.GET and request.GET["desc"] == "true"):
                    query = """
                    SELECT * FROM servicios ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    servicios = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM servicios ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    servicios = dictfetchall(cursor)

                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM servicios;
                """
                for servicio in servicios:
                    servicio["duracion"]=duration(servicio["duracion"])
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(servicios) > 0:
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": servicios,
                        "pages": int(result[0]["pages"]),
                        "total": result[0]["total"],
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Error. No se encontraron registros",
                        "data": None,
                        "pages": None,
                        "total": 0
                    }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
                "pages": None,
                "total": 0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

    def post(self, request,):
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
            duracion = datetime.timedelta(hours=jd["duracion"]["horas"], minutes=jd["duracion"]["minutos"])
            servicio = Servicios.objects.create(nombre=jd["nombre"], precio=jd["precio"], numero_recreadores=jd["numero_recreadores"], descripcion=jd["descripcion"], duracion=duracion)
                
            recreadores = jd['recreadores']
            for recreador in recreadores:
                newRecreador = Recreadores.objects.get(id=int(recreador))
                ServiciosRecreadores.objects.create(recreador=newRecreador, servicio=servicio)
            
            actividades = jd['actividades']
            for actividad in actividades:
                newAtividades = Actividades.objects.get(id=int(actividad))
                ServiciosActividades.objects.create(actividad=newAtividades, servicio=servicio)

            materiales = jd['materiales']
            for material in materiales:
                newMteriales = Materiales.objects.get(id=int(material["material"]))
                Serviciosmateriales.objects.create(material=newMteriales, servicio=servicio, cantidad=material["cantidad"])
            
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