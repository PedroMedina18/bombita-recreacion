from django.shortcuts import render
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.respaldo import respaldo
import json
from ..funtions.token import verify_token


class Respaldo(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        
        respaldo()
        datos = {
            "status": True,
            'message': "Respaldo Completado"
        }
        return JsonResponse(datos)