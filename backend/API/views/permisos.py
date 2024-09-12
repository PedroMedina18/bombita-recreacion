from django.shortcuts import render
from django.http.response import JsonResponse
from django.views import View
from ..utils.token import verify_token
from ..utils.serializador import dictfetchall
from django.db import IntegrityError, connection
from ..message import MESSAGE
import json


class Permisos_Views(View):
    def get(self, request):
        try:
            cursor = connection.cursor()
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                    'data': None
                }
                return JsonResponse(datos)
            query = 'SELECT * FROM permisos ORDER BY nombre ASC;'
            cursor.execute(query)
            permisos = dictfetchall(cursor)
            if len(permisos) > 0:
                datos = {
                    'status': True,
                    'message': 'Exito',
                    'data': permisos
                }
            else:
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['errorRegistrosPermisos']}",
                    'data': None
                }
            return JsonResponse(datos)
        except Exception as ex:
            print('Error', ex)
            datos = {
                'status': False,
                'message': 'Error. Error de sistema',
                'data': None
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
