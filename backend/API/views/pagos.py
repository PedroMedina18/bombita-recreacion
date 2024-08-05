from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.serializador import dictfetchall
from ..funtions.email import emailRegistroPago
from ..models import MetodosPago, Eventos, Pagos, PrecioDolar
from django.db import IntegrityError, connection, models
from ..message import MESSAGE
from ..funtions.token import verify_token
import json


# CRUD COMPLETO DE LA TABLA DE metodos_pago
class Pagos_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            req = request.POST
            imgs = request.FILES
            verify = verify_token(request.headers)
            if (not verify['status']):
                datos = {
                    'status': False,
                    'message': verify['message'],
                }
                return JsonResponse(datos)

            if req['tipo_registro'].lower() == 'true':
                tipo = True
            elif req['tipo_registro'].lower() == 'false':
                tipo = False
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
            evento = Eventos.objects.get(id = int(req['evento']))
            for indice, pago in enumerate(pagos):
                metodo_pago = MetodosPago.objects.get(id = int(pago['metodo_pago']))
                pagoEvento = Pagos.objects.create(tipo = tipo, evento = evento, metodoPago = metodo_pago, monto = float(pago['monto']), precioDolar = precio_dolar)

                if 'referencia' in pago:
                    pagoEvento.referencia = int(pago['referencia'])
                    pagoEvento.save()
                if f"capture_{int(req['evento'])}_{int(pago['metodo_pago'])}_{indice}" in imgs:
                    pagoEvento.capture = imgs[f"capture_{int(req['evento'])}_{int(pago['metodo_pago'])}_{indice}"]
                    pagoEvento.save()
            if pagos:
                evento.total = True
            else:
                evento.anticipo = True
            evento.save()
            emailRegistroPago(evento.cliente.persona.correo)
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