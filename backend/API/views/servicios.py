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
            verify = verify_token(req['headers'])
            req = req['body']
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            duracion = datetime.timedelta(hours=req['duracion']['horas'], minutes=req['duracion']['minutos'])
            servicio = Servicios.objects.create(nombre=req['nombre'], precio=req['precio'], numero_recreadores=req['numero_recreadores'], descripcion=req['descripcion'], duracion=duracion)
                
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
                newMteriales = Materiales.objects.get(id=int(material['material']))
                ServiciosMateriales.objects.create(material=newMteriales, servicio=servicio, cantidad=int(material['cantidad']))
            
            datos = {
                'status': True,
                'message': "Registro de servicio completado"
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
        # try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            duracion = datetime.timedelta(hours=req['duracion']['horas'], minutes=req['duracion']['minutos'])
            servicio = list(Servicios.objects.filter(id=id).values())
            cursor = connection.cursor()
            if len(servicio) > 0:
                servicio = Servicios.objects.get(id=id)
                servicio.nombre = req['nombre']
                servicio.descripcion = req['descripcion']
                servicio.precio = req['precio']
                servicio.duracion = duracion
                servicio.numero_recreadores = req['numero_recreadores']
                servicio.save()
                
                recreadores = req['recreadores']
                query = """
                    SELECT re.id FROM
                        recreadores AS re
                    INNER JOIN 
                        servicios_has_recreadores
                    ON 
                        re.id = servicios_has_recreadores.recreador_id
                    WHERE 
                        servicios_has_recreadores.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                listRecreador = dictfetchall(cursor)
                editorOpciones(
                    items=listRecreador,
                    id=id,
                    listTabla=recreadores,
                    tablaIntermedia=ServiciosRecreadores,
                    itemGet=servicio,
                    tablaAgregar=Recreadores,
                    filtro_principal='servicio', 
                    filtro_secundario='recreador', 
                    campo_principal='servicio', 
                    campo_secundario='recreador'
                )

                # ------------------------------------------------

                actividades = req['actividades']
                query = """
                    SELECT ac.id FROM
                        actividades AS ac
                    INNER JOIN 
                        servicios_has_actividades
                    ON 
                        ac.id = servicios_has_actividades.actividad_id
                    WHERE 
                        servicios_has_actividades.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                listActidades = dictfetchall(cursor)
                editorOpciones(
                    items=listActidades,
                    id=id,
                    listTabla=actividades,
                    tablaIntermedia=ServiciosActividades,
                    itemGet=servicio,
                    tablaAgregar=Actividades,
                    filtro_principal='servicio', 
                    filtro_secundario='actividad', 
                    campo_principal='servicio', 
                    campo_secundario='actividad'
                )

                # ------------------------------------------------

                materiales = req['materiales']
                query = """
                    SELECT 
                        serma.material_id AS id, 
                        serma.cantidad 
                    FROM
                        servicios_has_materiales AS serma
                    WHERE 
                        serma.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                listMateriales = dictfetchall(cursor)
                material_items = [{"material":item["id"], "cantidad":item["cantidad"]} for item in listMateriales]
                editar = [objetMaterial for objetMaterial in materiales if objetMaterial  in material_items]
                for item in editar:
                    material=ServiciosMateriales.objects.get(servicio=int(id), material=item["material"])
                    material.cantidad = item["cantidad"]
                    material.save()
                eliminar = [objetMaterial for objetMaterial in material_items if objetMaterial not in materiales]
                for item in eliminar:
                    ServiciosMateriales.objects.filter(servicio=int(id), material=item["material"]).delete()
                agregar = [objetMaterial for objetMaterial in materiales if objetMaterial not in material_items]
                for item in agregar:
                    newMaterial = Materiales.objects.get(id=int(item["material"]))
                    ServiciosMateriales.objects.create(servicio=servicio, material=newMaterial, cantidad=int(item["cantidad"]))

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
        # except Exception as error:
        #     print(f"Error de consulta put - {error}")
        #     datos = {
        #         'status': False,
        #         'message': f"Error al editar: {error}",
        #     }
        #     return JsonResponse(datos)

    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            servicio = list(Servicios.objects.filter(id=id).values())
            if len(servicio) > 0:
                Servicios.objects.filter(id=id).delete()
                datos = {
                    'status': True,
                    'message': "Registro Eliminado"
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
            verify = verify_token(request.headers)
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                    'data': None
                }
                return JsonResponse(datos)

            if (int(id) > 0):
                query = """
                SELECT 
                    *
                FROM 
                    servicios 
                WHERE servicios.id=%s;
                """
                cursor.execute(query, [int(id)])
                servicio = dictfetchall(cursor)

                query = """
                SELECT 
                    re.id,
                    pe.nombres AS nombres,
                    pe.apellidos AS apellidos
                FROM 
                    recreadores AS re
                LEFT JOIN personas AS pe ON re.persona_id=pe.id
                INNER JOIN 
                        servicios_has_recreadores
                    ON 
                        re.id = servicios_has_recreadores.recreador_id
                 
                WHERE servicios_has_recreadores.servicio_id=%s;
                """
                cursor.execute(query, [int(id)])
                recreadores = dictfetchall(cursor)
                query = """
                    SELECT 
                        ac.id,
                        ac.nombre
                    FROM
                        actividades AS ac
                    INNER JOIN 
                        servicios_has_actividades
                    ON 
                        ac.id = servicios_has_actividades.actividad_id
                    WHERE 
                        servicios_has_actividades.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                actividades = dictfetchall(cursor)
                query = """
                    SELECT 
                        serma.material_id AS id, 
                        serma.cantidad,
                        ma.nombre AS nombre
                    FROM
                        servicios_has_materiales AS serma
                    INNER JOIN 
                        materiales AS ma
                    ON 
                        serma.material_id = ma.id
                    WHERE 
                        serma.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                materiales = dictfetchall(cursor)

                servicio[0]["recreadores"] = recreadores
                servicio[0]["actividades"] = actividades
                servicio[0]["materiales"] = materiales
                servicio[0]['duracion'] = duration(servicio[0]['duracion'])
                if (len(servicio) > 0):
                    datos = {
                        'status': True,
                        'message': "Exito",
                        'data': servicio[0]
                    }
                else:
                    datos = {
                        'status': False,
                        'message': "Servicio no encontrado",
                        'data': None
                    }
            else:
                if ("all" in request.GET and request.GET['all'] == "true"):
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
                        int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    servicios = dictfetchall(cursor)
                elif ("page" in request.GET and "desc" in request.GET and request.GET['desc'] == "true"):
                    query = """
                    SELECT * FROM servicios ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
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
                    servicio['duracion'] = duration(servicio['duracion'])
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(servicios) > 0:
                    datos = {
                        'status': True,
                        'message': "Exito",
                        'data': servicios,
                        "pages": int(result[0]['pages']),
                        "total": result[0]['total'],
                    }
                else:
                    datos = {
                        'status': False,
                        'message': "Error. No se encontraron registros",
                        'data': None,
                        "pages": None,
                        "total": 0
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

    