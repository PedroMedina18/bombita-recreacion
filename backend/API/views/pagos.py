from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..utils.serializador import dictfetchall
from ..utils.identificador import formato_id
from ..utils.estado_pago import tipoPagoDescription
from ..utils.email import emailRegistroPago
from ..models import MetodosPago, Eventos, Pagos, PrecioDolar
from django.db import IntegrityError, connection, models
from ..message import MESSAGE
from ..utils.token import verify_token
import json
import functools


# CRUD COMPLETO DE LA TABLA DE metodos_pago
class Pagos_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            req = request.POST
            cursor = connection.cursor()
            imgs = request.FILES
            verify = verify_token(request.headers)
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 6 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)
            if int(req['tipo_pago'])==1 or int(req['tipo_pago'])==2 or int(req['tipo_pago'])==3 :
                tipo = int(req['tipo_pago'])
            else:
                datos = {
                    'status': False,
                    'message': MESSAGE['tipoPago'],
                }
                return JsonResponse(datos)

            pagos = json.loads(req['pagos'])
            if (pagos == []):
                datos = {
                    'status': False,
                    'message': MESSAGE['errorPago'],
                }
                return JsonResponse(datos)
            precio_dolar = PrecioDolar.objects.latest('id')
            evento = list(Eventos.objects.filter(id=int(req['evento'])).values("id"))
            if(len(evento)>0):
                evento = Eventos.objects.get(id=int(req['evento']))
            else:
                datos = {
                    'status': False,
                    'message':  MESSAGE["errorEvento"],
                }
                return JsonResponse(datos)
            if evento.estado == False:
                datos = {
                    'status': False,
                    'message':  MESSAGE["errorEventoCancelado"],
                }
                return JsonResponse(datos)
            objetEventoEmail={
                    "nombre":f"{evento.cliente.persona.nombres} {evento.cliente.persona.apellidos}",
                    "documento":f"{evento.cliente.persona.tipo_documento.nombre}-{evento.cliente.persona.numero_documento}",
                    "codigo":formato_id(evento.id),
                    "metodos_pagos":[],
                    "tipo_pago":"",
                    "totalEventoDolares":0,
                    "totalEventoBolivares":0,
                    "totalPagoDolares":0,
                    "totalPagoBolivares":0,
                    "montoFaltante":False,
                    "faltanteDolares":0,
                    "faltanteBolivares":0,
                    "montoCancelado":False,
                    "canceladoDolares":0,
                    "canceladoBolivares":0,

                }
            querySobrecostos="""
                SELECT COALESCE(SUM(s.monto), 0) AS total_sobrecosto
                    FROM sobrecostos_eventos es
                    JOIN sobrecostos s ON es.sobrecosto_id = s.id
                WHERE es.evento_id = %s;
            """
            cursor.execute(querySobrecostos, [int(req['evento'])])
            totalSobrecosto = dictfetchall(cursor)
            totalSobrecosto = float(totalSobrecosto[0]["total_sobrecosto"])
            queryServicios = """
                SELECT COALESCE(SUM(s.precio), 0) AS total_servicio
                    FROM servicios_eventos es
                    JOIN servicios s ON es.servicio_id = s.id
                WHERE es.evento_id = %s;
            """
            cursor.execute(queryServicios, [int(req['evento'])])
            totalServicio = dictfetchall(cursor)
            totalServicio = float(totalServicio[0]["total_servicio"])
            queryPagos="""
                SELECT COALESCE(SUM(pa.monto), 0) AS total_pagado
                    FROM pagos pa
                WHERE pa.evento_id = %s;
            """
            cursor.execute(queryPagos, [int(req['evento'])])
            totalPagado = dictfetchall(cursor)
            totalPagado = float(totalPagado[0]["total_pagado"])
            if(bool(totalPagado)):
                objetEventoEmail["montoCancelado"]=True
                objetEventoEmail["canceladoDolares"]=float(totalPagado)
                objetEventoEmail["canceladoBolivares"]=float(totalPagado * precio_dolar.precio)
            totalEvento=totalServicio+totalSobrecosto
            objetEventoEmail["totalEventoDolares"]=float(totalEvento)
            objetEventoEmail["totalEventoBolivares"]=float(totalEvento * precio_dolar.precio)
            totalFaltante=totalEvento - totalPagado
            totalCancelar=sum(float(pago['monto']) for pago in pagos)

            objetEventoEmail["totalPagoDolares"]=float(totalCancelar)
            objetEventoEmail["totalPagoBolivares"]=float(totalCancelar * precio_dolar.precio)

            if totalCancelar>totalFaltante:
                datos = {
                    'status': False,
                    'message':  MESSAGE["errorMontoSuperior"],
                }
                return JsonResponse(datos)

        
            for indice, pago in enumerate(pagos):
                metodo_pago = MetodosPago.objects.get(id = int(pago['metodo_pago']))
                pagoEvento = Pagos.objects.create(tipo = tipo, evento = evento, metodoPago = metodo_pago, monto = float(pago['monto']), precioDolar = precio_dolar)
                objetEventoEmail['metodos_pagos'].append({"nombre":metodo_pago.nombre, "montoDolares":float(pago['monto']), "montoBolivares":float(int(pago['monto']) * precio_dolar.precio)})
                if 'referencia' in pago:
                    pagoEvento.referencia = int(pago['referencia'])
                    pagoEvento.save()
                if f"capture_{int(req['evento'])}_{int(pago['metodo_pago'])}_{indice}" in imgs:
                    pagoEvento.capture = imgs[f"capture_{int(req['evento'])}_{int(pago['metodo_pago'])}_{indice}"]
                    pagoEvento.save()

            if tipo == 1:
                evento.estado_pago=1
                objetEventoEmail["montoFaltante"]=True
                objetEventoEmail["faltanteDolares"]=float(totalFaltante)
                objetEventoEmail["faltanteBolivares"]=float(totalFaltante * precio_dolar.precio)
            if tipo == 2 or tipo == 3 or totalCancelar == totalFaltante:
                evento.estado_pago=2
            objetEventoEmail['tipo_pago']=tipoPagoDescription(tipo)
            
            evento.save()
            emailRegistroPago(evento.cliente.persona.correo, objetEventoEmail)
            datos = {
                'status': True,
                'message': f"{MESSAGE['registerPago']}"
            }
            return JsonResponse(datos)

        except IntegrityError as error:
            print(f"{MESSAGE['errorIntegrity']} - {error}", )
            if error.args[0] == 1062:
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
        finally:
            cursor.close()
            connection.close()