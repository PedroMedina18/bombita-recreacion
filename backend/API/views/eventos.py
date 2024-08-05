from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..funtions.email import emailRegistroEvento
from ..models import Eventos, EventosSobrecargos, EventosServicios, Clientes, Personas, Servicios, Sobrecargos, TipoDocumento
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
from ..message import MESSAGE
from datetime import datetime
import json

class Eventos_Views(View):
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
            if ('id_cliente' in req):
                cliente = list(Clientes.objects.filter(id = req['id_cliente']).values())
                if (len(cliente) > 0):
                    cliente = Clientes.objects.get(id = req['id_cliente'])
                else:
                    datos = {
                        'status': False,
                        'message': MESSAGE['errorCliente']
                    }
                    return JsonResponse(datos)
            else:
                #* se debe comprobar si se va a registrar una persona nueva o ya existe
                if ('id_persona' in req):
                    ### *comprobacion de persona
                    persona = list(Personas.objects.filter(id = req['id_persona']).values())
                    if (len(persona) > 0):
                        persona = Personas.objects.get(id = req['id_persona'])
                    else:
                        datos = {
                            'status': False,
                            'message': MESSAGE['errorRegistroPersona']
                        }
                        return JsonResponse(datos)
                else:
                    ### *comprobacion de tipo de documento
                    tipo_documento = list(TipoDocumento.objects.filter(
                        id = req['tipo_documento']).values())
                    if (len(tipo_documento) > 0):
                        tipo_documento = TipoDocumento.objects.get(
                            id = req['tipo_documento'])
                    else:
                        datos = {
                            'status': False,
                            'message': MESSAGE['errorTipoDocumento']
                        }
                        return JsonResponse(datos)
                    ### *Registro de datos de nueva persona
                    persona = Personas.objects.create(
                        nombres = req['nombres'].title(),
                        apellidos = req['apellidos'].title(),
                        numero_documento = req['numero_documento'],
                        telefono_principal = req['telefono_principal'],
                        telefono_secundario = req['telefono_secundario'],
                        correo = req['correo'],
                        tipo_documento = tipo_documento
                    )
                cliente = Clientes.objects.create(persona = persona)
            if cliente.persona.correo:
                emailRegistroEvento(cliente.persona.correo)
            evento = Eventos.objects.create(
                fecha_evento = datetime.fromisoformat(req['fecha_evento']),
                direccion = req['direccion'], 
                numero_personas = int(req['numero_personas']), 
                cliente = cliente,
                completado = False,
            )
            servicios = req['servicios']
            for servicio in servicios:
                getServicio = Servicios.objects.get(id=int(servicio))
                EventosServicios.objects.create(evento=evento, servicio=getServicio)
            
            sobrecargos = req['sobrecargos']
            for sobrecargo in sobrecargos:
                getSobrecargo = Sobrecargos.objects.get(id=int(sobrecargo))
                EventosSobrecargos.objects.create(evento=evento, sobrecargo=getSobrecargo)

            datos = {'status': True, 'message': f"{MESSAGE['registerEvento']}"}
            return JsonResponse(datos)

        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0]==1062:
                if 'telefono_principal' in error.args[1]:
                    message = MESSAGE['telefonoPrincipalDuplicate']
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
    
    def delete(self, request, id):
        try:
            verify=verify_token(request.headers)
            if(not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message']
                }
                return JsonResponse(datos)
            evento = list(Eventos.objects.filter(id=id).values())
            if len(evento) > 0:
                evento=evento[0]
                if (not evento['completado'] and not evento['anticipo'] and not evento['pagado']):
                    Eventos.objects.filter(id=id).delete()
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['delete']}"
                    }
                else:
                    datos = {
                        'status': False,
                        'message': f"{MESSAGE['errorProtectEvento']}"
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
            verify = verify_token(request.headers)
            info = request.GET.get('_info', 'false')
            if not verify['status']:
                datos = {'status': False, 'message': verify['message'], 'data': None}
                return JsonResponse(datos)

            if id:
                query = """
                    SELECT 
                        eve.id,
                    	eve.fecha_evento,
                        per.nombres, 
                        per.apellidos, 
                        tipo.nombre AS tipo_documento, 
                        per.numero_documento,
                        eve.numero_personas,
                        eve.direccion,
                        eve.completado,
                        eve.fecha_registro,
                        eve.fecha_actualizacion
                    FROM eventos AS eve
                    LEFT JOIN clientes AS cli ON eve.cliente_id=cli.id
                    INNER JOIN personas AS per ON cli.persona_id=per.id
                    LEFT JOIN tipo_documentos AS tipo ON per.tipo_documento_id=tipo.id
                    WHERE eve.id LIKE %s ;
                    """
                cursor.execute(query, [id])
                evento = dictfetchall(cursor)
                if info == 'true' and len(evento) > 0:
                    evento = evento[0]
                    query = """
                    SELECT 
                        ser.nombre,
                        ser.descripcion,
                        ser.precio
                    FROM servicios_eventos AS seve
                    INNER JOIN servicios AS ser ON seve.servicio_id=ser.id
                    WHERE seve.evento_id=%s;
                    """
                    cursor.execute(query, [int(evento['id'])])
                    servicios = dictfetchall(cursor)
                    query = """
                    SELECT 
                        so.nombre,
                        so.descripcion,
                        so.monto
                    FROM sobrecargos_eventos AS sove
                    INNER JOIN sobrecargos AS so ON sove.sobrecargo_id=so.id
                    WHERE sove.evento_id=%s;
                    """
                    cursor.execute(query, [int(evento['id'])])
                    sobrecargos = dictfetchall(cursor)

                    query = """
                    SELECT 
                        pa.id,
                        pa.tipo,
                        pa.monto, 
                        pa.referencia,
                        pa.capture,
                        me.id AS metodo_pago_id,
                        me.nombre AS metodo_pago,
                        pre.id AS precio_dolar_id,
                        pre.precio AS precio_dolar
                    FROM pagos AS pa
                    INNER JOIN metodos_pago AS me ON pa.metodo_pago_id=me.id
                    LEFT JOIN precio_dolar AS pre ON pa.precio_dolar_id=pre.id
                    WHERE pa.evento_id=%s;
                    """
                    cursor.execute(query, [int(evento['id'])])
                    pagos = dictfetchall(cursor)

                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': {
                            'info': evento,
                            'servicios': servicios,
                            'sobrecargos': sobrecargos,
                            'pagos': pagos,
                        }
                    }
                elif info == 'false' and len(evento) > 0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': evento,
                        'total': len(evento),
                        'pages': 1,
                    }
                else:
                    datos = {
                        'status': False,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        'data': None,
                        'total': 0,
                        'pages': 0,
                    }
            else:
                page = request.GET.get('page', 1)
                inicio = indiceInicial(int(page))
                final = indiceFinal(int(page))

                order = request.GET.get('order', 'ASC')
                if not(order == 'ASC') and not(order == 'DESC'):
                    order = 'ASC'

                filtros = request.GET.get('filter', '')

                if (filtros == 'pagado'):
                    filtros = 'WHERE eve.total = 1'
                elif (filtros == 'anticipo'):
                    filtros = 'WHERE eve.anticipo = 1'
                elif (filtros == 'no_pagado'):
                    filtros = 'WHERE eve.total = 0'
                elif (filtros == 'no_anticipo'):
                    filtros = 'WHERE eve.anticipo = 0 AND eve.total = 0'


                query = """
                SELECT 
                    eve.id,
                	eve.fecha_evento,
                    per.nombres, 
                    per.apellidos, 
                    tipo.nombre AS tipo_documento, 
                    per.numero_documento,
                    eve.numero_personas,
                    eve.anticipo,
                    eve.total,
                    eve.fecha_registro,
                    eve.completado
                FROM eventos AS eve
                LEFT JOIN clientes AS cli ON eve.cliente_id=cli.id
                LEFT JOIN personas AS per ON cli.persona_id=per.id
                LEFT JOIN tipo_documentos AS tipo ON per.tipo_documento_id=tipo.id
                ORDER BY eve.id {} LIMIT %s, %s;
                """.format(order)
                cursor.execute(query, [inicio, final])
                eventos = dictfetchall(cursor)
                
                query = """
                    SELECT CEILING(COUNT(id) / 25) AS pages, COUNT(id) AS total FROM eventos;
                """
                cursor.execute(query)
                result = dictfetchall(cursor)

                if len(eventos) > 0:
                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': eventos,
                        'pages': int(result[0]['pages']),
                        'total': result[0]['total'],
                    }
                else:
                    datos = {
                        'status': False,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        'data': None,
                        'pages': None,
                        'total': 0,
                    }

            return JsonResponse(datos)
        except Exception as error:
            print(f"{MESSAGE['errorGet']} - {error}")
            datos = {
                'status': False,
                'message': f"{MESSAGE['errorConsulta']}: {error}",
                'data': None,
                'pages': None,
                'total': 0,
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()