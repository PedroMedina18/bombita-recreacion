from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.email import emailRegistroEvento
from ..funtions.filtros import order, typeOrder, filtrosWhere,peridoFecha
from ..models import Eventos, EventosSobrecargos, EventosServicios, Clientes, Personas, Servicios, Sobrecargos, TipoDocumento
from ..funtions.token import verify_token
from ..message import MESSAGE
from datetime import datetime
import json


class Eventos_Views(View):
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

            query = """
                SELECT 
                    eve.id,
                	eve.fecha_evento,
                    per.nombres, 
                    per.apellidos, 
                    tipo.nombre AS tipo_documento, 
                    per.numero_documento,
                    eve.completado,
                FROM recreadores_eventos_servicios res
                INNER JOIN recreadores AS re ON res.recreador_id=re.id
                INNER JOIN personas AS per ON re.persona_id=per.id
                LEFT JOIN tipos_documentos AS tipo ON per.tipo_documento_id=tipo.id
                INNER JOIN evento as eve ON res.evento_id=eve.id
                WHERE res.recreador_id = %s ;
            """

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