from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..utils.email import emailRegistroEvento, emailEventoCancelado, emailEventoCompleto
from ..utils.time import duration
from ..utils.identificador import determinar_valor, edit_str, formato_id
from ..utils.estado_pago import estadoPagoDescription
from ..utils.filtros import order, filtrosWhere, peridoFecha
from ..models import Eventos, EventosSobrecostos, EventosServicios, Clientes, Pagos, Personas, Servicios, Sobrecostos, TipoDocumento, EventosRecreadoresServicios, Materiales, RegistrosMateriales
from ..utils.token import verify_token
from ..message import MESSAGE
import datetime
from decouple import config
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

            if(not (bool(verify['info']['administrador']) or 12 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            eventos_to_update = Eventos.objects.filter(
            estado__isnull=True, 
            estado_pago=0, 
            fecha_evento_inicio__lt=datetime.datetime.now()
            )

            for evento in eventos_to_update:
                evento.estado = False
                evento.motivo_cancelacion = "Evento a destiempo"
                evento.save()

            objetEventoEmail={
                "cliente":None,
                "documento":None,
                "codigo":0,
                "direccion":None,
                "fecha_inicio":None,
                "fecha_final":None,
                "servicios":[],
                "sobrecostos":[],
                "total":0,
            }
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

            duracionMax = datetime.timedelta(hours=0, minutes=0)
            servicios = []
            for servicio in req['servicios']:
                servicioObjet=Servicios.objects.get(id=int(servicio))
                if servicioObjet.duracion > duracionMax:
                    duracionMax = servicioObjet.duracion
                servicios.append(servicioObjet)

            fecha_evento_inicio = datetime.datetime.strptime(req['fecha_evento_inicio'], "%Y-%m-%dT%H:%M")
            fecha_evento_final = fecha_evento_inicio + duracionMax
            fecha_evento_final = datetime.datetime.strptime(req['fecha_evento_final'], "%Y-%m-%dT%H:%M") if 'fecha_evento_final' in req else fecha_evento_final,
            evento = Eventos.objects.create(
                fecha_evento_inicio = fecha_evento_inicio,
                fecha_evento_final = fecha_evento_final[0],
                direccion = req['direccion'], 
                numero_personas = int(req['numero_personas']), 
                cliente = cliente,
                estado = None,
            )
            
            objetEventoEmail["cliente"]=f"{evento.cliente.persona.nombres} {evento.cliente.persona.apellidos}"
            objetEventoEmail["documento"]=f"{evento.cliente.persona.tipo_documento.nombre}-{evento.cliente.persona.numero_documento}"
            objetEventoEmail["codigo"]=formato_id(evento.id)
            objetEventoEmail["direccion"]=evento.direccion
            objetEventoEmail["fecha_inicio"]=evento.fecha_evento_inicio.strftime("%d de %B de %Y a las %I:%M %p")
            objetEventoEmail["fecha_final"]=evento.fecha_evento_final.strftime("%d de %B de %Y a las %I:%M %p")
            
            for servicio in servicios:
                objetEventoEmail["servicios"].append({"nombre":servicio.nombre, "precio":float(servicio.precio)})
                objetEventoEmail["total"]=float(objetEventoEmail["total"]) + float(servicio.precio)
                EventosServicios.objects.create(evento=evento, servicio=servicio)
            
            sobrecostos = req['sobrecostos']
            for sobrecosto in sobrecostos:
                getSobrecosto = sobrecostos.objects.get(id=int(sobrecosto))
                objetEventoEmail["sobrecostos"].append({"nombre":getSobrecosto.nombre, "monto":float(getSobrecosto.monto)})
                objetEventoEmail["total"]=float(objetEventoEmail["total"]) + float(getSobrecosto.monto)
                EventosSobrecostos.objects.create(evento=evento, sobrecosto=getSobrecosto)
            
            if cliente.persona.correo:
                emailRegistroEvento(cliente.persona.correo, objetEventoEmail)
            datos = {'status': True, 'message': f"{MESSAGE['registerEvento']}", 'id':evento.id}
            return JsonResponse(datos)

        except IntegrityError as error:
            if error.args[0]==1062:
                if 'telefono_principal' in error.args[1]:
                    message = MESSAGE['telefonoPrincipalDuplicate']
                elif'correo' in error.args[1]:
                    message = MESSAGE['correoDuplicate']
                elif'numero_documento' in error.args[1]:
                    message = MESSAGE['documentoDuplicate']
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
                'message': f"{MESSAGE['errorRegistro']}: {error}"
            }
            return JsonResponse(datos)
    
    def get(self, request, id=0):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            direccion=config('URL')
            if not verify['status']:
                datos = {'status': False, 'message': verify['message'], 'data': None}
                return JsonResponse(datos)

            if id:
                if(not (bool(verify['info']['administrador']) or 12 in verify['info']['permisos'] or 6 in verify['info']['permisos'] or 11 in verify['info']['permisos'])):
                    datos = {
                        'status': False,
                        'message': MESSAGE['NonePermisos'],
                    }
                    return JsonResponse(datos)
                query = """
                    SELECT 
                        eve.id,
                    	eve.fecha_evento_inicio,
                    	eve.fecha_evento_final,
                        per.nombres,
                        per.apellidos, 
                        (SELECT 
                            CASE 
                                WHEN COUNT(esr.id) > 0 THEN 1 
                                ELSE 0 
                            END 
                        FROM 
                            recreadores_eventos_servicios esr 
                        WHERE 
                        esr.evento_id = eve.id) AS recreadores,
                        tipo.nombre AS tipo_documento, 
                        per.numero_documento,
                        per.correo,
                        CONCAT('0', per.telefono_principal) AS telefono_principal,
                        IF(per.telefono_secundario IS NOT NULL AND per.telefono_secundario != '', CONCAT('0', per.telefono_secundario), per.telefono_secundario) AS telefono_secundario,
                        eve.numero_personas,
                        eve.direccion,
                        eve.estado,
                        eve.estado_pago,
                        eve.opinion,
                        eve.evaluado,
                        eve.fecha_registro,
                        eve.fecha_actualizacion
                    FROM eventos AS eve
                    LEFT JOIN clientes AS cli ON eve.cliente_id=cli.id
                    INNER JOIN personas AS per ON cli.persona_id=per.id
                    LEFT JOIN tipos_documentos AS tipo ON per.tipo_documento_id=tipo.id
                    WHERE eve.id=%s ;
                """
                cursor.execute(query, [id])
                evento = dictfetchall(cursor)
                if len(evento) > 0:
                    queryEvaluacion = """
                        SELECT 
                              e.id,
                              COALESCE(AVG(epe.evaluacion), 0) AS evaluacion
                            FROM 
                              eventos e
                              LEFT JOIN eventos_preguntas_evento epe ON e.id = epe.evento_id
                            WHERE 
                                e.id = %s
                            GROUP BY 
                              e.id;
                        """ 
                    cursor.execute(queryEvaluacion, [id])
                    evaluacion = dictfetchall(cursor)
                    evento = evento[0]
                    evento["estado_pago_descripcion"]=estadoPagoDescription(evento["estado_pago"])
                    query = """
                        SELECT 
                            ser.id,
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
                            so.id,
                            so.nombre,
                            so.descripcion,
                            so.monto
                        FROM sobrecostos_eventos AS sove
                        INNER JOIN sobrecostos AS so ON sove.sobrecosto_id=so.id
                        WHERE sove.evento_id=%s;
                    """
                    cursor.execute(query, [int(evento['id'])])
                    sobrecostos = dictfetchall(cursor)

                    query = """
                        SELECT 
                            pa.id,
                            pa.tipo,
                            pa.monto, 
                            pa.referencia,
                            IF(pa.capture IS NOT NULL AND pa.capture != '', CONCAT('{}media/', pa.capture), pa.capture) AS capture,
                            me.divisa,
                            me.id AS metodo_pago_id,
                            me.nombre AS metodo_pago,
                            pre.id AS precio_dolar_id,
                            pre.precio AS precio_dolar,
                            pa.fecha_registro
                        FROM pagos AS pa
                        INNER JOIN metodos_pago AS me ON pa.metodo_pago_id=me.id
                        LEFT JOIN precio_dolar AS pre ON pa.precio_dolar_id=pre.id
                        WHERE pa.evento_id=%s;
                    """.format(direccion)
                    cursor.execute(query, [int(evento['id'])])
                    pagos = dictfetchall(cursor)

                    datos = {
                        'status': True,
                        'message': f"{MESSAGE['exitoGet']}",
                        'data': {
                            'info': {
                                **evento,
                                "evaluacion":evaluacion[0]["evaluacion"]
                            },
                            'servicios': servicios,
                            'sobrecostos': sobrecostos,
                            'pagos': pagos,
                        }
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
                all = request.GET.get('all', "false")
                estadoPago = request.GET.get('estado_pago', None)
                limit = ""
                fechaActual = datetime.date.today()
                totalEventos = request.GET.get("total", "false")
                ordenFecha = request.GET.get('fecha', "fecha_registro")
                orderType = order(request)

                if totalEventos == "true":
                    query = """
                        SELECT COUNT(*) AS total FROM eventos WHERE estado=null AND DATE(fecha_evento_inicio)  >= '{}'
                    """.format(fechaActual)
                    cursor.execute(query)
                    proximos = dictfetchall(cursor)
                    query = """
                        SELECT COUNT(*) AS total FROM eventos WHERE estado_pago=0 AND DATE(fecha_evento_inicio) >= '{}'
                    """.format(fechaActual)
                    cursor.execute(query)
                    sin_pagos = dictfetchall(cursor)
                    query = """
                            SELECT 
                              COUNT(CASE WHEN EXISTS (
                                SELECT 1
                                FROM recreadores_eventos_servicios se
                                WHERE se.evento_id = e.id
                              ) THEN NULL ELSE 1 END) AS total
                            FROM 
                              eventos e
                            WHERE e.estado=null AND DATE(e.fecha_evento_inicio) >= '{}'
                    """.format(fechaActual)
                    cursor.execute(query)
                    sin_recreador = dictfetchall(cursor)
                    datos = {
                        "status": True,
                        "message": f"{MESSAGE['exitoGet']}",
                        "data": {
                            "proximos":proximos[0]["total"],
                            "sin_pagos":sin_pagos[0]["total"],
                            "sin_recreador":sin_recreador[0]["total"],
                        }
                    }
                    return JsonResponse(datos)
                
                if ordenFecha =="fecha_registro":
                    ordenFecha ="eve.fecha_registro"
                elif ordenFecha =="fecha_evento":
                    ordenFecha ="eve.fecha_evento_inicio"

                where = []
                estado = request.GET.get('estado', None)
                cliente = request.GET.get('cliente', None)
                servicio = request.GET.get('servicio', None)
                fecha = peridoFecha(request, ordenFecha)
                search = request.GET.get('search', None)
                search = determinar_valor(search)
                if(search['valor'] and search['type']=="int"):
                    where.append(f"eve.id LIKE '{search['valor']}%%'" )
                elif(search['valor'] and search['type']=="str"):
                    str_validate = edit_str(search["valor"])
                    where.append(f"CONCAT(per.nombres, ' ', per.apellidos) LIKE '{str_validate}'" )

                if(estado=="not_cancel"):
                    where.append(f"(eve.estado=1 OR eve.estado IS NULL)")
                elif(estado=="null"):
                    where.append(f"eve.estado IS NULL")
                elif(estado):
                    where.append(f"eve.estado={estado}")

                if(cliente):
                    where.append(f"cli.id={int(cliente)}")
                if(servicio):
                    where.append(f"eveser.servicio_id={int(servicio)}")
                if(fecha):
                    where.append(f"{fecha}")
                if(estadoPago):
                    if(estadoPago=="not_page"):
                        where.append(f"NOT eve.estado_pago={0}")
                    elif(int(estadoPago)==0):
                        where.append(f"eve.estado_pago={0}")
                    elif(int(estadoPago)==1):
                        where.append(f"eve.estado_pago={1}")
                    elif(int(estadoPago)==2):
                        where.append(f"eve.estado_pago={2}")

                where = filtrosWhere(where)

                if(all == "true"):
                    limit=""
                else:
                    limit=f"LIMIT {inicio}, {final}"

                query = """
                SELECT 
                    eve.id,
                	eve.fecha_evento_inicio,
                    eve.fecha_evento_final,
                    per.nombres, 
                    per.apellidos, 
                    tipo.nombre AS tipo_documento, 
                    per.numero_documento,
                    eve.numero_personas,
                    eve.estado_pago,
                    eve.direccion,
                    eve.fecha_registro,
                    eve.estado
                FROM eventos AS eve
                LEFT JOIN clientes AS cli ON eve.cliente_id=cli.id
                LEFT JOIN personas AS per ON cli.persona_id=per.id
                LEFT JOIN tipos_documentos AS tipo ON per.tipo_documento_id=tipo.id
                INNER JOIN servicios_eventos AS eveser ON eveser.evento_id=eve.id
                {}
                ORDER BY eve.id {} {};
                """.format(where, orderType, limit)
                cursor.execute(query)
                eventos = dictfetchall(cursor)
                if(all == "false"):
                    for evento in eventos:
                        evento["estado_pago_descripcion"]=estadoPagoDescription(evento["estado_pago"])
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
                        'status': True,
                        'message': f"{MESSAGE['errorRegistrosNone']}",
                        'data': None,
                        'pages': None,
                        'total': 0,
                    }
           
            return JsonResponse(datos)
        except Exception as error:
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

    def put(self, request, id):
        try:
            cursor = connection.cursor()
            req = json.loads(request.body)
            verify = verify_token(req['headers'])
            permisos = verify['info']['permisos']
            req = req['body']
            fechaActual = datetime.datetime.now()
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)

            if(not (bool(verify['info']['administrador']) or 12 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
                
            evento = list(Eventos.objects.filter(id=id).values())
            if len(evento) > 0:
                evento = Eventos.objects.get(id=id)
            else:
                datos = {'status': False, 'message': MESSAGE['errorEvento'],}
                return JsonResponse(datos)
            if req['estado']==False:
                if evento.estado == True:
                    datos = {'status': False, 'message': MESSAGE['errorEventoCompletado'],}
                    return JsonResponse(datos)
                if fechaActual > evento.fecha_evento_final:
                    datos = {'status': False, 'message': MESSAGE['errorEventoPasado']}
                    return JsonResponse(datos)
                EventosRecreadoresServicios.objects.filter(evento=id).delete()
                Pagos.objects.filter(evento=id, tipo=2 ).delete()

                if(evento.estado_pago==2):
                    evento.estado_pago=3

                evento.estado=False
                evento.motivo_cancelacion = req['motivo_cancelacion']
                evento.recreadores_asignados=False
                evento.save()
                objetEventoEmail={
                    "nombre":f"{evento.cliente.persona.nombres} {evento.cliente.persona.apellidos}",
                    "documento":f"{evento.cliente.persona.tipo_documento.nombre} {evento.cliente.persona.numero_documento}",
                    "codigo":formato_id(evento.id),
                    "direccion":evento.direccion,
                    "fecha_inicio":evento.fecha_evento_inicio.strftime("%d de %B de %Y a las %I:%M %p"),
                }
                emailEventoCancelado(evento.cliente.persona.correo, objetEventoEmail)
                datos = {'status': True, 'message': MESSAGE['eventoCancelado']}
            
            elif req['estado']==True:
                if evento.estado == False:
                    datos = {'status': False, 'message': MESSAGE['errorEventoCancelado'],}
                    return JsonResponse(datos)
                if evento.fecha_evento_inicio < fechaActual and not bool(verify['info']['administrador']):
                    datos = {'status': False, 'message': MESSAGE['errorEventoNoTranscurrido']}
                    return JsonResponse(datos)
                if evento.estado_pago!=2 :
                    datos = {'status': False, 'message': MESSAGE['errorEventoNoPagado']}
                    return JsonResponse(datos)

                queryInventario="""
                    SELECT 
                        m.id,
                        m.nombre,
                        m.total,
                        sm.cantidad,
                        CASE 
                            WHEN sm.cantidad > m.total THEN 0 
                            ELSE 1 
                        END AS disponible
                    FROM 
                      materiales m
                      INNER JOIN servicios_materiales sm ON m.id = sm.material_id
                      INNER JOIN servicios s ON sm.servicio_id = s.id
                      INNER JOIN servicios_eventos se ON s.id = se.servicio_id
                    WHERE 
                      se.evento_id = %s
                """
                cursor.execute(queryInventario, [id])
                materiales=dictfetchall(cursor)
                materialInsuficiente=[int(material['disponible']) for material in materiales ]
                if(0 in materialInsuficiente):
                    datos = {'status': False, 'message': MESSAGE['inventarioNone']}
                    return JsonResponse(datos)
                for material in materiales:
                    materialGet=Materiales.objects.get(id=int(material['id']))
                    materialGet.total=materialGet.total - int(material['cantidad'])
                    materialGet.save()
                    RegistrosMateriales.objects.create(
                        material=materialGet, 
                        cantidad=int(material['cantidad']), 
                        total=materialGet.total, 
                        tipo=0,
                        descripcion=f"Uso en el Evento {formato_id(evento.id)}"
                    )

                objetEventoEmail={
                    "nombre":f"{evento.cliente.persona.nombres} {evento.cliente.persona.apellidos}",
                    "documento":f"{evento.cliente.persona.tipo_documento.nombre} {evento.cliente.persona.numero_documento}",
                    "codigo":formato_id(evento.id),
                    "direccion":evento.direccion,
                    "fecha_inicio":evento.fecha_evento_inicio.strftime("%d de %B de %Y a las %I:%M %p"),
                    "fecha_final":evento.fecha_evento_final.strftime("%d de %B de %Y a las %I:%M %p")
                }
                emailEventoCompleto(evento.cliente.persona.correo, objetEventoEmail)
                evento.estado=True
                evento.save()
                datos = {'status': True, 'message': MESSAGE['eventoCompletado']}
            else:
                datos = {'status': False, 'message': MESSAGE['errorEstado']}
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