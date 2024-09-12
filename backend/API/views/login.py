from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..utils.encriptado_contraseña import encriptado_constraseña, desencriptado_contraseña
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.token import new_token, verify_token
from ..utils.serializador import dictfetchall
from ..utils.dollar import consultDollar
from ..models import Cargos
from ..message import MESSAGE
from django.db import IntegrityError, connection
from datetime import datetime 
import json
from decouple import config

class Login(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        jd = json.loads(request.body)
        direccion=config('URL')
        try:
            cursor=connection.cursor()
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
                WHERE UPPER(user.usuario)=%s AND estado=1;
            """.format(direccion)
            cursor.execute(query, [str(jd['usuario'].upper())])
            usuario=dictfetchall(cursor)
            if(len(usuario)>0):
                # se comprueba de que la contraseña este correcta
                contraseña = desencriptado_contraseña(usuario[0]['contraseña'], jd['contraseña'])
                if(contraseña):
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
                    precioDollar=consultDollar(cursor)
                    
                    token=new_token(usuario[0])
                    response={
                        'status':True,
                        'message': MESSAGE['Acceso'],
                        'token':token['token'], 
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
                        response['data']['administrador'] = usuario[0]['administrador']
                    else:
                        response['data']['permisos'] = usuario[0]['permisos']

                    return JsonResponse(response)
                else:
                    response={
                        'status':False, 
                        'message': MESSAGE['userPassword'],
                        'token':None, 
                        'data':None
                    }
                    return JsonResponse(response)
            else:
                response={
                    'status':False, 
                    'message': MESSAGE['userPassword'],
                    'token':None, 
                    'data':None
                }
                return JsonResponse(response)
        except Exception as error:
            datos = {
                'status':False,
                'message': f"{MESSAGE['errorSystem']}: {error}",
                'token':None, 
                'data':None}
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

