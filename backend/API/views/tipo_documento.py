from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import TipoDocumento
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
import json

# CRUD COMPLETO DE LA TABLA DE tipo_documento
class Tipo_Documento_Views(View):
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
            TipoDocumento.objects.create(nombre=jd['nombre'].title(), descripcion=jd['descripcion'])
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

    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify["status"]):
                datos = {
                    "status": False,
                    'message': verify["message"]
                }
                return JsonResponse(datos)
            tipo_documento = list(TipoDocumento.objects.filter(id=id).values())
            if len(tipo_documento) > 0:
                TipoDocumento.objects.filter(id=id).delete()
                datos = {
                    "status": True,
                    'message': "Registro Eliminado"
                }
            else:
                datos = {
                    "status": False,
                    'message': "Registro No Encontrado"
                }
            return JsonResponse(datos)
        except models.ProtectedError as e:
            print("Erorr de proteccion")
            print(str(e))
            datos = {
                "status": False,
                'message': "Error. Item protejido no se puede eliminar"
            }
            return JsonResponse(datos)

    def put(self, request, id):
        try:
            jd = json.loads(request.body)
            tipo_documentos = list(TipoDocumento.objects.filter(id=id).values())
            if len(tipo_documentos) > 0:
                tipo_documento = TipoDocumento.objects.get(id=id)
                tipo_documento.nombre = jd['nombre']
                tipo_documento.descripcion = jd['descripcion']
                tipo_documento.save()
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
                SELECT * FROM tipo_documentos WHERE tipo_documentos.id=%s;
                """
                cursor.execute(query, [int(id)])
                tipo_documento = dictfetchall(cursor)
                if(len(tipo_documento)>0):
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": tipo_documento[0]
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Tipo de Documento no encontrado",
                        "data": None
                    }
            else:
                if("all" in request.GET and request.GET["all"]=="true"):
                    query = """
                    SELECT * FROM tipo_documentos ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    tipo_documentos = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM tipo_documentos ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    tipo_documentos = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET["desc"]=="true"):
                    query = """
                    SELECT * FROM tipo_documentos ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET["page"])), indiceFinal(int(request.GET["page"]))])
                    tipo_documentos = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM tipo_documentos ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    tipo_documentos = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM tipo_documentos;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(tipo_documentos)>0:
                    datos = {
                        "status": True,
                        'message': "Exito",
                        "data": tipo_documentos,
                        "pages": int(result[0]["pages"]),
                        "total":result[0]["total"],
                    }
                else:
                    datos = {
                        "status": False,
                        'message': "Error. No se encontraron registros",
                        "data": None,
                        "pages": None,
                        "total":0
                    }
            return JsonResponse(datos)
        except Exception as ex:
            print("Error", ex)
            datos = {
                "status": False,
                'message': "Error. Error de sistema",
                "data": None,
                "total":0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
