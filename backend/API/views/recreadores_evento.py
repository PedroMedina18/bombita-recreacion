from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..utils.filtros import order, filtrosWhere,peridoFecha
from ..utils.token import verify_token
from ..message import MESSAGE
import json


class Recreadores_Eventos_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if not verify['status']:
                datos = {'status': False, 'message': verify['message'], 'data': None}
                return JsonResponse(datos)

            if(not (bool(verify['info']['administrador']) or 7 in verify['info']['permisos'] or 12 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            page = request.GET.get('page', 1)
            inicio = indiceInicial(int(page))
            final = indiceFinal(int(page))
            all = request.GET.get('all', "false")
            limit = ""
            orderType = order(request)
            
            where = []
            fecha = peridoFecha(request, "eve.fecha_evento_inicio")
            where.append(f"res.recreador_id={int(id)}")
            if(fecha):
                where.append(f"{fecha}")
            where = filtrosWhere(where)

            if(all == "true"):
                limit=""
            else:
                limit=f"LIMIT {inicio}, {final}"

            query = """
                SELECT 
                    eve.id,
                	eve.fecha_evento_inicio,
                	eve.fecha_evento_final,
                    eve.direccion,
                    per.nombres, 
                    per.apellidos, 
                    tipo.nombre AS tipo_documento, 
                    per.numero_documento,
                    eve.estado
                FROM recreadores_eventos_servicios res
                INNER JOIN recreadores AS re ON res.recreador_id=re.id
                INNER JOIN personas AS per ON re.persona_id=per.id
                LEFT JOIN tipos_documentos AS tipo ON per.tipo_documento_id=tipo.id
                INNER JOIN eventos as eve ON res.evento_id=eve.id
                {}
                ORDER BY eve.id {} {};
            """.format(where, orderType, limit)

            cursor.execute(query)
            eventos = dictfetchall(cursor)

            if len(eventos) > 0:
                datos = {
                   'status': True,
                    'message': f"{MESSAGE['exitoGet']}",
                    'data': eventos,
                }
            else:
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['errorRegistrosNone']}",
                    'data': None,
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