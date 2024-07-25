from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import MetodosPago
from django.db import IntegrityError, connection, models
from ..message import MESSAGE
from ..funtions.token import verify_token
import json

# CRUD COMPLETO DE LA TABLA DE metodos_pago
class Metodos_Pagos_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        try:
            req = json.loads(request.body)
            verify = verify_token(req["headers"])
            req = req["body"]
            if (not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                }
                return JsonResponse(datos)
            referencia = req['referencia'] if 'referencia' in req else False
            capture = req['capture'] if 'capture' in req else False
            divisa = req['divisa'] if 'divisa' in req else False
            MetodosPago.objects.create(nombre=req['nombre'].title(), descripcion=req['descripcion'], divisa=divisa, referencia=referencia, capture=capture)
            datos = {
                "status": True,
                'message': f"{MESSAGE['registerMetodoPago']}"
            }
            return JsonResponse(datos)
        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if "nombre" in error.args[1]:
                    message = MESSAGE['nombreDuplicate']
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
            print(f"{MESSAGE['errorPost']} - {error}", )
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
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"]
                }
                return JsonResponse(datos)
            metodo_pago = list(MetodosPago.objects.filter(id=id).values())
            if len(metodo_pago) > 0:
                referencia = req['referencia'] if 'referencia' in req else False
                capture = req['capture'] if 'capture' in req else False
                divisa = req['divisa'] if 'divisa' in req else False
                metodo_pago = MetodosPago.objects.get(id=id)
                metodo_pago.nombre = req['nombre']
                metodo_pago.descripcion = req['descripcion']
                metodo_pago.referencia = referencia
                metodo_pago.capture = capture
                metodo_pago.divisa = divisa
                metodo_pago.save()
                datos = {
                    "status": True,
                    'message': f"{MESSAGE['edition']}"
                }
            else:
                datos = {
                    "status": False,
                    'message': f"{MESSAGE['errorRegistroNone']}"
                }
            return JsonResponse(datos)
        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if "nombre" in error.args[1]:
                    message = MESSAGE['nombreDuplicate']
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
            print(f"{MESSAGE['errorPut']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorEdition']}: {error}",
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
            metodo_pago = list(MetodosPago.objects.filter(id=id).values())
            if len(metodo_pago) > 0:
                MetodosPago.objects.filter(id=id).delete()
                datos = {
                    "status": True,
                    'message': f"{MESSAGE['delete']}"
                }
            else:
                datos = {
                    "status": False,
                    'message': f"{MESSAGE['errorRegistroNone']}"
                }
            return JsonResponse(datos)
        except models.ProtectedError as error:
            print(f"{MESSAGE['errorProteccion']} - {str(error)}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorProtect']}"
            }
            return JsonResponse(datos)
        except Exception as error:
            print(f"{MESSAGE['errorDelete']} - {error}", )
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorEliminar']}: {error}"
            }
            return JsonResponse(datos)

    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify=verify_token(request.headers)
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"],
                    "data": None
                }
                return JsonResponse(datos)
            if (id > 0):
                query = """
                SELECT * FROM metodos_pago WHERE metodos_pago.id=%s;
                """
                cursor.execute(query, [int(id)])
                tipo_documento = dictfetchall(cursor)
                if(len(tipo_documento)>0):
                    datos = {
                        "status": True,
                        'message': f"{MESSAGE['exitoGet']}",
                        "data": tipo_documento[0]
                    }
                else:
                    datos = {
                        "status": False,
                        'message': f"{MESSAGE['errorRegistroNone']}",
                        "data": None
                    }
            else:
                if("all" in request.GET and request.GET["all"]=="true"):
                    query = """
                    SELECT * FROM metodos_pago ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    metodos_pago = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM metodos_pago ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    metodos_pago = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET["desc"]=="true"):
                    query = """
                    SELECT * FROM metodos_pago ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    metodos_pago = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM metodos_pago ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    metodos_pago = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM metodos_pago;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(metodos_pago)>0:
                    datos = {
                        "status": True,
                        'message': f"{MESSAGE['exitoGet']}",
                        "data": metodos_pago,
                        "pages": int(result[0]["pages"]),
                        "total":result[0]["total"],
                    }
                else:
                    datos = {
                        "status": False,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        "data": None,
                        "pages": None,
                        "total":0
                    }
            return JsonResponse(datos)
        except Exception as error:
            print(f"{MESSAGE['errorGet']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorConsulta']}: {error}",
                'data': None,
                'pages': None,
                'total':0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
