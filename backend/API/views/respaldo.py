from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from ..funtions.respaldo import respaldo
from ..funtions.token import verify_token
from ..message import MESSAGE

class Respaldo(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        try:
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {"status": False, "message": verify["message"], "data": None}
                return JsonResponse(datos)
            
            respaldando = respaldo()
            if respaldando:
                datos = {
                    'status': True,
                    'message': MESSAGE['respaldoExit']
                }
            else:
                datos = {
                    'status': False,
                    'message': MESSAGE['errorProcces']
                }
            return JsonResponse(datos)
        except Exception as error:
            print(f"Error Respaldo: {error}")
            datos = {
                'status': False,
                'message': MESSAGE['errorRespaldo']
            }
            return JsonResponse(datos)
            
