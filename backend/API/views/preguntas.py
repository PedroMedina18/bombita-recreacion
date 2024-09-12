from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..models import PreguntasEvento
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..utils.identificador import determinar_valor
from ..utils.filtros import order, filtrosWhere
from ..utils.token import verify_token
from ..message import MESSAGE
from django.db import IntegrityError, connection, models
import json

class Preguntas_Evento_View(View):
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
            if(not (bool(verify['info']['administrador']) or 14 in verify['info']['permisos'] or 11 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            PreguntasEvento.objects.create(pregunta=req['pregunta'].title())
            datos = {
                'status': True,
                'message': f"{MESSAGE['registerPregunta']}"
            }
            return JsonResponse(datos)
        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if 'pregunta' in error.args[1]:
                    message = MESSAGE['preguntaDuplicate']
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
            if(not (bool(verify['info']['administrador']) or 14 in verify['info']['permisos'] or 11 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            pregunta = list(PreguntasEvento.objects.filter(id=id).values())
            if len(pregunta) > 0:
                material = PreguntasEvento.objects.get(id=id)
                if 'pregunta' in req:
                    material.pregunta = req['pregunta']
                if 'estado' in req:
                    material.estado = req['estado']
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
                if 'pregunta' in error.args[1]:
                    message = MESSAGE['preguntaDuplicate']
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
    
    def delete (self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 14 in verify['info']['permisos'] or 11 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            pregunta = list(PreguntasEvento.objects.filter(id=id).values())
            if len(pregunta) > 0:
                PreguntasEvento.objects.filter(id=id).delete()
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
                
                if(not (bool(verify['info']['administrador']) or 14 in verify['info']['permisos'] or 11 in verify['info']['permisos'])):
                    datos = {
                        'status': False,
                        'message': MESSAGE['NonePermisos'],
                    }
                    return JsonResponse(datos)

                query = """
                SELECT * FROM preguntas_eventos WHERE preguntas_eventos.id=%s;
                """
                cursor.execute(query, [int(id)])
                pregunta = dictfetchall(cursor)
                if(len(pregunta)>0):
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': pregunta[0]
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
                estado = request.GET.get('estado', None)
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
                if estado=="true":
                    where.append(f"estado=1" )
                if estado=="false":
                    where.append(f"estado=0" )
                where = filtrosWhere(where)

                if(all == "true"):
                    query = "SELECT id, nombre FROM preguntas_eventos ORDER BY {} {};".format(typeOrdenBy, orderType)
                    cursor.execute(query)
                    preguntas = dictfetchall(cursor)
                else:
                    query = "SELECT * FROM preguntas_eventos {} ORDER BY {} {} LIMIT %s, %s;".format(where, typeOrdenBy, orderType)
                    cursor.execute(query, [inicio, final])
                    preguntas = dictfetchall(cursor)
                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM preguntas_eventos;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(preguntas)>0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': preguntas,
                        'pages': int(result[0]['pages']),
                        'total':result[0]['total'],
                    }
                else:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        'data': None,
                        'pages': 0,
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