from django.shortcuts import render
from django.http.response import JsonResponse
from django.views import View
from ..funtions.serializador import dictfetchall
from django.db import IntegrityError, connection

class Persona_Views(View):
    def get(self, request, documento=0, tipo_documento=0):
        try:
            cursor = connection.cursor()
            if(documento>0 and tipo_documento>0):
                query = """
                    SELECT 
                        p.id
                        p.nombres, 
                        p.apellidos, 
                        p.numero_documento,
                        p.telefono_principal,
                        p.telefono_secundario,
                        p.correo,
                        tp.id,
                        tp.nombre
                    FROM personas AS p
                        LEFT JOIN tipo_documento AS tp
                    ON p.tipo_documento_id= tp.id
                    WHERE p.numero_documento=%s AND tp.id=%s;
                """
            cursor.execute(query, [int(documento), int(tipo_documento)])
            persona = dictfetchall(cursor)
            if len(persona) > 0:
                datos = {
                    "status": True,
                    'message': "Exito",
                    "data": persona[0]
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
