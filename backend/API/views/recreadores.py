from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.identificador import determinar_valor, edit_str
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
            if ("id_persona" in jd):
                persona = list(Personas.objects.filter(
                    id=jd["id_persona"]).values())
                if (len(persona) > 0):
                    persona = Personas.objects.get(id=jd["id_persona"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe id de la persona"
                    }
                    return JsonResponse(datos)
            else:
                tipo_documento = list(TipoDocumento.objects.filter(
                    id=jd["tipo_documento"]).values())
                if (len(tipo_documento) > 0):
                    tipo_documento = TipoDocumento.objects.get(
                        id=jd["tipo_documento"])
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
            if (len(nivel) > 0):
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

    def get(self, request, identificador=None):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                    "data": None
                }
                return JsonResponse(datos)

            if identificador:
                tipo = determinar_valor(identificador)
                if (tipo["type"] == "int"):
                    numero_documento = str(tipo["valor"]) + "%"
                    query = """
                        SELECT 
                        	re.id, 
                            pe.nombres, 
                            pe.apellidos, 
                            re.fecha_nacimiento, 
                            ni.nombre AS nivel, 
                            tido.nombre AS tipo_documento, 
                            pe.numero_documento,
                            CONCAT('0', pe.telefono_principal) AS telefono_principal,
                            re.inhabilitado
                        FROM recreadores AS re
                        LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                        LEFT JOIN personas AS pe ON re.persona_id=pe.id
                        LEFT JOIN tipo_documentos AS tido ON pe.tipo_documento_id=tido.id
                        WHERE pe.numero_documento LIKE %s ;
                    """
                    cursor.execute(query, [numero_documento])
                    recreador = dictfetchall(cursor)
                    
                else:
                    str_validate=edit_str(tipo["valor"])
                    query="""
                        SELECT 
                        	re.id, 
                            pe.nombres, 
                            pe.apellidos, 
                            re.fecha_nacimiento, 
                            ni.nombre AS nivel, 
                            tido.nombre AS tipo_documento, 
                            pe.numero_documento,
                            CONCAT('0', pe.telefono_principal) AS telefono_principal,
                            re.inhabilitado
                        FROM recreadores AS re
                        LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                        LEFT JOIN personas AS pe ON re.persona_id=pe.id
                        LEFT JOIN tipo_documentos AS tido ON pe.tipo_documento_id=tido.id
                        WHERE CONCAT(pe.nombres, ' ', pe.apellidos) LIKE %s ;
                    """
                    cursor.execute(query, [str_validate])
                    recreador = dictfetchall(cursor)
                query = """
                SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM recreadores;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(recreador) > 0:
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": recreador,
                        "total": result[0]["total"],
                        "pages":1
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Error. No se encontraron registros",
                        "data": None,
                        "total": 0,
                        "pages":0
                    }
            else:
                if ("page" in request.GET):
                    query = """
                    SELECT 
                    	re.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        re.fecha_nacimiento, 
                        ni.nombre AS nivel, 
                        tido.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        re.inhabilitado
                    FROM recreadores AS re
                    LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                    LEFT JOIN personas AS pe ON re.persona_id=pe.id
                    LEFT JOIN tipo_documentos AS tido ON pe.tipo_documento_id=tido.id
                    ORDER BY re.id ASC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    recreadores = dictfetchall(cursor)

                elif ("page" in request.GET and "desc" in request.GET and request.GET["desc"] == "true"):
                    query = """
                    SELECT 
                    	re.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        re.fecha_nacimiento, 
                        ni.nombre AS nivel, 
                        tido.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        re.inhabilitado
                    FROM recreadores AS re
                    LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                    LEFT JOIN personas AS pe ON re.persona_id=pe.id
                    LEFT JOIN tipo_documentos AS tido ON pe.tipo_documento_id=tido.id
                    ORDER BY re.id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    recreadores = dictfetchall(cursor)

                else:
                    query = """
                    SELECT 
                    	re.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        re.fecha_nacimiento, 
                        ni.nombre AS nivel, 
                        tido.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        re.inhabilitado
                    FROM recreadores AS re
                    LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                    LEFT JOIN personas AS pe ON re.persona_id=pe.id
                    LEFT JOIN tipo_documentos AS tido ON pe.tipo_documento_id=tido.id
                    ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    recreadores = dictfetchall(cursor)
                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM recreadores;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)

                if len(recreadores) > 0:
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": recreadores,
                        "pages": int(result[0]["pages"]),
                        "total": result[0]["total"],
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Error. No se encontraron registros",
                        "data": None,
                        "pages": None,
                        "total": 0
                    }

            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Compruebe Datos"
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
