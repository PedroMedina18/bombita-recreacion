from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Cargos, PermisosCargos, Permisos
from ..funtions.token import verify_token
from ..funtions.editorOpciones import editorOpciones
from ..funtions.identificador import returnBoolean, normalize_id_list
from django.db import IntegrityError, connection, models
from ..message import MESSAGE
from decouple import config
import json

# CRUD COMPLETO DE LA TABLA DE CARGOS

class Cargos_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, id=0):
        try:
            req = request.POST
            img = request.FILES
            method = request.GET.get("_method", "POST")
            verify = verify_token(request.headers)
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            
            # info:AQUI SE BUSCA IDENTIFICAR SI SE TRATA DE REALIZAR UNA METICION 'PUT'
            if method=="PUT":
                
                cargos = list(Cargos.objects.filter(id=id).values())
                cursor = connection.cursor()
                if len(cargos) > 0:
                    cargo = Cargos.objects.get(id=id)
                    cargo.nombre = req['nombre']
                    cargo.descripcion = req['descripcion']
                    cargo.administrador = returnBoolean(req['administrador'])
                    if "img_logo" in img:
                        cargo.img_logo=img['img_logo']
                    cargo.save()
                    if (returnBoolean(req['administrador'])):
                        PermisosCargos.objects.filter(cargos=id).delete()
                        datos = {
                            'status': True,
                            'message': f"{MESSAGE['edition']}"
                        }
                    else:
                        query = """
                        SELECT p.id FROM
                            permisos AS p
                        INNER JOIN 
                            permisos_has_cargos
                        ON
                            p.id = permisos_has_cargos.permiso_id
                        WHERE
                            permisos_has_cargos.cargo_id = %s;
                        """
                        cursor.execute(query, [int(id)])
                        permisos = dictfetchall(cursor)
                        listTabla = normalize_id_list(req['permisos'])
                        editorOpciones(
                            items = permisos,
                            id = id,
                            listTabla = listTabla,
                            tablaIntermedia = PermisosCargos,
                            itemGet = cargo,
                            tablaAgregar = Permisos,
                            filtro_principal = 'cargos', 
                            filtro_secundario = 'permisos', 
                            campo_principal = 'cargos', 
                            campo_secundario = 'permisos'
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
            
            # info:EN CASO DE NO AGREGAR EL QUERY METHOD NI IDENTIFICAR QUE ES UNA PETICION PUT SE CONSIDERAR COMO UNA PETICION POST
            else:
                cargo = Cargos.objects.create(
                    nombre = req['nombre'].title(), 
                    descripcion = req['descripcion'], 
                    administrador = returnBoolean(req['administrador']), 
                    img_logo=img['img_logo'] if "img_logo" in img else None,
                )
            
                if (not returnBoolean(req['administrador'])):
                    permisos = req['permisos']
                    for permiso in permisos:
                        getPermiso = Permisos.objects.get(id=int(permiso))
                        PermisosCargos.objects.create(
                            permisos=getPermiso, cargos=cargo)
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['registerCargo']}"
                }
            return JsonResponse(datos)
        
        except Exception as error:
            if method=="PUT":
                print(f"{MESSAGE['errorPut']} - {error}")
                datos = {
                    'status': False,
                    'message': f"{MESSAGE['errorEdition']}: {error}",
                }
            else:
                print(f"{MESSAGE['errorPost']} - {error}", )
                datos = {
                    'status': False,
                    'message': f"{MESSAGE['errorRegistro']}: {error}"
                }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()

    # def put(self, request, id):
    #     try:
    #         verify = verify_token(request.headers)
    #         req = request.POST
    #         img = request.FILES
    #         if (not verify['status']):
    #             datos = {
    #                 'status': False,
    #                 'message': verify['message'],
    #             }
    #             return JsonResponse(datos)
    #         cargos = list(Cargos.objects.filter(id=id).values())
    #         cursor = connection.cursor()
    #         if len(cargos) > 0:
    #             cargo = Cargos.objects.get(id=id)
    #             cargo.nombre = req['nombre']
    #             cargo.descripcion = req['descripcion']
    #             cargo.administrador = returnBoolean(req['administrador'])
    #             if "img_logo" in img:
    #                 cargo.img_logo=img['img_logo']
    #             cargo.save()
    #             if (returnBoolean(req['administrador'])):
    #                 PermisosCargos.objects.filter(cargos=id).delete()
    #                 datos = {
    #                     'status': True,
    #                     'message': f"{MESSAGE['edition']}"
    #                 }
    #             else:
    #                 query = """"
    #                 SELECT p.id FROM
    #                     permisos AS p
    #                 INNER JOIN 
    #                     permisos_has_cargos 
    #                 ON 
    #                     p.id = permisos_has_cargos.permiso_id
    #                 WHERE 
    #                     permisos_has_cargos.cargo_id = %s;
    #                 """
    #                 editorOpciones(
    #                     cursor=cursor,
    #                     query=query,
    #                     id=id,
    #                     listTabla = req['permisos'],
    #                     tablaIntermedia=PermisosCargos,
    #                     itemGet=cargo,
    #                     tablaAgregar=Permisos,
    #                     filtro_cargos='cargos', 
    #                     filtro_permisos='permisos', 
    #                     campo_cargos='cargos', 
    #                     campo_permisos='permisos'
    #                 )
    #                 datos = {
    #                     'status': True,
    #                     'message': f"{MESSAGE['edition']}"
    #                 }
    #         else:
    #             datos = {
    #                 'status': False,
    #                 'message': f"{MESSAGE['errorRegistroNone']}"
    #             }
    #         return JsonResponse(datos)
    #     except Exception as error:
    #         print(f"{MESSAGE['errorPut']} - {error}")
    #         datos = {
    #             'status': False,
    #             'message': f"{MESSAGE['errorEdition']}: {error}",
    #         }
    #         return JsonResponse(datos)
    #     # finally:
    #         # cursor.close()
    #         # connection.close()
    
    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            cargo = list(Cargos.objects.filter(id=id).values())
            if len(cargo) > 0:
                Cargos.objects.filter(id=id).delete()
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['delete']}"
                }
            else:
                datos = datos = {
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
                SELECT * FROM cargos WHERE cargos.id=%s;
                """
                cursor.execute(query, [int(id)])
                cargo = dictfetchall(cursor)
                cargo[0]["img_logo"]=f"{config('URL')}media/{cargo[0]['img_logo']}" if cargo[0]['img_logo'] else None
                if(len(cargo)>0):
                    if (not cargo[0]['administrador']):
                        query = """
                        SELECT 
                            p.id,
                            p.nombre,
                            P.descripcion
                        FROM 
                            permisos AS p
                        INNER JOIN 
                            permisos_has_cargos 
                        ON 
                            p.id = permisos_has_cargos.permiso_id
                        WHERE 
                            permisos_has_cargos.cargo_id = %s;
                        """
                        cursor.execute(query, [int(id)])
                        permisos = dictfetchall(cursor)
                        cargo[0]['permisos'] = permisos
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': cargo[0]
                    }
                else:
                    datos = {
                        'status': False,
                        'message': f"{MESSAGE['errorRegistroNone']}",
                        'data': None,
                    }
            else:
                if ("all" in request.GET and request.GET['all'] == "true"):
                    query = """
                    SELECT * FROM cargos ORDER BY id ASC;
                    """
                    cursor.execute(query)
                    cargos = dictfetchall(cursor)
                elif ("page" in request.GET):
                    query = """
                    SELECT * FROM cargos ORDER BY id ASC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    cargos = dictfetchall(cursor)
                elif ("page" in request.GET and "desc" in request.GET and request.GET['desc'] == "true"):
                    query = """
                    SELECT * FROM cargos ORDER BY id DESC LIMIT %s, %s;
                    """
                    cursor.execute(query, [indiceInicial(
                        int(request.GET['page'])), indiceFinal(int(request.GET['page']))])
                    cargos = dictfetchall(cursor)
                else:
                    query = """
                    SELECT * FROM cargos ORDER BY id LIMIT 25;
                    """
                    cursor.execute(query)
                    cargos = dictfetchall(cursor)

                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM cargos;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)
                
                if len(cargos) > 0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': cargos,
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