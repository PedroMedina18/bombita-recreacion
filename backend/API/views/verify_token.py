from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection
import json
from ..funtions.serializador import dictfetchall
from ..funtions.token import verify_token, new_token
from datetime import datetime 


class Verify_Token_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        try:
            verify = verify_token(request.headers)
            cursor=connection.cursor()
            if verify["status"]:
                query="""
                SELECT 
                    user.id, 
                    user.usuario, 
                    user.contraseña, 
                    CONCAT(per.nombres, ' ', per.apellidos ) AS nombre, 
                    ca.id AS cargo_id,
                    ca.nombre AS cargo 
                FROM usuarios user
                LEFT JOIN personas per ON user.persona_id = per.id
                LEFT JOIN cargos ca ON user.cargo_id = ca.id
                WHERE user.id=%s;
                """
                cursor.execute(query, [int(verify["info"]["id"])])
                usuario=dictfetchall(cursor)
                token=new_token(usuario[0])
                datos = {
                    'status': True,
                    'message': "Token valido",
                    "token": token["token"],
                    'data':{
                        "id":usuario[0]["id"],
                        "nombre":usuario[0]["nombre"],
                        "cargo":usuario[0]["cargo"],
                        "inicio_sesion":datetime.now()
                    } 
                }
            else:
                datos = {
                    'status': False,
                    'message': verify["message"]
                }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema"
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()