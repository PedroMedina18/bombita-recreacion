from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Nivel, Recreadores, Personas, TipoDocumento
from django.db import IntegrityError, connection
from ..funtions.token import verify_token
import json


class Recreadores_Views(View):
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
            nivel = list(Nivel.objects.filter(id=jd["nivel"]).values())
            if(len(nivel)>0):
                nivel = Nivel.objects.get(id=jd["nivel"])
            else:
                datos = {
                    "status": False,
                    'message': "Error. Compruebe id del nivel"
                }
                return JsonResponse(datos)
            Recreadores.objects.create(
                persona=persona,
                nivel=nivel,
                fecha_nacimiento=jd["fecha_nacimiento"],
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
