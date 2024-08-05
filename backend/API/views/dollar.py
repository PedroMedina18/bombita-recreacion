from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import PrecioDolar
from ..funtions.token import verify_token
from django.db import IntegrityError, connection, models
from ..message import MESSAGE
import json

# CRUD COMPLETO DE LA TABLA DE CARGOS

class Dollar_View(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, id=0):
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
            
            if('all' in request.GET and request.GET['all']=='true'):
                query = """
                SELECT * FROM precio_dolar ORDER BY fecha_registro DESC;
                """
                cursor.execute(query)
                materiales = dictfetchall(cursor)
            elif('page' in request.GET ):
                query = """
                SELECT * FROM precio_dolar ORDER BY fecha_registro ASC LIMIT %s, %s;
                """
                cursor.execute(query, [indiceInicial(int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                materiales = dictfetchall(cursor)
            elif('page' in request.GET and "desc" in request.GET and request.GET['desc']=='true'):
                query = """
                SELECT * FROM precio_dolar ORDER BY fecha_registro DESC LIMIT %s, %s;
                """
                cursor.execute(query, [indiceInicial(int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                materiales = dictfetchall(cursor)
            else:
                query = """
                SELECT * FROM precio_dolar ORDER BY fecha_registro DESC LIMIT 25;
                """
                cursor.execute(query)
                materiales = dictfetchall(cursor)

            query="""
                SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM precio_dolar;
            """
            cursor.execute(query)
            result = dictfetchall(cursor)
            if len(materiales)>0:
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['exitoGet']}",
                    'data': materiales,
                    'pages': int(result[0]['pages']),
                    'total':result[0]['total'],
                }
            else:
                datos = {
                    'status': False,
                    'message': f"{MESSAGE['errorRegistrosNone']}",
                    'data': None,
                    'pages': None,
                    'total':0
                }
            return JsonResponse(datos)
        except Exception as error:
            print(f"{MESSAGE['errorGet']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorConsulta']}: {error}",
                'data': None,
                'pages': None,
                'total':0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()