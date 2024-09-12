from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..models import Materiales, RegistrosMateriales
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..utils.identificador import determinar_valor, normalize_id_list
from ..utils.token import verify_token
from ..utils.filtros import order, filtrosWhere, peridoFecha
from ..message import MESSAGE
import json


# CRUD COMPLETO DE LA TABLA DE materiales
class Registros_Material_View(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
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
            if(not (bool(verify['info']['administrador']) or 9 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            material = list(Materiales.objects.filter(id=req["material"]).values())
            if len(material) > 0:
                material = Materiales.objects.get(id=int(req["material"]))
            else:
                datos = {"status": False, "message": MESSAGE["errorMaterial"]}
                return JsonResponse(datos)

            if not (int(req["tipo"]) == 0 or int(req["tipo"]) == 1):
                datos = {"status": False, "message": MESSAGE["errorTipoMaterial"]}
                return JsonResponse(datos)

            if int(req["tipo"]) == 0:
                total = material.total - int(req["cantidad"])
                if total < 0:
                    datos = {"status": False, "message": MESSAGE["inventarioNegativo"]}
                    return JsonResponse(datos)
            else:
                total = material.total + int(req["cantidad"])

            RegistrosMateriales.objects.create(
                material=material,
                descripcion=req["descripcion"],
                cantidad=req["cantidad"],
                total=total,
                tipo=int(req["tipo"]),
            )
            material.total = total
            material.save()
            datos = {"status": True, "message": f"{MESSAGE['registerInventario']}"}
            return JsonResponse(datos)

        except Exception as error:
            datos = {"status": False, "message": f"{MESSAGE['errorRegistro']}: {error}"}
            return JsonResponse(datos)

    def get(self, request, id):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {
                    "status": False,
                    "message": verify["message"],
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 9 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            material = list(Materiales.objects.filter(id=id).values())
            if not (len(material) > 0):
                datos = {"status": False, "message": MESSAGE["errorMaterial"]}
                return JsonResponse(datos)

            page = request.GET.get("page", 1)
            inicio = indiceInicial(int(page))
            final = indiceFinal(int(page))
            all = request.GET.get("all", False)
            fecha = peridoFecha(request, "reg.fecha_registro")
            orderType = order(request)
            where = []

            search = request.GET.get("search", None)
            search = determinar_valor(search)
            if search["valor"] and search["type"] == "int":
                where.append(f"reg.id LIKE '{search['valor']}%%'")

            tipo = request.GET.get("tipo", 5)
            if int(tipo) == 0:
                where.append(f"reg.tipo=0")
            elif int(tipo) == 1:
                where.append(f"reg.tipo=1")
            elif int(tipo) == 2:
                where.append(f"reg.tipo=2")

            if fecha:
                where.append(f"{fecha}")

            where.append(f"reg.material_id={int(id)}")
            where = filtrosWhere(where)

            if all == "true":
                limit = ""
            else:
                limit = f"LIMIT {inicio}, {final}"

            query = """
                SELECT 
                    reg.id,
                	reg.descripcion,
                    reg.cantidad,
                    reg.total, 
                    reg.tipo, 
                    reg.fecha_registro,
                    ma.nombre as material
                FROM registros_materiales AS reg
                LEFT JOIN materiales AS ma ON reg.material_id=ma.id
                {}
                ORDER BY reg.id {} {};
                """.format(where, orderType, limit)
            cursor.execute(query)
            registros_materiales = dictfetchall(cursor)
            query = """
                    SELECT COALESCE(CEILING(COUNT(id) / 25), 1) AS pages, COUNT(id) AS total FROM registros_materiales WHERE material_id=%s;
                """
            cursor.execute(query, [id])
            result = dictfetchall(cursor)

            if len(registros_materiales) > 0:
                datos = {
                    "status": True,
                    "message": f"{MESSAGE['exitoGet']}",
                    "data": registros_materiales,
                    "pages": int(result[0]["pages"]),
                    "total": result[0]["total"],
                    "total_material": material[0]["total"]
                }
            else:
                datos = {
                    "status": True,
                    "message": f"{MESSAGE['errorRegistrosNone']}",
                    "data": None,
                    "pages": 0,
                    "total": 0,
                    "total_material": 0
                }
            return JsonResponse(datos)
        except Exception as error:
            datos = {
                "status": False,
                "message": f"{MESSAGE['errorConsulta']}: {error}",
                "data": None,
                "pages": 0,
                "total": 0,
                "total_material": 0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
