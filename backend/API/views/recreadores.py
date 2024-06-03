from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.identificador import determinar_valor, edit_str
from ..models import Nivel, Recreadores, Personas, TipoDocumento, Generos
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
import json


class Recreadores_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            req = request.POST
            img=request.FILES
            verify = verify_token(request.headers)
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)

            #* se debe comprobar si se va a registrar una persona nueva o ya existe

            if ("id_persona" in req):
                ### *comprobacion de persona
                persona = list(Personas.objects.filter(
                    id=req["id_persona"]).values())
                if (len(persona) > 0):
                    persona = Personas.objects.get(id=req["id_persona"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe datos de registro"
                    }
                    return JsonResponse(datos)
            else:
                ### *comprobacion de tipo de documento
                tipo_documento = list(TipoDocumento.objects.filter(
                    id=req["tipo_documento"]).values())
                if (len(tipo_documento) > 0):
                    tipo_documento = TipoDocumento.objects.get(
                        id=req["tipo_documento"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe el tipo de documento"
                    }
                    return JsonResponse(datos)

                ### *Registro de datos de nueva persona
                persona = Personas.objects.create(
                    nombres=req['nombres'].title(),
                    apellidos=req['apellidos'].title(),
                    numero_documento=req["numero_documento"],
                    telefono_principal=req["telefono_principal"],
                    telefono_secundario=req["telefono_secundario"],
                    correo=req["correo"],
                    tipo_documento=tipo_documento
                )

            ### *comprobacion de nivel
            nivel = list(Nivel.objects.filter(id=req["nivel"]).values())
            if (len(nivel) > 0):
                nivel = Nivel.objects.get(id=req["nivel"])
            else:
                datos = {
                    "status": False,
                    'message': "Error. Compruebe el nivel"
                }
                return JsonResponse(datos)
            
            ### *comprobacion de nivel
            genero = list(Generos.objects.filter(id=req["genero"]).values())
            if (len(genero) > 0):
                genero = Generos.objects.get(id=req["genero"])
            else:
                datos = {
                    "status": False,
                    'message': "Error. Compruebe el genero"
                }
                return JsonResponse(datos)

            ### *Registro de Recreador
            Recreadores.objects.create(
                persona=persona,
                nivel=nivel,
                genero=genero,
                img_perfil=img["img_recreador"],
                fecha_nacimiento=req["fecha_nacimiento"],
            )
            datos = {
                "status": True,
                'message': "Registro de recreador completado"
            }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error consulta post - {error}", )
            datos = {
                "status": False,
                'message': f"Error al registrar: {error}"
            }
            return JsonResponse(datos)

    def put(self, request, id):
        try:
            verify = verify_token(request.headers)
            req = request.POST
            img = request.FILES
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)

            recreador = list(Recreadores.objects.filter(id=id).values())
            if len(recreador) > 0:
                recreador = Recreadores.objects.get(id=id)
                persona = Personas.objects.get(id=recreador.persona)
                
                ### *comprobacion de tipo de documento
                tipo_documento = list(TipoDocumento.objects.filter(id=req["tipo_documento"]).values())
                if (len(tipo_documento) > 0):
                    tipo_documento = TipoDocumento.objects.get(id=req["tipo_documento"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe el tipo de documento"
                    }
                    return JsonResponse(datos)

                ### *comprobacion de nivel
                nivel = list(Nivel.objects.filter(id=req["nivel"]).values())
                if (len(nivel) > 0):
                    nivel = Nivel.objects.get(id=req["nivel"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe el nivel"
                    }
                    return JsonResponse(datos)

                ### *comprobacion de genero
                genero = list(Generos.objects.filter(id=req["genero"]).values())
                if (len(genero) > 0):
                    genero = Generos.objects.get(id=req["genero"])
                else:
                    datos = {
                        "status": False,
                        'message': "Error. Compruebe el genero"
                    }
                    return JsonResponse(datos)

                persona.nombres= req['nombres'].title()
                persona.apellidos= req['apellidos'].title()
                persona.numero_documento= req['numero_documento']
                persona.telefono_principal=req["telefono_principal"],
                persona.telefono_secundario=req["telefono_secundario"],
                persona.correo=req["correo"],
                persona.tipo_documento=tipo_documento
                recreador.nivel=nivel,
                recreador.genero=genero,
                recreador.fecha_nacimiento=req["fecha_nacimiento"],
                if "img_recreador" in img:
                    recreador.img_perfil=img["img_recreador"],
                persona.save()
                recreador.save()
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
        except Exception as error:
            print(f"Error de consulta put - {error}")
            datos = {
                "status": False,
                'message': f"Error al editar: {error}",
            }
            return JsonResponse(datos)

    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"]
                }
                return JsonResponse(datos)
            recreador = list(Recreadores.objects.filter(id=id).values())
            if len(recreador) > 0:
                Recreadores.objects.filter(id=id).delete()
                datos = {
                    "status": True,
                    'message': "Registro eliminado"
                }
            else:
                datos = datos = {
                    "status": False,
                    'message': "Registro no encontrado"
                }
            return JsonResponse(datos)
        except models.ProtectedError as error:
            print(f"Error de proteccion  - {str(error)}")
            datos = {
                "status": False,
                'message': "Error. Item protejido no se puede eliminar"
            }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error consulta delete - {error}", )
            datos = {
                "status": False,
                'message': f"Error al eliminar: {error}"
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
