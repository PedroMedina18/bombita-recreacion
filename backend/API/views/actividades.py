from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..models import Actividades, MaterialesActividad, Materiales
from ..utils.token import verify_token
from ..utils.editorOpciones import editorOpciones
from ..utils.filtros import order, filtrosWhere
from ..utils.identificador import determinar_valor
from ..message import MESSAGE
import json
from decouple import config

# CRUD COMPLETO DE LA TABLA DE nivel
class Actividades_Views(View):
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

            if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            actividad = Actividades.objects.create(nombre=req['nombre'].title(), descripcion=req['descripcion'])
            if(req['materiales']):
                materiales = req['materiales']
                for material in materiales:
                        new_material = Materiales.objects.get(id=int(material))
                        MaterialesActividad.objects.create(material=new_material, actividad=actividad)
            datos = {
                'status': True,
                'message': f"{MESSAGE['registerActividad']}"
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
            cursor = connection.cursor()
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
                
            if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            actividad = list(Actividades.objects.filter(id=id).values())
            if len(actividad) > 0:
                actividad = Actividades.objects.get(id=id)
                actividad.nombre = req['nombre']
                actividad.descripcion = req['descripcion']
                actividad.save()
                
                query = """
                    SELECT ma.id FROM
                        materiales AS ma
                    INNER JOIN 
                        materiales_actividades
                    ON 
                        ma.id = materiales_actividades.material_id
                    WHERE 
                        materiales_actividades.actividad_id = %s;
                """
                cursor.execute(query, [int(id)])
                materiales = dictfetchall(cursor)
                editorOpciones(
                    registros = materiales,
                    id = id,
                    list_new_registros = req['materiales'],
                    tablaIntermedia = MaterialesActividad,
                    itemGet = actividad,
                    tablaAgregar = Materiales,
                    filtro_principal = 'actividad', 
                    filtro_secundario = 'material', 
                    campo_principal = 'actividad', 
                    campo_secundario = 'material'
                )
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
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorEdition']}: {error}",
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)

            if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            actividad = list(Actividades.objects.filter(id=id).values())
            if len(actividad) > 0:
                Actividades.objects.filter(id=id).delete()
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
            print(f"{MESSAGE['errorProteccion']}  - {str(error)}")
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
                if(not (bool(verify['info']['administrador']) or 5 in verify['info']['permisos'])):
                    datos = {
                        'status': False,
                        'message': MESSAGE['NonePermisos'],
                    }
                    return JsonResponse(datos)
                query = """
                SELECT * FROM actividades WHERE actividades.id=%s;
                """
                cursor.execute(query, [int(id)])
                actividad = dictfetchall(cursor)
                if(len(actividad)>0):
                    query = """
                        SELECT 
                            m.id,
                            m.nombre,
                            m.descripcion
                        FROM 
                            materiales AS m
                        INNER JOIN 
                            materiales_actividades 
                        ON 
                            m.id = materiales_actividades.material_id
                        WHERE 
                            materiales_actividades.actividad_id = %s;
                    """
                    cursor.execute(query, [int(id)])
                    materiales = dictfetchall(cursor)
                    actividad[0]['materiales'] = materiales
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': actividad[0]
                    }
                else:
                    datos = {
                        'status': False,
                        'message': f"{MESSAGE['errorRegistro']}",
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
                    query = "SELECT id, nombre FROM actividades ORDER BY {} {};".format(typeOrdenBy, orderType)
                    cursor.execute(query)
                    actividades = dictfetchall(cursor)
                else:
                    query = "SELECT * FROM actividades {} ORDER BY {} {} LIMIT %s, %s;".format(where, typeOrdenBy, orderType)
                    cursor.execute(query, [inicio, final])
                    actividades = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM actividades;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(actividades)>0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': actividades,
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
