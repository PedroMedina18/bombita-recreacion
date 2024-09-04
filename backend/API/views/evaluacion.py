from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.time import duration
from ..funtions.identificador import determinar_valor, edit_str, normalize_id_list
from ..models import EventosRecreadoresServicios, Eventos, Recreadores, PreguntasEvento, EventosServicios, EventoPreguntasEvento
from ..funtions.token import verify_token
from ..message import MESSAGE
from decouple import config
import datetime
import json


class Evaluacion_View(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, id):
        try:
            cursor = connection.cursor()
            verify=verify_token(request.headers)
            direccion=config('URL')
            if not verify["status"]:
                datos = {
                    "status": False,
                    "message": verify["message"],
                }
                return JsonResponse(datos)

            queryEvento = """
                    SELECT 
                        eve.id,
                    	eve.fecha_evento_inicio,
                    	eve.fecha_evento_final,
                        per.nombres,
                        per.apellidos, 
                        tipo.nombre AS tipo_documento, 
                        per.numero_documento,
                        eve.numero_personas,
                        eve.direccion,
                        eve.opinion,
                        eve.evaluado,
                        eve.estado
                    FROM eventos AS eve
                    LEFT JOIN clientes AS cli ON eve.cliente_id=cli.id
                    INNER JOIN personas AS per ON cli.persona_id=per.id
                    LEFT JOIN tipos_documentos AS tipo ON per.tipo_documento_id=tipo.id
                    WHERE eve.id=%s;
            """
            cursor.execute(queryEvento, [int(id)])
            dataEvento = dictfetchall(cursor)
            if len(dataEvento) > 0:
                evento = Eventos.objects.get(id=int(id))
            else:
                datos = {"status": False, "message": MESSAGE["errorEvento"]}
                return JsonResponse(datos)
            
            if not evento.estado:
                datos = {"status": False, "message": MESSAGE["errorEventoNoCompletado"]}
                return JsonResponse(datos)
                
            print(dataEvento)
            print(evento.evaluado)

            queryRecreadores = """
                    SELECT
                        re.id,
                        res.evaluacion_recreador AS value,
                        IF(re.img_perfil IS NOT NULL AND re.img_perfil != '', CONCAT('{}media/', re.img_perfil), img_perfil) AS img_perfil,
                        per.nombres, 
                        per.apellidos
                    FROM recreadores_eventos_servicios as res
                    LEFT JOIN recreadores AS re ON res.recreador_id=re.id
                    LEFT JOIN personas AS per ON re.persona_id=per.id
                    WHERE res.evento_id = %s;
                """.format(direccion)
            if evento.evaluado:
                query = """
                    SELECT
                        pre.id,
                        evpre.respuesta AS value,
                        pre.pregunta
                    FROM eventos_preguntas_evento as evpre
                    LEFT JOIN preguntas_eventos AS pre ON evpre.pregunta_id=pre.id
                    WHERE evpre.evento_id = %s;
                """
                cursor.execute(query, [int(id)])
                preguntas = dictfetchall(cursor)

                cursor.execute(queryRecreadores, [int(id)])
                recreadores = dictfetchall(cursor)
                datos = {
                    "status": True,
                    "message": f"{MESSAGE['exitoGet']}",
                    "data": {
                        "evento": dataEvento[0],
                        "preguntas": preguntas,
                        "recreadores": recreadores,
                    },
                }
            else:
                query = """
                    SELECT
                        pre.id,
                        pre.pregunta
                    FROM preguntas_eventos as pre
                    WHERE pre.estado=1
                """
                cursor.execute(query)
                preguntas = dictfetchall(cursor)


                cursor.execute(queryRecreadores, [int(id)])
                recreadores = dictfetchall(cursor)
                datos = {
                    "status": True,
                    "message": f"{MESSAGE['exitoGet']}",
                    "data": {
                        "evento": dataEvento[0],
                        "preguntas": preguntas,
                        "recreadores": recreadores,
                    },
                }
            return JsonResponse(datos)
        except Exception as error:
            print(f"{MESSAGE['errorGet']} - {error}")
            datos = {
                "status": False,
                "message": f"{MESSAGE['errorConsulta']}: {error}",
                "data": None,
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

    def post(self, request):
        try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            evento = list(Eventos.objects.filter(id=int(req["evento"])).values())
            if len(evento) > 0:
                evento = Eventos.objects.get(id=int(req["evento"]))
            else:
                datos = {"status": False, "message": MESSAGE["errorEvento"]}
                return JsonResponse(datos)

            if not evento.estado:
                datos = {"status": False, "message": MESSAGE["errorEventoNoCompletado"]}
                return JsonResponse(datos)
            
            if evento.evaluado:
                datos = {"status": False, "message": MESSAGE["errorEventoEvaluado"]}
                return JsonResponse(datos)

            for pregunta in req['preguntas']:
                preguntaEvento = list(PreguntasEvento.objects.filter(id=int(pregunta["id"]), estado=True).values())
                if len(preguntaEvento) > 0:
                    preguntaEvento = PreguntasEvento.objects.get(id=int(pregunta["id"]))
                else:
                    datos = {"status": False, "message": MESSAGE["errorEvento"]}
                    return JsonResponse(datos)
                
                if len(list(EventoPreguntasEvento.objects.filter(evento=req['evento'], pregunta=int(pregunta["id"])).values()))>0:
                    respuestaEvento = EventoPreguntasEvento.objects.get(evento=req['evento'], pregunta=int(pregunta["id"]))
                    respuestaEvento.respuesta=pregunta['value']
                    respuestaEvento.save()
                else:
                    EventoPreguntasEvento.objects.create(evento=evento, pregunta=preguntaEvento, respuesta=pregunta['value'])

            for recreador in req['recreadores']:
                recreadorEvento = list(EventosRecreadoresServicios.objects.filter(evento=req['evento'], recreador=recreador['id']).values())
                if len(recreadorEvento) > 0:
                    recreadorEvento = EventosRecreadoresServicios.objects.get(evento=req['evento'], recreador=recreador['id'])
                    recreadorEvento.evaluacion_recreador=recreador['value']
                    recreadorEvento.save()
                else:
                    datos = {"status": False, "message": MESSAGE["errorEvento"]}
                    return JsonResponse(datos)
            evento.evaluado=True
            evento.opinion=req['opinion']
            evento.save()
            datos = {
                "status": True,
                "message": f"{MESSAGE['registerEvaluacion']}",
            }

            return JsonResponse(datos)

        except Exception as error:
            print(f"{MESSAGE['errorPost']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorRegistro']}: {error}",
            }
            return JsonResponse(datos)