from django.shortcuts import render
from django.http import Http404
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..models import Nivel, Recreadores, Personas, TipoDocumento, Generos
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.identificador import determinar_valor, edit_str
from ..funtions.token import verify_token
from ..funtions.filtros import order, filtrosWhere, typeOrder
from ..message import MESSAGE
from decouple import config
import json


class Recreadores_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, identificador=0):
        try:
            req = request.POST
            img = request.FILES
            method = request.GET.get("_method", "POST")
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {
                    "status": False,
                    "message": verify["message"],
                }
                return JsonResponse(datos)

            if method == "PUT":

                tipo = determinar_valor(identificador)
                if tipo["type"] != "int":
                    raise Http404("No se puede editar este objeto")
                recreador = list(
                    Recreadores.objects.filter(id=int(identificador)).values()
                )
                if len(recreador) > 0:
                    recreador = Recreadores.objects.get(id=int(identificador))
                    persona = Personas.objects.get(id=int(recreador.persona.id))

                    ### *comprobacion de tipo de documento
                    tipo_documento = list(
                        TipoDocumento.objects.filter(
                            id=int(req["tipo_documento"])
                        ).values()
                    )
                    if len(tipo_documento) > 0:
                        tipo_documento = TipoDocumento.objects.get(
                            id=int(req["tipo_documento"])
                        )
                    else:
                        datos = {
                            "status": False,
                            "message": MESSAGE["errorTipoDocumento"],
                        }
                        return JsonResponse(datos)

                    ### *comprobacion de nivel
                    nivel = list(Nivel.objects.filter(id=int(req["nivel"])).values())
                    if len(nivel) > 0:
                        nivel = Nivel.objects.get(id=int(req["nivel"]))
                    else:
                        datos = {"status": False, "message": MESSAGE["errorNivel"]}
                        return JsonResponse(datos)

                    ### *comprobacion de genero
                    genero = list(
                        Generos.objects.filter(id=int(req["genero"])).values()
                    )
                    if len(genero) > 0:
                        genero = Generos.objects.get(id=int(req["genero"]))
                    else:
                        datos = {"status": False, "message": MESSAGE["errorGenero"]}
                        return JsonResponse(datos)
                    persona.nombres = req["nombres"].title()
                    persona.apellidos = req["apellidos"].title()
                    persona.numero_documento = req["numero_documento"]
                    persona.telefono_principal = req["telefono_principal"]
                    persona.telefono_secundario = req["telefono_secundario"]
                    persona.correo = req["correo"]
                    persona.tipo_documento = tipo_documento
                    recreador.nivel = nivel
                    recreador.genero = genero
                    recreador.fecha_nacimiento = req["fecha_nacimiento"]
                    if "img_recreador" in img:
                        recreador.img = img["img_recreador"]
                    persona.save()
                    recreador.save()
                    datos = {"status": True, "message": f"{MESSAGE['edition']}"}
                else:
                    datos = {
                        "status": False,
                        "message": f"{MESSAGE['errorRegistroNone']}",
                    }
            else:
                # * se debe comprobar si se va a registrar una persona nueva o ya existe
                if "id_persona" in req:
                    ### *comprobacion de persona
                    persona = list(
                        Personas.objects.filter(id=req["id_persona"]).values()
                    )
                    if len(persona) > 0:
                        persona = Personas.objects.get(id=req["id_persona"])
                    else:
                        datos = {
                            "status": False,
                            "message": MESSAGE["errorRegistroPersona"],
                        }
                        return JsonResponse(datos)
                else:
                    ### *comprobacion de tipo de documento
                    tipo_documento = list(
                        TipoDocumento.objects.filter(id=req["tipo_documento"]).values()
                    )
                    if len(tipo_documento) > 0:
                        tipo_documento = TipoDocumento.objects.get(
                            id=req["tipo_documento"]
                        )
                    else:
                        datos = {
                            "status": False,
                            "message": MESSAGE["errorTipoDocumento"],
                        }
                        return JsonResponse(datos)

                    ### *Registro de datos de nueva persona
                    persona = Personas.objects.create(
                        nombres=req["nombres"].title(),
                        apellidos=req["apellidos"].title(),
                        numero_documento=req["numero_documento"],
                        telefono_principal=req["telefono_principal"],
                        telefono_secundario=req["telefono_secundario"],
                        correo=req["correo"],
                        tipo_documento=tipo_documento,
                    )

                ### *comprobacion de nivel
                nivel = list(Nivel.objects.filter(id=req["nivel"]).values())
                if len(nivel) > 0:
                    nivel = Nivel.objects.get(id=req["nivel"])
                else:
                    datos = {"status": False, "message": MESSAGE["errorNivel"]}
                    return JsonResponse(datos)

                ### *comprobacion de genero
                genero = list(Generos.objects.filter(id=req["genero"]).values())
                if len(genero) > 0:
                    genero = Generos.objects.get(id=req["genero"])
                else:
                    datos = {"status": False, "message": MESSAGE["errorGenero"]}
                    return JsonResponse(datos)

                ### *Registro de Recreador
                Recreadores.objects.create(
                    persona=persona,
                    nivel=nivel,
                    genero=genero,
                    img=img["img_perfil"] if "img_perfil" in img else None,
                    fecha_nacimiento=req["fecha_nacimiento"],
                )
                datos = {"status": True, "message": f"{MESSAGE['registerRecreador']}"}
            return JsonResponse(datos)

        except IntegrityError as error:
            print(
                f"{MESSAGE['errorIntegrity']} - {error}",
            )
            if error.args[0] == 1062:
                if "telefono_principal" in error.args[1]:
                    message = MESSAGE["telefonoPrincipalDuplicate"]
                elif "correo" in error.args[1]:
                    message = MESSAGE["correoDuplicate"]
                elif "numero_documento" in error.args[1]:
                    message = MESSAGE["documentoDuplicate"]
                else:
                    message = f"{MESSAGE['errorDuplicate']}: {error.args[1]} "
                datos = {"status": False, "message": message}
            else:
                datos = {
                    "status": False,
                    "message": f"{MESSAGE['errorIntegrity']}: {error}",
                }
            return JsonResponse(datos)
        except Exception as error:
            if method == "PUT":
                print(f"{MESSAGE['errorPut']} - {error}")
                datos = {
                    "status": False,
                    "message": f"{MESSAGE['errorEdition']}: {error}",
                }
            else:
                print(
                    f"{MESSAGE['errorPost']} - {error}",
                )
                datos = {
                    "status": False,
                    "message": f"{MESSAGE['errorRegistro']}: {error}",
                }
            return JsonResponse(datos)

    def delete(self, request, identificador=0):
        try:
            tipo = determinar_valor(identificador)
            if tipo["type"] != "int":
                raise Http404("No se puede eliminar este objeto")
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"]}
                return JsonResponse(datos)
            recreador = list(Recreadores.objects.filter(id=int(identificador)).values())
            if len(recreador) > 0:
                Recreadores.objects.filter(id=int(identificador)).delete()
                datos = {"status": True, "message": f"{MESSAGE['delete']}"}
            else:
                datos = datos = {
                    "status": False,
                    "message": f"{MESSAGE['errorRegistroNone']}",
                }
            return JsonResponse(datos)
        except models.ProtectedError as error:
            print(f"{MESSAGE['errorProteccion']}  - {str(error)}")
            datos = {"status": False, "message": f"{MESSAGE['errorProtect']}"}
            return JsonResponse(datos)
        except Exception as error:
            print(
                f"{MESSAGE['errorDelete']} - {error}",
            )
            datos = {"status": False, "message": f"{MESSAGE['errorEliminar']}: {error}"}
            return JsonResponse(datos)

    def get(self, request, identificador=None):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            info = request.GET.get("_info", "false")
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"], "data": None}
                return JsonResponse(datos)

            if identificador:
                tipo = determinar_valor(identificador)
                query = """
                    SELECT 
                    	re.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        pe.correo,
                        ge.id AS genero_id,
                        ge.nombre AS genero,
                        re.fecha_nacimiento, 
                        ni.id AS nivel_id, 
                        ni.nombre AS nivel, 
                        tipo.id AS tipo_documento_id, 
                        tipo.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        CONCAT('0', pe.telefono_secundario) AS telefono_secundario,
                        re.inhabilitado,
                        re.img
                    FROM recreadores AS re
                    LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                    LEFT JOIN generos AS ge ON re.genero_id=ge.id
                    LEFT JOIN personas AS pe ON re.persona_id=pe.id
                    LEFT JOIN tipos_documentos AS tipo ON pe.tipo_documento_id=tipo.id
                """
                if tipo["type"] == "int":
                    if info == "true":
                        query = query + "WHERE re.id=%s;"
                        cursor.execute(query, [tipo["valor"]])
                    else:
                        numero_documento = str(tipo["valor"]) + "%"
                        query = query + "WHERE pe.numero_documento LIKE %s ;"
                        cursor.execute(query, [numero_documento])
                else:
                    str_validate = edit_str(tipo["valor"])
                    query = (
                        query + "WHERE CONCAT(pe.nombres, ' ', pe.apellidos) LIKE %s ;"
                    )
                    cursor.execute(query, [str_validate])
                recreador = dictfetchall(cursor)
                if len(recreador) > 0:
                    for data in recreador:
                        data["img"] = (
                            f"{config('URL')}media/{data['img']}"
                            if data["img"]
                            else None
                        )
                    if info == "true":
                        datos = {
                            "status": True,
                            "message": f"{MESSAGE['exitoGet']}",
                            "data": {"info": recreador[0]},
                        }
                    else:
                        datos = {
                            "status": True,
                            "message": f"{MESSAGE['exitoGet']}",
                            "data": recreador,
                            "total": len(recreador),
                            "pages": 1,
                        }
                else:
                    datos = {
                        "status": False,
                        "message": f"{MESSAGE['errorRegistrosNone']}",
                        "data": None,
                        "total": 0,
                        "pages": 0,
                    }

            else:
                page = request.GET.get('page', 1)
                inicio = indiceInicial(int(page))
                final = indiceFinal(int(page))

                orderType = order(request)
                typeOrdenBy = "pe.nombres" if typeOrder(request) else "re.id"

                where = []
                nivel = request.GET.get('nivel', None)
                genero = request.GET.get('genero', None)
                estado = request.GET.get('estado', None)

                if(nivel):
                    where.append(f"ni.id={nivel}")
                if(genero):
                    where.append(f"ge.id={genero}")
                if(estado):
                    where.append(f"re.inhabilitado={estado}")
                where = filtrosWhere(where)

                query = """
                    SELECT 
                    	re.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        pe.correo,
                        ge.id AS genero_id,
                        ge.nombre AS genero,
                        re.fecha_nacimiento, 
                        ni.id AS nivel_id, 
                        ni.nombre AS nivel, 
                        tipo.id AS tipo_documento_id, 
                        tipo.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        CONCAT('0', pe.telefono_secundario) AS telefono_secundario,
                        re.inhabilitado
                    FROM recreadores AS re
                    LEFT JOIN niveles AS ni ON re.nivel_id=ni.id
                    LEFT JOIN generos AS ge ON re.genero_id=ge.id
                    LEFT JOIN personas AS pe ON re.persona_id=pe.id
                    LEFT JOIN tipos_documentos AS tipo ON pe.tipo_documento_id=tipo.id
                    {}
                    ORDER BY {} {} 
                    LIMIT %s, %s;
                """.format(where, typeOrdenBy, orderType)

                cursor.execute(query, [inicio, final])
                recreadores = dictfetchall(cursor)
                
                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM recreadores;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)

                if len(recreadores) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": recreadores,
                        "pages": int(result[0]["pages"]),
                        "total": result[0]["total"],
                    }
                else:
                    datos = {
                        "status": False,
                        "message": f"{MESSAGE['errorRegistrosNone']}",
                        "data": None,
                        "pages": None,
                        "total": 0,
                    }

            return JsonResponse(datos)
        except Exception as error:
            print(f"{MESSAGE['errorGet']} - {error}")
            datos = {
                "status": False,
                "message": f"{MESSAGE['errorConsulta']}: {error}",
                "data": None,
                "pages": None,
                "total": 0,
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
