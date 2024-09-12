from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection
import json
from ..utils.serializador import dictfetchall
from ..utils.token import verify_token, new_token
from datetime import datetime 
from ..message import MESSAGE
from ..utils.dollar import consultDollar
from decouple import config

class Verify_Token_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        try:
            verify = verify_token(request.headers)
            cursor=connection.cursor()
            direccion=config('URL')
            if verify['status']:
                query="""
                SELECT 
                    user.id, 
                    user.usuario, 
                    user.contraseña, 
                    ca.id AS cargo_id,
                    ca.administrador,
                    IF(ca.img IS NOT NULL AND ca.img != '', CONCAT('{}media/', ca.img), ca.img) AS img,
                    ca.nombre AS cargo 
                FROM usuarios user
                LEFT JOIN personas per ON user.persona_id = per.id
                LEFT JOIN cargos ca ON user.cargo_id = ca.id
                WHERE user.id=%s;
                """.format(direccion)
                cursor.execute(query, [int(verify['info']['id'])])
                usuario = dictfetchall(cursor)
                if(not usuario[0]['administrador']):
                    
                    query="""
                        SELECT
                            *
                        FROM privilegios
                        WHERE cargo_id=%s;
                        """
                    cursor.execute(query, [int(usuario[0]['cargo_id'])])
                    permisos = dictfetchall(cursor)
                    usuario[0]['permisos'] = [permiso['permiso_id'] for permiso in permisos]
                token = new_token(usuario[0])
                precioDollar = consultDollar(cursor)
                datos = {
                    'status': True,
                    'message': 'Token valido',
                    'token': token['token'],
                    'data':{
                        'id':usuario[0]['id'],
                        'usuario':usuario[0]['usuario'],
                        'cargo_id':usuario[0]['cargo_id'],
                        'cargo':usuario[0]['cargo'],
                        'img':usuario[0]['img'],
                        'inicio_sesion':datetime.now(),
                        'dollar':precioDollar,
                    } 
                }
                if(usuario[0]['administrador']):
                    datos['data']['administrador'] = usuario[0]['administrador']
                else:
                    datos['data']['permisos'] = usuario[0]['permisos']
            else:
                datos = {
                    'status': False,
                    'message': verify['message']
                }
            return JsonResponse(datos)
        except Exception as ex:
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorSystem']}",
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()