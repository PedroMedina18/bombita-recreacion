from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..models import Clientes, Personas, TipoDocumento
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.identificador import determinar_valor, edit_str, normalize_id_list
from ..funtions.token import verify_token
from ..funtions.filtros import order, filtrosWhere
from ..message import MESSAGE
import json


class Clientes_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def delete(self, request, id):
        try:
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"]}
                return JsonResponse(datos)
            cliente = list(Clientes.objects.filter(id=int(id)).values())
            if len(cliente) > 0:
                Clientes.objects.filter(id=int(id)).delete()
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

    def put(self, request, id):
        try:
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"]}
                return JsonResponse(datos)
            cliente = list(Clientes.objects.filter(id=int(id)).values())
            if len(cliente) > 0:
                cliente = Clientes.objects.get(id=int(id))
                persona = Personas.objects.get(id=int(cliente.persona.id))

                ### *comprobacion de tipo de documento
                tipo_documento = list(
                    TipoDocumento.objects.filter(id=int(req["tipo_documento"])).values()
                )
                if len(tipo_documento) > 0:
                    tipo_documento = TipoDocumento.objects.get(id=int(req["tipo_documento"]))
                else:
                    datos = {
                        "status": False,
                        "message": MESSAGE["errorTipoDocumento"],
                    }
                    return JsonResponse(datos)
                persona.nombres = req["nombres"].title()
                persona.apellidos = req["apellidos"].title()
                persona.numero_documento = req["numero_documento"]
                persona.telefono_principal = req["telefono_principal"]
                persona.telefono_secundario = req["telefono_secundario"]
                persona.correo = req["correo"]
                persona.tipo_documento = tipo_documento
                persona.save()
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
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if 'telefono_principal' in error.args[1]:
                    message = MESSAGE['telefonoPrincipalDuplicate']
                if 'numero_documento' in error.args[1]:
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
            print(f"{MESSAGE['errorProteccion']}  - {str(error)}")
            datos = {"status": False, "message": f"{MESSAGE['errorProtect']}"}
            return JsonResponse(datos)
        except Exception as error:
            print(
                f"{MESSAGE['errorDelete']} - {error}",
            )
            datos = {"status": False, "message": f"{MESSAGE['errorEliminar']}: {error}"}
            return JsonResponse(datos)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            totalClientes = request.GET.get("total", "false")
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"], "data": None}
                return JsonResponse(datos)

            if(totalClientes =="true"):
                query="""
                    SELECT COUNT(*) AS total FROM clientes
                """
                cursor.execute(query)
                total = dictfetchall(cursor)
                datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": total[0],
                    }
                return JsonResponse(datos)

            if id:
                query = """
                    SELECT 
                    	cli.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        pe.correo,
                        tipo.id AS tipo_documento_id, 
                        tipo.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        CONCAT('0', pe.telefono_secundario) AS telefono_secundario,
                        cli.fecha_registro
                    FROM clientes AS cli
                    LEFT JOIN personas AS pe ON cli.persona_id=pe.id
                    LEFT JOIN tipos_documentos AS tipo ON pe.tipo_documento_id=tipo.id
                    WHERE cli.id=%s;
                """
                cursor.execute(query, [id])
                cliente = dictfetchall(cursor)
                if len(cliente) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": cliente[0],
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
                typeOrdenBy = request.GET.get('organizar', "orig")
                orderType = order(request)

                if(typeOrdenBy=="orig"):
                    typeOrdenBy ="cli.id"
                elif(typeOrdenBy=="alf"):
                    typeOrdenBy ="pe.nombres"
                else:
                    typeOrdenBy="cli.id"

                where = []
                search = request.GET.get('search', None)
                search = determinar_valor(search)
                if(search['valor'] and search['type']=="int"):
                    where.append(f"pe.numero_documento LIKE '{search['valor']}%%'" )
                elif(search['valor'] and search['type']=="str"):
                    str_validate = edit_str(search["valor"])
                    where.append(f"CONCAT(pe.nombres, ' ', pe.apellidos) LIKE '{str_validate}'" )
                where = filtrosWhere(where)
                
                query="""
                    SELECT 
                        cli.id, 
                        pe.nombres, 
                        pe.apellidos, 
                        pe.correo,
                        tipo.id AS tipo_documento_id, 
                        tipo.nombre AS tipo_documento, 
                        pe.numero_documento,
                        CONCAT('0', pe.telefono_principal) AS telefono_principal,
                        CONCAT('0', pe.telefono_secundario) AS telefono_secundario,
                        cli.fecha_registro
                    FROM clientes AS cli
                    LEFT JOIN personas AS pe ON cli.persona_id=pe.id
                    LEFT JOIN tipos_documentos AS tipo ON pe.tipo_documento_id=tipo.id
                    {}
                    ORDER BY {} {} 
                    LIMIT %s, %s;
                """.format(where, typeOrdenBy, orderType)
                
                cursor.execute(query, [inicio, final])
                clientes = dictfetchall(cursor)

                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM clientes;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)

                if len(clientes) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": clientes,
                        "pages": int(result[0]["pages"]),
                        "total": result[0]["total"],
                    }
                else:
                    datos = {
                        "status": True,
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
