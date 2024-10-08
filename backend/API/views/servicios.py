from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..models import (
    Servicios,
    ServiciosActividades,
    Materiales,
    ServiciosMateriales,
    Actividades,
)
from ..utils.token import verify_token
from ..utils.time import duration
from ..utils.identificador import determinar_valor, edit_str
from ..message import MESSAGE
from ..utils.editorOpciones import editorOpciones
from ..utils.filtros import order, filtrosWhere
import datetime
import json


class Servicios_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post( self, request,):
        try:
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            if not verify["status"]:
                datos = {
                    "status": False,
                    "message": verify["message"],
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            duracion = datetime.timedelta(
                hours=req["duracion"]["horas"], minutes=req["duracion"]["minutos"]
            )
            servicio = Servicios.objects.create(
                nombre=req["nombre"],
                precio=req["precio"],
                numero_recreadores=req["numero_recreadores"],
                descripcion=req["descripcion"],
                duracion=duracion,
            )

            actividades = req["actividades"]
            for actividad in actividades:
                newAtividades = Actividades.objects.get(id=int(actividad))
                ServiciosActividades.objects.create(
                    actividad=newAtividades, servicio=servicio
                )

            materiales = req["materiales"]
            for material in materiales:
                newMteriales = Materiales.objects.get(id=int(material["material"]))
                ServiciosMateriales.objects.create(
                    material=newMteriales,
                    servicio=servicio,
                    cantidad=int(material["cantidad"]),
                )

            datos = {"status": True, "message": f"{MESSAGE['registerServicio']}"}
            return JsonResponse(datos)
        except IntegrityError as error:
            print(
                f"{MESSAGE['errorIntegrity']} - {error}",
            )
            if error.args[0] == 1062:
                if "nombre" in error.args[1]:
                    message = MESSAGE["nombreDuplicate"]
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
            print(
                f"{MESSAGE['errorPost']} - {error}",
            )
            datos = {"status": False, "message": f"{MESSAGE['errorRegistro']}: {error}"}
            return JsonResponse(datos)

    def put(self, request, id):
        try:
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            if not verify["status"]:
                datos = {
                    "status": False,
                    "message": verify["message"],
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            duracion = datetime.timedelta(
                hours=req["duracion"]["horas"], minutes=req["duracion"]["minutos"]
            )
            servicio = list(Servicios.objects.filter(id=id).values())
            cursor = connection.cursor()
            if len(servicio) > 0:
                servicio = Servicios.objects.get(id=id)
                servicio.nombre = req["nombre"]
                servicio.descripcion = req["descripcion"]
                servicio.precio = req["precio"]
                servicio.duracion = duracion
                servicio.numero_recreadores = req["numero_recreadores"]
                servicio.save()

                # ------------------------------------------------

                actividades = req["actividades"]
                query = """
                    SELECT ac.id FROM
                        actividades AS ac
                    INNER JOIN 
                        servicios_actividades
                    ON 
                        ac.id = servicios_actividades.actividad_id
                    WHERE 
                        servicios_actividades.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                listActidades = dictfetchall(cursor)
                editorOpciones(
                    registros=listActidades,
                    id=id,
                    list_new_registros=actividades,
                    tablaIntermedia=ServiciosActividades,
                    itemGet=servicio,
                    tablaAgregar=Actividades,
                    filtro_principal="servicio",
                    filtro_secundario="actividad",
                    campo_principal="servicio",
                    campo_secundario="actividad",
                )

                # ------------------------------------------------

                materiales = req["materiales"]
                query = """
                    SELECT 
                        serma.material_id AS id, 
                        serma.cantidad 
                    FROM
                        servicios_materiales AS serma
                    WHERE 
                        serma.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                listMateriales = dictfetchall(cursor)
                material_items = [
                    {"material": item["id"], "cantidad": item["cantidad"]}
                    for item in listMateriales
                ]
                editar = [
                    objetMaterial
                    for objetMaterial in materiales
                    if objetMaterial in material_items
                ]
                for item in editar:
                    material = ServiciosMateriales.objects.get(
                        servicio=int(id), material=item["material"]
                    )
                    material.cantidad = item["cantidad"]
                    material.save()
                eliminar = [
                    objetMaterial
                    for objetMaterial in material_items
                    if objetMaterial not in materiales
                ]
                for item in eliminar:
                    ServiciosMateriales.objects.filter(
                        servicio=int(id), material=item["material"]
                    ).delete()
                agregar = [
                    objetMaterial
                    for objetMaterial in materiales
                    if objetMaterial not in material_items
                ]
                for item in agregar:
                    newMaterial = Materiales.objects.get(id=int(item["material"]))
                    ServiciosMateriales.objects.create(
                        servicio=servicio,
                        material=newMaterial,
                        cantidad=int(item["cantidad"]),
                    )

                datos = {"status": True, "message": f"{MESSAGE['edition']}"}
            else:
                datos = {"status": False, "message": f"{MESSAGE['errorRegistroNone']}"}

            return JsonResponse(datos)
        except IntegrityError as error:
            print(
                f"{MESSAGE['errorIntegrity']} - {error}",
            )
            if error.args[0] == 1062:
                if "nombre" in error.args[1]:
                    message = MESSAGE["nombreDuplicate"]
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
            print(f"{MESSAGE['errorPut']} - {error}")
            datos = {
                "status": False,
                "message": f"{MESSAGE['errorEdition']}: {error}",
            }
            return JsonResponse(datos)

    def delete(self, request, id):
        try:
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"]}
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            servicio = list(Servicios.objects.filter(id=id).values())
            if len(servicio) > 0:
                Servicios.objects.filter(id=id).delete()
                datos = {"status": True, "message": f"{MESSAGE['delete']}"}
            else:
                datos = {"status": False, "message": f"{MESSAGE['errorRegistroNone']}"}
            return JsonResponse(datos)
        except models.ProtectedError as error:
            print(f"{MESSAGE['errorProteccion']} - {str(error)}")
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
            totalServicios = request.GET.get("total", "false")
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"], "data": None}
                return JsonResponse(datos)

            if totalServicios == "true":
                query = """
                    SELECT COUNT(*) AS total FROM servicios
                """
                cursor.execute(query)
                total = dictfetchall(cursor)
                datos = {
                    "status": True,
                    "message": f"{MESSAGE['exitoGet']}",
                    "data": total[0],
                }
                return JsonResponse(datos)

            if int(id) > 0:
                if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                    datos = {
                        'status': False,
                        'message': MESSAGE['NonePermisos'],
                    }
                    return JsonResponse(datos)
                query = """
                    SELECT * FROM servicios WHERE servicios.id=%s;
                """
                cursor.execute(query, [int(id)])
                servicio = dictfetchall(cursor)

                query = """
                    SELECT 
                        ac.id,
                        ac.nombre
                    FROM
                        actividades AS ac
                    INNER JOIN 
                        servicios_actividades
                    ON 
                        ac.id = servicios_actividades.actividad_id
                    WHERE 
                        servicios_actividades.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                actividades = dictfetchall(cursor)
                query = """
                    SELECT 
                        serma.material_id AS id, 
                        serma.cantidad,
                        ma.nombre AS nombre
                    FROM
                        servicios_materiales AS serma
                    INNER JOIN 
                        materiales AS ma
                    ON 
                        serma.material_id = ma.id
                    WHERE 
                        serma.servicio_id = %s;
                """
                cursor.execute(query, [int(id)])
                materiales = dictfetchall(cursor)

                servicio[0]["actividades"] = actividades
                servicio[0]["materiales"] = materiales
                servicio[0]["duracion"] = duration(servicio[0]["duracion"])
                if len(servicio) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": servicio[0],
                    }
                else:
                    datos = {
                        "status": False,
                        "message": f"{MESSAGE['errorRegistroNone']}",
                        "data": None,
                    }
            else:
                page = request.GET.get("page", 1)
                inicio = indiceInicial(int(page))
                final = indiceFinal(int(page))
                all = request.GET.get("all", False)
                orderType = order(request)
                typeOrdenBy = request.GET.get("organizar", "orig")

                if typeOrdenBy == "orig":
                    typeOrdenBy = "id"
                elif typeOrdenBy == "alf":
                    typeOrdenBy = "nombre"
                else:
                    typeOrdenBy = "id"

                where = []
                search = request.GET.get("search", None)
                search = determinar_valor(search)
                if search["valor"] and search["type"] == "int":
                    where.append(f"id LIKE '{search['valor']}%%'")
                elif(search['valor'] and search['type']=="str"):
                    str_validate = edit_str(search["valor"])
                    where.append(f"nombre LIKE '{str_validate}'" )
                where = filtrosWhere(where)

                if all == "true":
                    query = "SELECT id, nombre, precio FROM servicios ORDER BY {} {};".format(
                        typeOrdenBy, orderType
                    )
                    cursor.execute(query)
                    servicios = dictfetchall(cursor)
                else:
                    query = "SELECT * FROM servicios {} ORDER BY {} {} LIMIT %s, %s;".format(
                        where, typeOrdenBy, orderType
                    )
                    cursor.execute(query, [inicio, final])
                    servicios = dictfetchall(cursor)
                    for servicio in servicios:
                        servicio["duracion"] = duration(servicio["duracion"])
                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM servicios;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(servicios) > 0:
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": servicios,
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
            print(f"{MESSAGE['errorGet']} - {error}")
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
