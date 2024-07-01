from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.encriptado_contraseña import encriptado_constraseña, desencriptado_contraseña
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.token import new_token, verify_token
from ..funtions.serializador import dictfetchall
from ..funtions.dollar import consultDollar
from ..models import Cargos
from ..message import MESSAGE
from django.db import IntegrityError, connection
import json
from datetime import datetime 

class Login(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        jd = json.loads(request.body)
        try:
            cursor=connection.cursor()
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
                WHERE user.usuario=%s;
            """
            cursor.execute(query, [str(jd['usuario'])])
            usuario=dictfetchall(cursor)
            if(len(usuario)>0):
                # se comprueba de que la contraseña este correcta
                contraseña = desencriptado_contraseña(usuario[0]['contraseña'], jd['contraseña'])
                if(contraseña):
                    # user_administrador=Cargos.objects.filter(id=usuario[0]['cargo_id']).values("administrador")
                    # if(user_administrador[0]['administrador']):
                    #     token=new_token(usuario[0], None, user_administrador[0]['administrador'])
                    #     response={
                    #         'status':True,
                    #         'message': "Acceso permitido", 
                    #         'token':token['token'], 
                    #         'data':{
                    #             "nombre":usuario[0]['nombre'], 
                    #             "cargo":usuario[0]['cargo'], 
                    #             "usuario":usuario[0]['usuario'],
                    #             "administador":user_administrador[0]['administrador'],
                    #             "permisos": None
                    #         }
                    #     }
                    # else:
                    #     query="""
                    #     SELECT p.id 
                    #     FROM
                    #         cargos AS c
                    #     INNER JOIN 
                    #         permisos_has_cargos 
                    #     ON 
                    #         c.id = permisos_has_cargos.cargo_id
                    #     INNER JOIN 
                    #         permisos AS P
                    #     ON 
                    #         p.id = permisos_has_cargos.permiso_id
                    #     WHERE 
                    #         c.id = %s;
                    #     """
                    #     cursor.execute(query, [int(usuario[0]['cargo_id'])])
                    #     permisos=dictfetchall(cursor)
                    # token=new_token(usuario[0], [permiso['id'] for permiso in permisos], False)
                    precioDollar=consultDollar(cursor)
                    token=new_token(usuario[0])
                    response={
                        'status':True,
                        'message': MESSAGE["Acceso"],
                        'token':token['token'], 
                        'data':{
                            'id':usuario[0]['id'],
                            'nombre':usuario[0]['nombre'],
                            'cargo':usuario[0]['cargo'],
                            'inicio_sesion':datetime.now(),
                            'dollar':precioDollar,
                        }
                    }
                    return JsonResponse(response)
                else:
                    response={
                        'status':False, 
                        'message': MESSAGE["userPassword"],
                        'token':None, 
                        'data':None
                    }
                    return JsonResponse(response)
            else:
                response={
                    'status':False, 
                    'message': MESSAGE["userPassword"],
                    'token':None, 
                    'data':None
                }
                return JsonResponse(response)
        except Exception as ex:
            print("Error", ex)
            datos = {
                'status':False,
                'message': MESSAGE["errorSystem"],
                'token':None, 
                'data':None}
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

