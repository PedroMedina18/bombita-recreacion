from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Servicios, ServiciosActividades, Materiales, ServiciosMateriales, ServiciosRecreadores, Recreadores, Actividades
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
from ..funtions.time import duration
from ..funtions.editorOpciones import editorOpciones
import datetime
import json


class Servicios_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request,):
        try:
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)
            duracion = datetime.timedelta(hours=req["duracion"]["horas"], minutes=req["duracion"]["minutos"])
            servicio = Servicios.objects.create(nombre=req["nombre"], precio=req["precio"], numero_recreadores=req["numero_recreadores"], descripcion=req["descripcion"], duracion=duracion)
                
            recreadores = req['recreadores']
            for recreador in recreadores:
                newRecreador = Recreadores.objects.get(id=int(recreador))
                ServiciosRecreadores.objects.create(recreador=newRecreador, servicio=servicio)
            
            actividades = req['actividades']
            for actividad in actividades:
                newAtividades = Actividades.objects.get(id=int(actividad))
                ServiciosActividades.objects.create(actividad=newAtividades, servicio=servicio)

            materiales = req['materiales']
            for material in materiales:
                newMteriales = Materiales.objects.get(id=int(material["material"]))
                ServiciosMateriales.objects.create(material=newMteriales, servicio=servicio, cantidad=material["cantidad"])
            
            datos = {
                "status": True,
                'message': "Registro de servicio completado"
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
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)
            duracion = datetime.timedelta(hours=req["duracion"]["horas"], minutes=req["duracion"]["minutos"])
            servicio = list(Servicios.objects.filter(id=id).values())
            cursor = connection.cursor()
            if len(servicio) > 0:
                servicio = Servicios.objects.get(id=id)
                servicio.nombre = req['nombre']
                servicio.descripcion = req['descripcion']
                servicio.precio = req['precio']
                servicio.duracion = duracion
                servicio.numero_recreadores = req["numero_recreadores"]
                servicio.save()
                
                recreadores = req['recreadores']
                query = """"
                    SELECT re.id FROM
                        recreadores AS re
                    INNER JOIN 
                        servicios_has_recreadores
                    ON 
                        re.id = servicios_has_recreadores.recreador_id
                    WHERE 
                        servicios_has_recreadores.servicio_id = %s;
                """
                editorOpciones(
                    cursor=cursor,
                    query=query,
                    id=id,
                    listTabla=recreadores,
                    tablaIntermedia=ServiciosRecreadores,
                    itemGet=servicio,
                    tablaAgregar=Recreadores,
                    filtro_cargos='cargos', 
                    filtro_permisos='permisos', 
                    campo_cargos='cargos', 
                    campo_permisos='permisos'
                )

                # ------------------------------------------------

                actividades = req['actividades']
                query = """"
                    SELECT ac.id FROM
                        actividades AS ac
                    INNER JOIN 
                        servicios_has_actvidades
                    ON 
                        ac.id = servicios_has_actvidades.actividad_id
                    WHERE 
                        servicios_has_actvidades.servicio_id = %s;
                """
                editorOpciones(
                    cursor=cursor,
                    query=query,
                    id=id,
                    listTabla=actividades,
                    tablaIntermedia=ServiciosActividades,
                    itemGet=servicio,
                    tablaAgregar=Actividades,
                    filtro_cargos='cargos', 
                    filtro_permisos='permisos', 
                    campo_cargos='cargos', 
                    campo_permisos='permisos'
                )

                # ------------------------------------------------

                materiales = req['materiales']
                query = """"
                    SELECT ma.id FROM
                        materiales AS ma
                    INNER JOIN 
                        servicios_has_materiales
                    ON 
                        ma.id = servicios_has_materiales.material_id
                    WHERE 
                        servicios_has_materiales.servicio_id = %s;
                """
                editorOpciones(
                    cursor=cursor,
                    query=query,
                    id=id,
                    listTabla=materiales,
                    tablaIntermedia=ServiciosMateriales,
                    itemGet=servicio,
                    tablaAgregar=Actividades,
                    filtro_cargos='cargos', 
                    filtro_permisos='permisos', 
                    campo_cargos='cargos', 
                    campo_permisos='permisos'
                )

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
            servicio = list(Servicios.objects.filter(id=id).values())
            if len(servicio) > 0:
                Servicios.objects.filter(id=id).delete()
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

    