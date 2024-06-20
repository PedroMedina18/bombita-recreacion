from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.indice import indiceFinal, indiceInicial
from ..funtions.serializador import dictfetchall
from ..models import Eventos, EventosSobrecargos, Clientes, Personas, Servicios, PrecioDolar
from django.db import IntegrityError, connection, models
from ..funtions.token import verify_token
import json



class Eventos_Views(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, identificador=0):
        pass