from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.encriptado_contraseña import encriptado_constraseña, desencriptado_contraseña
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.token import verify_token
from ..funtions.serializador import dictfetchall
from ..models import Cargos, Permisos, TipoDocumento, Usuarios, Personas
from django.db import IntegrityError, connection
import json


class Usuario_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            jd = json.loads(request.body)
            verify = verify_token(jd["headers"])
            jd = jd["body"]
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)

            # Comprobar si se esta registrando un nuevo recreador con los datos de una persona existente
            if("id_persona" in jd):
                persona = list(Personas.objects.filter(id=jd["id_persona"]).values())
                if(len(persona)>0):
                    persona = Personas.objects.get(id=jd["id_persona"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe id de la persona"
                    }
                    return JsonResponse(datos)
                    
            else:
                tipo_documento = list(TipoDocumento.objects.filter(id=jd["tipo_documento"]).values())
                if(len(tipo_documento)>0):
                    tipo_documento = TipoDocumento.objects.get(id=jd["tipo_documento"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe id del tipo de documento"
                    }
                    return JsonResponse(datos)
                persona = Personas.objects.create(
                    nombres=jd['nombres'].title(), 
                    apellidos=jd['apellidos'].title(), 
                    numero_documento=jd["numero_documento"],
                    telefono_principal=jd["telefono_principal"],
                    telefono_secundario=jd["telefono_secundario"],
                    correo=jd["correo"],
                    tipo_documento=tipo_documento
                )
            contraseña=encriptado_constraseña(jd["contraseña"])
            cargo = list(Cargos.objects.filter(id=jd["cargo"]).values())
            if(len(cargo)>0):
                cargo = Cargos.objects.get(id=jd["cargo"])
            else:
                datos = {
                    "status": False,
                    'message': "Error. Compruebe id del cargo"
                }
                return JsonResponse(datos)
            Usuarios.objects.create(
                persona=persona,
                usuario=jd["usuario"],
                contraseña=contraseña,
                cargo=cargo
            )
            datos = {
                "status": True,
                'message': "Registro Completado"
            }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Compruebe Datos"
            }
            return JsonResponse(datos)
    
    def put(self, request, id):
        try:
            jd = json.loads(request.body)
            usuario = list(Usuarios.objects.filter(id=id).values())
            if len(usuario) > 0:
                usuario = Usuarios.objects.get(id=id)
                persona = Permisos.objects.get(id=usuario.persona)
                tipo_documento = list(TipoDocumento.objects.filter(id=jd["tipo_documento"]).values())
                if(len(tipo_documento)>0):
                    tipo_documento = TipoDocumento.objects.get(id=jd["tipo_documento"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe id del tipo de documento"
                    }
                    return JsonResponse(datos)
                cargo = list(Cargos.objects.filter(id=jd["cargo"]).values())
                if(len(cargo)>0):
                    cargo = Cargos.objects.get(id=jd["cargo"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe id del cargo"
                    }
                    return JsonResponse(datos)
                persona.nombres=jd['nombres'].title()
                persona.apellidos=jd['apellidos'].title(),
                persona.numero_documento=jd["numero_documento"]
                persona.telefono_principal=jd["telefono_principal"]
                persona.telefono_secundario=jd["telefono_secundario"]
                persona.correo=jd["correo"]
                persona.tipo_documento=tipo_documento
                usuario.usuario=jd["usuario"]
                usuario.cargo=cargo
                persona.save()
                usuario.save()
                datos = {
                    "status": True,
                    'message': "Exito. Registro editado"
                }
            else:
                datos = {
                    "status": False,
                    'message': "Error. Registro no encontrado"
                }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
            }
            return JsonResponse(datos)
