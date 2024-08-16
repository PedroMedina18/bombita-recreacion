from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.time import duration
from ..funtions.identificador import determinar_valor, edit_str, normalize_id_list
from ..models import Eventos, Servicios, EventosRecreadoresServicios, Recreadores
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
from ..message import MESSAGE
from decouple import config
import json


class Eventos_Recreadores_Servicios_View(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, id):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if not verify['status']:
                datos = {'status': False, 'message': verify['message'], 'data': None}
                return JsonResponse(datos)

            evento = list(Eventos.objects.filter(id=id).values())
            if len(evento) == 0:
                datos = {'status': False, 'message': MESSAGE['errorEvento'], 'data': None,}
                return JsonResponse(datos)

            query = """
                SELECT
                    ser.id,
                    ser.nombre,
                    ser.duracion,
                    ser.numero_recreadores,
                    ser.descripcion
                FROM servicios AS ser
                LEFT JOIN servicios_eventos AS sere ON sere.servicio_id=ser.id
                WHERE sere.evento_id=%s
            """

            cursor.execute(query, [id])
            servicios = dictfetchall(cursor)
            servicios = [{**servicio, "recreadores":[], 'duracion' : duration(servicio['duracion'])} for servicio in servicios]
            query = """
                SELECT
                    reve.id,
                    re.id AS recreador_id,
                    pe.nombres, 
                    re.fecha_nacimiento,
                    pe.apellidos, 
                    ni.nombre AS nivel,
                    ge.nombre AS genero,
                    re.img,
                    ser.id AS servicio_id,
                    ser.nombre AS servicio
                FROM recreadores_eventos_servicios reve
                INNER JOIN recreadores AS re ON re.id=reve.recreador_id
                LEFT JOIN personas AS pe ON pe.id=re.persona_id
                LEFT JOIN generos AS ge ON ge.id=re.genero_id
                LEFT JOIN niveles AS ni ON ni.id=re.nivel_id
                INNER JOIN servicios AS ser ON ser.id=reve.servicio_id
                WHERE reve.evento_id=%s
            """

            cursor.execute(query, [id])
            recreadores = dictfetchall(cursor)
            isRecreadores = True if len(recreadores) != 0 else False 
            for recreador in recreadores:
                recreador["img"] = (
                    f"{config('URL')}media/{recreador['img']}"
                    if recreador['img']
                    else None
                )
                servicio_id = recreador['servicio_id']
                for servicio in servicios:
                    if servicio['id'] == servicio_id:
                        servicio['recreadores'].append(recreador)
                        break
            data = {'evento': id, 'servicios': servicios, "recreadores" : isRecreadores}
            datos = {
                'status': True,
                'message': f"{MESSAGE['exitoGet']}",
                'data' : data
            }
            return JsonResponse(datos)

        except Exception as error:
            print(f"{MESSAGE['errorGet']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorConsulta']}: {error}",
                'data': None,
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

    def post(sel, request):
        try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            cursor = connection.cursor()

            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)

            evento = list(Eventos.objects.filter(id = int(req["evento"])).values())
            if len(evento) > 0:
                evento = Eventos.objects.get(id = int(req["evento"]))
            else:
                datos = {'status': False, 'message': MESSAGE['errorEvento']}
                return JsonResponse(datos)

            query="""
                SELECT 
                    es.servicio_id,
                    COUNT(res.id) AS total_recreadores
                FROM 
                    servicios_eventos AS es
                    LEFT JOIN recreadores_eventos_servicios res ON es.servicio_id = res.servicio_id AND es.evento_id = res.evento_id
                WHERE 
                    es.evento_id = %s
                GROUP BY 
                    es.servicio_id;
            """
            cursor.execute(query, [int(req["evento"])])
            resultados = dictfetchall(cursor)
            
            recreadores_id= [recreador["id"] for recreador in req["recreadores"]]
            if len(recreadores_id) != len(set(recreadores_id)):
                datos = {
                    'status': False,
                    'message': f"{MESSAGE['errorDuplicateRecreador']}"
                }
                return JsonResponse(datos)

            totalRecreadores={}
            for total in resultados:
                totalRecreadores[f"{total['servicio_id']}"] = total["total_recreadores"]

            for recreador in req["recreadores"]:
                servicio = Servicios.objects.get(id=recreador["servicio"])
                if(totalRecreadores[f"{servicio.id}"] < servicio.numero_recreadores):
                    recreadorGet = Recreadores.objects.get(id=recreador["id"])
                    EventosRecreadoresServicios.objects.create(evento = evento, recreador = recreadorGet, servicio = servicio)

            datos = {
                'status': True,
                'message': f"{MESSAGE['registerRecreadores']}"
            }
            return JsonResponse(datos)

        except Exception as error:
            print(f"{MESSAGE['errorPost']} - {error}", )
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorRegistro']}: {error}"
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

    def put(sel, request, id_evento):
        try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            cursor = connection.cursor()

            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)

            evento = list(Eventos.objects.filter(id=id_evento).values())
            if len(evento) > 0:
                evento = Eventos.objects.get(id = id_evento)
            else:
                datos = {'status': False, 'message': MESSAGE['errorEvento']}
                return JsonResponse(datos)

            recreadores_id= [recreador["id"] for recreador in req["recreadores"]]
            if len(recreadores_id) != len(set(recreadores_id)):
                datos = {
                    'status': False,
                    'message': f"{MESSAGE['errorDuplicateRecreador']}"
                }
                return JsonResponse(datos)

            query="""
                SELECT 
                    es.recreador_id AS id
                    es.servicio_id AS servicio
                FROM 
                    recreadores_eventos_servicios AS es
                WHERE 
                    es.evento_id = %s
            """
            cursor.execute(query, [id_evento])
            recreadores_registrados = dictfetchall(cursor)
            recreadores_nuevos = req["recreadores"]
            recreador_eliminar = [recreador_registrado for recreador_registrado in recreadores_registrados if not any(recreador_nuevo.id == recreador_registrado.id and recreador_nuevo.servicio == recreador_registrado.servicio for recreador_nuevo in recreadores_nuevos)]
            recreador_agregar = [recreador_nuevo for recreador_nuevo in recreadores_nuevos if not any(recreador_registrado.id == recreador_nuevo.id and recreador_registrado.servicio == recreador_nuevo.servicio for recreador_registrado in recreadores_registrados)]
            
            for eliminar in recreador_eliminar:
                recreador = Recreadores.objects.get(id=int(eliminar["id"]))
                servicio = Servicios.objects.get(id=int(eliminar["servicio"]))
                EventosRecreadoresServicios.filter(evento=evento, servicio=servicio, recreador=recreador).delete()
            
            query="""
                SELECT 
                    es.servicio_id,
                    COUNT(res.id) AS total_recreadores
                FROM 
                    servicios_eventos AS es
                    LEFT JOIN recreadores_eventos_servicios res ON es.servicio_id = res.servicio_id AND es.evento_id = res.evento_id
                WHERE 
                    es.evento_id = %s
                GROUP BY 
                    es.servicio_id;
            """
            cursor.execute(query, [int(req["evento"])])
            resultados = dictfetchall(cursor)

            totalRecreadores={}
            for total in resultados:
                totalRecreadores[f"{total['servicio_id']}"] = total["total_recreadores"]


            for agregar in recreador_agregar:
                servicio = Servicios.objects.get(id=agregar["servicio"])
                if(totalRecreadores[f"{servicio.id}"] < servicio.numero_recreadores):
                    recreador = Recreadores.objects.get(id=agregar["id"])
                    EventosRecreadoresServicios.objects.create(evento = evento, recreador = recreador, servicio = servicio)

        except Exception as error:
            print(f"{MESSAGE['errorPut']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorEdition']}: {error}",
            }
            return JsonResponse(datos)
