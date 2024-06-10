# from django.shortcuts import render
# from django.http.response import JsonResponse
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
# from django.views import View
# from pyDolarVenezuela.pages import AlCambio, BCV, CriptoDolar, ExchangeMonitor, Italcambio
# from pyDolarVenezuela import Monitor
# from ..funtions.indice import indiceFinal, indiceInicial
# from ..funtions.serializador import dictfetchall
# from ..models import PrecioDolar
# from ..funtions.token import verify_token
# from ..funtions.editorOpciones import editorOpciones
# from django.db import IntegrityError, connection, models
# from ..message import MESSAGE
# import json

# # CRUD COMPLETO DE LA TABLA DE CARGOS

# class Dollar_View(View):
#     @method_decorator(csrf_exempt)
#     def dispatch(self, request, *args, **kwargs):
#         return super().dispatch(request, *args, **kwargs)
    
#     def get(self, request, id=0):

#         try:
#             # cursor = connection.cursor()
#             # verify=verify_token(request.headers)
#             # if(not verify['status']):
#             #     datos = {
#             #         'status': False,
#             #         'message': verify['message'],
#             #         'data': None
#             #     }
#             #     return JsonResponse(datos)
#             monitor = Monitor(ExchangeMonitor, 'USD')

#             # Obtener los valores de todos los monitores
#             valores_dolar = monitor.get_value_monitors()
#             print(valores_dolar)
#             # Obtener el valor del dólar en EnParaleloVzla
#             valor_dolar = monitor.get_value_monitors('banks')

#             print(valor_dolar)
#             datos = {
#                 'status': False,
#                 'message': f"{MESSAGE['errorRegistroNone']}",
#                 'data': None,
#             }
#             return JsonResponse(datos)
#         except Exception as error:
#             print(f"{MESSAGE['errorGet']} - {error}")
#             datos = {
#                 'status': False,
#                 'message': f"{MESSAGE['errorConsulta']}: {error}",
#                 'data': None,
#                 'pages': None,
#                 'total':0
#             }
#             return JsonResponse(datos)