from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..models import PrecioDolar
from ..utils.filtros import order, filtrosWhere, peridoFecha
from ..utils.token import verify_token
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

            if(not (bool(verify['info']['administrador']) or 14 in verify['info']['permisos'] or 12 in verify['info']['permisos'] or 6 in verify['info']['permisos'] or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            ordenFecha = request.GET.get('fecha', "fecha_registro")
            page = request.GET.get('page', 1)
            typeOrdenBy = request.GET.get('organizar', "orig")
            inicio = indiceInicial(int(page))
            final = indiceFinal(int(page))
            all = request.GET.get('all', False)
            orderType = order(request)
            fecha = peridoFecha(request, ordenFecha)
            where = []

            if(typeOrdenBy=="fech"):
                typeOrdenBy ="fecha_registro"
            elif(typeOrdenBy=="precio"):
                typeOrdenBy ="precio"
            else:
                typeOrdenBy="fecha_registro"

            if(fecha):
                where.append(f"{fecha}")

            where = filtrosWhere(where)

            if(all == "true"):
                query = "SELECT * FROM precio_dolar {} ORDER BY {} {};".format(where, typeOrdenBy, orderType)
                cursor.execute(query)
                dollar = dictfetchall(cursor)
            else:
                query = "SELECT * FROM precio_dolar {} ORDER BY {} {} LIMIT {}, {};".format(where, typeOrdenBy, orderType, inicio, final)
                print(query)
                cursor.execute(query)
                dollar = dictfetchall(cursor)

            query="""
                SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM precio_dolar;
            """
            cursor.execute(query)
            result = dictfetchall(cursor)
            if len(dollar)>0:
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['exitoGet']}",
                    'data': dollar,
                    'pages': int(result[0]['pages']),
                    'total':result[0]['total'],
                }
            else:
                datos = {
                    'status': True,
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