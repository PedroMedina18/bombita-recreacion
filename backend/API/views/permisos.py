from django.shortcuts import render
from django.http.response import JsonResponse
from django.views import View

from ..funtions.serializador import dictfetchall
from django.db import IntegrityError, connection
import json


class Permisos_Views(View):
    def get(self, request):
        try:
            cursor = connection.cursor()
            query = "SELECT * FROM permisos ORDER BY id ASC;"
            cursor.execute(query)
            permisos = dictfetchall(cursor)
            if len(permisos) > 0:
                datos = {
                    "status": True,
                    'message': "Exito",
                    "data": permisos
                }
            else:
                datos = {
                    "status": False,
                    'message': "Error. Permisos no encontrados",
                    "data": None
                }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
                "data": None
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
