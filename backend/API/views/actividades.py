from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Actividades, MaterialesActividad, Materiales
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
from ..funtions.editorOpciones import editorOpciones
from ..message import MESSAGE
import json

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
            verify=verify_token(req['headers'])
            req = req['body']
            cursor = connection.cursor()
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
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
                        materiales_has_actividades
                    ON 
                        ma.id = materiales_has_actividades.material_id
                    WHERE 
                        materiales_has_actividades.actividad_id = %s;
                """
                cursor.execute(query, [int(id)])
                materiales = dictfetchall(cursor)
                editorOpciones(
                    items = materiales,
                    id = id,
                    listTabla = req['materiales'],
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
                            materiales_has_actividades 
                        ON 
                            m.id = materiales_has_actividades.material_id
                        WHERE 
                            materiales_has_actividades.actividad_id = %s;
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
                if("all" in request.GET and request.GET['all']=="true"):
                    query = """
                    SELECT * FROM actividades ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    activiades = dictfetchall(cursor)
                elif("page" in request.GET ):
                    query = """
                    SELECT * FROM actividades ORDER BY id ASC id LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    activiades = dictfetchall(cursor)
                elif("page" in request.GET and "desc" in request.GET and request.GET['desc']=="true"):
                    query = """
                    SELECT * FROM actividades ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    activiades = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM actividades ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    activiades = dictfetchall(cursor)

                query="""
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM actividades;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                if len(activiades)>0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': activiades,
                        'pages': int(result[0]['pages']),
                        'total':result[0]['total'],
                    }
                else:
                    datos = {
                        'status': False,
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
