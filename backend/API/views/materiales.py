from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Materiales
from ..funtions.filtros import order, filtrosWhere
from ..message import MESSAGE
from ..funtions.identificador import determinar_valor
from ..funtions.token import verify_token
import json

# CRUD COMPLETO DE LA TABLA DE materiales
class Materiales_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        try:
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            req = req['body']
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            Materiales.objects.create(nombre=req['nombre'].title(), descripcion=req['descripcion'], total=req['total'])
            datos = {
                'status': True,
                'message': f"{MESSAGE['registerMaterial']}"
            }
            return JsonResponse(datos)
        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if 'nombre' in error.args[1]:
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
            verify=verify_token(req['headers'])
            req = req['body']
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            material = list(Materiales.objects.filter(id=id).values())
            if len(material) > 0:
                material = Materiales.objects.get(id=id)
                material.nombre = req['nombre']
                material.descripcion = req['descripcion']
                material.total = req['total']
                material.save()
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['edition']}"
                }
            else:
                datos = {
                    'status': False,
                    'message': f"{MESSAGE['errorRegistroNone']}"
                }
            return JsonResponse(datos)
        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if 'nombre' in error.args[1]:
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
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            material = list(Materiales.objects.filter(id=id).values())
            if len(material) > 0:
                Materiales.objects.filter(id=id).delete()
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['delete']}"
                }
            else:
                datos  = {
                    'status': False,
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
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                    'data': None
                }
                return JsonResponse(datos)

            if (id > 0):
                query = """
                SELECT * FROM materiales WHERE materiales.id=%s;
                """
                cursor.execute(query, [int(id)])
                material = dictfetchall(cursor)
                if(len(material)>0):
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': material[0]
                    }
                else:
                    datos = {
                        'status': False,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        'data': None
                    }
            else:
                page = request.GET.get('page', 1)
                inicio = indiceInicial(int(page))
                final = indiceFinal(int(page))
                all = request.GET.get('all', False)
                orderType = order(request)
                typeOrdenBy = request.GET.get('organizar', "orig")

                if(typeOrdenBy=="orig"):
                    typeOrdenBy ="id"
                elif(typeOrdenBy=="alf"):
                    typeOrdenBy ="nombre"
                else:
                    typeOrdenBy="id"

                where = []
                search = request.GET.get('search', None)
                search = determinar_valor(search)
                if(search['valor'] and search['type']=="int"):
                    where.append(f"id LIKE '{search['valor']}%%'" )
                where = filtrosWhere(where)

                if(all == "true"):
                    query = "SELECT id, nombre FROM materiales ORDER BY {} {};".format(typeOrdenBy, orderType)
                    cursor.execute(query)
                    materiales = dictfetchall(cursor)
                else:
                    query = "SELECT * FROM materiales {} ORDER BY {} {} LIMIT %s, %s;".format(where, typeOrdenBy, orderType)
                    cursor.execute(query, [inicio, final])
                    materiales = dictfetchall(cursor)
                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM materiales;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(materiales)>0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': materiales,
                        'pages': int(result[0]['pages']),
                        'total':result[0]['total'],
                    }
                else:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        'data': None,
                        'pages': None,
                        'total':0
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