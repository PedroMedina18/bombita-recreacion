from django.shortcuts import render
from django.http.response import JsonResponse
from django.views import View
from ..funtions.serializador import dictfetchall
from django.db import IntegrityError, connection
from ..funtions.token import verify_token
from ..message import MESSAGE

class Personas_Views(View):
    def get(self, request, tipo_documento=0, documento=0):
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
            if(tipo_documento>0 and documento>0):
                query = """
                    SELECT 
                        p.id,
                        p.nombres, 
                        p.apellidos, 
                        p.numero_documento,
                        CONCAT('0', p.telefono_principal) AS telefono_principal,
                        CONCAT('0', p.telefono_secundario) AS telefono_secundario,
                        p.correo,
                        tp.id AS id_documento,
                        tp.nombre AS nombre_documento
                    FROM personas AS p
                        LEFT JOIN tipos_documentos AS tp
                    ON p.tipo_documento_id= tp.id
                    WHERE p.numero_documento=%s AND tp.id=%s;
                """
            else:
                datos = {
                    'status': False,
                    'message': "Error. Persona no encontrada",
                    'data': None
                }
                return JsonResponse(datos)
            cursor.execute(query, [int(documento), int(tipo_documento)])
            persona = dictfetchall(cursor)
            if len(persona) > 0:
                datos = {
                    'status': True,
                    'message': 'Exito',
                    'data': persona[0]
                }
            else:
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['errorRegistrosPersonas']}",
                    'data': None
                }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                'status': False,
                'message': 'Error. Error de sistema',
                'data': None
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
