from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Cargos, Privilegios, Permisos
from ..funtions.token import verify_token
from ..funtions.editorOpciones import editorOpciones
from ..funtions.identificador import returnBoolean, normalize_id_list, determinar_valor
from ..message import MESSAGE
from ..funtions.filtros import order, filtrosWhere
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
            imgs = request.FILES
            method = request.GET.get('_method', 'POST')
            verify = verify_token(request.headers)
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            
            # info:AQUI SE BUSCA IDENTIFICAR SI SE TRATA DE REALIZAR UNA METICION 'PUT'
            if method=='PUT':
                
                cargos = list(Cargos.objects.filter(id=id).values())
                cursor = connection.cursor()
                if len(cargos) > 0:
                    cargo = Cargos.objects.get(id=id)
                    cargo.nombre = req['nombre']
                    cargo.descripcion = req['descripcion']
                    cargo.administrador = returnBoolean(req['administrador'])
                    if 'img' in imgs:
                        cargo.img=imgs['img']
                    cargo.save()
                    if (returnBoolean(req['administrador'])):
                        Privilegios.objects.filter(cargos=id).delete()
                        datos = {
                            'status': True,
                            'message': f"{MESSAGE['edition']}"
                        }
                    else:
                        query = """
                        SELECT p.id FROM
                            permisos AS p
                        INNER JOIN 
                            privilegios
                        ON
                            p.id = privilegios.permiso_id
                        WHERE
                            privilegios.cargo_id = %s;
                        """
                        cursor.execute(query, [int(id)])
                        permisos = dictfetchall(cursor)
                        listTabla = normalize_id_list(req['permisos'])
                        editorOpciones(
                            registros = permisos,
                            id = id,
                            list_new_registros = listTabla,
                            tablaIntermedia = Privilegios,
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
                    img=imgs['img'] if 'img' in imgs else None,
                )
            
                if (not returnBoolean(req['administrador'])):
                    permisos = req['permisos']
                    for permiso in permisos:
                        getPermiso = Permisos.objects.get(id=int(permiso))
                        Privilegios.objects.create(
                            permisos=getPermiso, cargos=cargo)
                datos = {
                    'status': True,
                    'message': f"{MESSAGE['registerCargo']}"
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
            if method=='PUT':
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
                cargo[0]['img']=f"{config('URL')}media/{cargo[0]['img']}" if cargo[0]['img'] else None
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
                            privilegios 
                        ON 
                            p.id = privilegios.permiso_id
                        WHERE 
                            privilegios.cargo_id = %s;
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
                page = request.GET.get('page', 1)
                inicio = indiceInicial(int(page))
                final = indiceFinal(int(page))
                all = request.GET.get('all', False)
                typeOrdenBy = request.GET.get('organizar', "orig")
                orderType = order(request)

                if(typeOrdenBy=='orig'):
                    typeOrdenBy ='id'
                elif(typeOrdenBy=='alf'):
                    typeOrdenBy ='nombre'
                else:
                    typeOrdenBy='id'

                where = []
                search = request.GET.get('search', None)
                search = determinar_valor(search)
                if(search['valor'] and search['type']=="int"):
                    where.append(f"id LIKE '{search['valor']}%%'" )
                where = filtrosWhere(where)

                if(all == "true"):
                    query = "SELECT id, nombre FROM cargos ORDER BY {} {};".format(typeOrdenBy, orderType)
                    cursor.execute(query)
                    cargos = dictfetchall(cursor)
                else:
                    query = "SELECT * FROM cargos {} ORDER BY {} {} LIMIT %s, %s;".format(where, typeOrdenBy, orderType)
                    cursor.execute(query, [inicio, final])
                    cargos = dictfetchall(cursor)

                query="""
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