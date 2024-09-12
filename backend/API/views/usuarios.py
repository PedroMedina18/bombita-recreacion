from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..utils.encriptado_contraseña import encriptado_constraseña, desencriptado_contraseña
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.token import verify_token
from ..utils.identificador import determinar_valor, edit_str
from ..utils.serializador import dictfetchall
from ..models import Cargos, TipoDocumento, Usuarios, Personas
from django.db import IntegrityError, connection, models
from ..utils.filtros import order, filtrosWhere
from ..message import MESSAGE
from decouple import config
import json


class Usuarios_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 2 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            usuario = list(Usuarios.objects.filter(usuario=req["usuario"].upper()).values())
            if len(usuario) > 0:
                datos = {
                        'status': False,
                        'message': MESSAGE["usuarioDuplicate"],
                    }
                return JsonResponse(datos)

            # Comprobar si se esta registrando un nuevo recreador con los datos de una persona existente
            if('id_persona' in req):
                persona = list(Personas.objects.filter(id=int(req['id_persona'])).values())
                if(len(persona)>0):
                    persona = Personas.objects.get(id=int(req['id_persona']))
                else:
                    datos = {
                        'status': False,
                        'message': MESSAGE["errorPersona"],
                    }
                    return JsonResponse(datos)
                    
            else:
                tipo_documento = list(TipoDocumento.objects.filter(id=int(req['tipo_documento'])).values())
                if(len(tipo_documento)>0):
                    tipo_documento = TipoDocumento.objects.get(id=int(req['tipo_documento']))
                else:
                    datos = {
                        'status': False,
                        'message':  MESSAGE["errorTipoDocumento"],
                    }
                    return JsonResponse(datos)
                persona = Personas.objects.create(
                    nombres=req['nombres'].title(), 
                    apellidos=req['apellidos'].title(), 
                    numero_documento=req['numero_documento'],
                    telefono_principal=req['telefono_principal'],
                    telefono_secundario=req['telefono_secundario'],
                    correo=req['correo'],
                    tipo_documento=tipo_documento
                )
            contraseña=encriptado_constraseña(req['contraseña'])
            cargo = list(Cargos.objects.filter(id=req['cargo']).values())
            if(len(cargo)>0):
                cargo = Cargos.objects.get(id=req['cargo'])
            else:
                datos = {
                    'status': False,
                    'message': MESSAGE["errorCargo"],
                }
                return JsonResponse(datos)
            Usuarios.objects.create(
                persona=persona,
                usuario=req['usuario'].upper(),
                contraseña=contraseña,
                cargo=cargo
            )
            datos = {
                'status': True,
                'message': f"{MESSAGE['registerUsuario']}"
            }
            return JsonResponse(datos)
        except IntegrityError as error:
            if error.args[0]==1062:
                if 'telefono_principal' in error.args[1]:
                    message = MESSAGE['telefonoPrincipalDuplicate']
                elif'usuario' in error.args[1]:
                    message = MESSAGE['usuarioDuplicate']
                elif'correo' in error.args[1]:
                    message = MESSAGE['correoDuplicate']
                elif'numero_documento' in error.args[1]:
                    message = MESSAGE['documentoDuplicate']
                else:
                    message = f"{MESSAGE['errorDuplicate']}: {error.args[1]} "
                datos = {
                'status': False,
                'message': message
                }
            else:
                datos = {
                'status': False,
                'message': f"{MESSAGE['errorIntegrity']}: {error}"
                }
            return JsonResponse(datos)
        except Exception as error:
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorRegistro']}: {error}"
            }
            return JsonResponse(datos)
    
    def put(self, request, id):
        try:
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            password = request.GET.get('password', "false")
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"]}
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 2 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            
            usuario = list(Usuarios.objects.filter(id=id).values())
            if len(usuario) > 0:
                usuario = Usuarios.objects.get(id=id)
                if(password=="true"):
                    if(req["contraseña"] == req["contraseña_repetida"]):
                        contraseña=encriptado_constraseña(req['contraseña'])
                        usuario.contraseña=contraseña
                        usuario.save()
                        datos = {
                            "status": True, 
                            "message": f"{MESSAGE['edition']}"
                        }
                        return JsonResponse(datos)
                    else:
                        datos = {
                            "status": False,
                            "message": f"{MESSAGE['errorContraseña']}",
                        }
                        return JsonResponse(datos)
                
                persona = Personas.objects.get(id=usuario.persona.id)
                usuario.estado=req['estado']

                if(usuario.cargo.administrador and not req['estado']):
                    datos = {
                    "status": False, 
                    "message": f"{MESSAGE['errorDisabledNot']}"
                    }
                    return JsonResponse(datos)


                if(not req['estado']):
                    usuario.save()
                    datos = {
                    "status": True, 
                    "message": f"{MESSAGE['exitoUserDisabled']}"
                    }
                    return JsonResponse(datos)

                if(id==1 and req['cargo']!=1):
                    datos = {
                    "status": False, 
                    "message": f"{MESSAGE['errorAdministradorProtejido']}"
                    }
                    return JsonResponse(datos)

                tipo_documento = list(TipoDocumento.objects.filter(id=int(req['tipo_documento'])).values())
                if(len(tipo_documento)>0):
                    tipo_documento = TipoDocumento.objects.get(id=int(req['tipo_documento']))
                else:
                    datos = {
                        'status': False,
                        'message': MESSAGE["errorTipoDocumento"],
                    }
                    return JsonResponse(datos)
                cargo = list(Cargos.objects.filter(id=int(req['cargo'])).values())
                if(len(cargo)>0):
                    cargo = Cargos.objects.get(id=int(req['cargo']))
                else:
                    datos = {
                        'status': False,
                        'message': MESSAGE["errorCargo"],
                    }
                    return JsonResponse(datos)
                persona.nombres=req['nombres'].title()
                persona.apellidos=req['apellidos'].title()
                persona.numero_documento=req['numero_documento']
                persona.telefono_principal=req['telefono_principal']
                persona.telefono_secundario=req['telefono_secundario']
                persona.correo=req['correo']
                persona.tipo_documento=tipo_documento
                usuario.usuario=req['usuario']
                usuario.cargo=cargo
                
                persona.save()
                usuario.save()
                datos = {
                    "status": True, 
                    "message": f"{MESSAGE['edition']}"
                }
            else:
                datos = {
                    "status": False,
                    "message": f"{MESSAGE['errorRegistroNone']}",
                }

            return JsonResponse(datos)
        except IntegrityError as error:
            if error.args[0]==1062:
                if 'telefono_principal' in error.args[1]:
                    message = MESSAGE['telefonoPrincipalDuplicate']
                elif'usuario' in error.args[1]:
                    message = MESSAGE['usuarioDuplicate']
                elif'correo' in error.args[1]:
                    message = MESSAGE['correoDuplicate']
                elif'numero_documento' in error.args[1]:
                    message = MESSAGE['documentoDuplicate']
                else:
                    message = f"{MESSAGE['errorDuplicate']}: {error.args[1]} "
                datos = {
                'status': False,
                'message': message
                }
            else:
                datos = {
                'status': False,
                'message': f"{MESSAGE['errorIntegrity']}: {error}"
                }
            return JsonResponse(datos)
        except models.ProtectedError as error:
            datos = {"status": False, "message": f"{MESSAGE['errorProtect']}"}
            return JsonResponse(datos)
        except Exception as error:
            datos = {"status": False, "message": f"{MESSAGE['errorEdition']}: {error}"}
            return JsonResponse(datos)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                    'data': None
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 2 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            if id:
                query = """
                    SELECT 
                    	us.usuario,
                        pe.nombres, 
                        pe.apellidos, 
                        pe.numero_documento,
                        pe.correo,
                        tipo.id AS tipo_documento_id, 
                        tipo.nombre AS tipo_documento, 
                        us.estado,
                        car.id as cargo_id,
                        car.nombre as cargo,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        IF(pe.telefono_secundario IS NOT NULL AND pe.telefono_secundario != '', CONCAT('0', pe.telefono_secundario), pe.telefono_secundario) AS telefono_secundario,
                        us.fecha_registro,
                        us.fecha_actualizacion
                    FROM usuarios AS us
                    LEFT JOIN personas AS pe ON us.persona_id=pe.id
                    LEFT JOIN tipos_documentos AS tipo ON pe.tipo_documento_id=tipo.id
                    LEFT JOIN cargos AS car ON us.cargo_id=car.id
                    WHERE us.id=%s
                """
                cursor.execute(query, [id])
                usuario = dictfetchall(cursor)
                if len(usuario) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": usuario[0],
                    }
                else:
                    datos = {
                        "status": False,
                        "message": f"{MESSAGE['errorRegistrosNone']}",
                        "data": None,
                    }
            else:
                page = request.GET.get('page', 1)
                inicio = indiceInicial(int(page))
                final = indiceFinal(int(page))
                all = request.GET.get('page', 'false')
                typeOrdenBy = request.GET.get('organizar', 'orig')
                orderType = order(request)

                if(typeOrdenBy=='orig'):
                    typeOrdenBy ='us.id'
                elif(typeOrdenBy=='alf'):
                    typeOrdenBy ='us.usuario'
                else:
                    typeOrdenBy='us.id'

                where = []
                search = request.GET.get('search', None)
                search = determinar_valor(search)
                if(search['valor'] and search['type']=='int'):
                    where.append(f"pe.numero_documento LIKE '{search['valor']}%%'" )
                elif(search['valor'] and search['type']=='str'):
                    str_validate = edit_str(search['valor'])
                    where.append(f"CONCAT(pe.nombres, ' ', pe.apellidos) LIKE '{str_validate}'" )

                cargo = request.GET.get('cargo', None)
                estado = request.GET.get('estado', None)
                
                if(cargo):
                    where.append(f"car.id={cargo}")
                if(estado):
                    where.append(f"us.estado={estado}")
                where = filtrosWhere(where)
                
                limit=""
                if(all =='false'):
                    limit= f"LIMIT {inicio}, {final}"
                query = """
                    SELECT 
                        us.id,
                    	us.usuario,
                        pe.nombres, 
                        pe.apellidos, 
                        us.estado,
                        car.id as cargo_id,
                        car.nombre as cargo
                    FROM usuarios AS us
                    LEFT JOIN personas AS pe ON us.persona_id=pe.id
                    LEFT JOIN cargos AS car ON us.cargo_id=car.id
                    {}
                    ORDER BY {} {} 
                    {};
                """.format(where, typeOrdenBy, orderType, limit)

                cursor.execute(query)
                usuarios = dictfetchall(cursor)
                
                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM usuarios;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)

                if len(usuarios) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": usuarios,
                        "pages": int(result[0]["pages"]),
                        "total": result[0]["total"],
                    }
                else:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['errorRegistrosNone']}",
                        "data": None,
                        "pages": 0,
                        "total": 0,
                    }

            return JsonResponse(datos)
        except Exception as error:
            datos = {
                "status": False,
                "message": f"{MESSAGE['errorConsulta']}: {error}",
                "data": None,
                "pages": 0,
                "total": 0,
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()