from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.db import IntegrityError, connection, models
from ..models import Materiales, RegistrosMateriales
from ..utils.indice import indiceFinal, indiceInicial
from ..utils.serializador import dictfetchall
from ..utils.identificador import determinar_valor, normalize_id_list
from ..utils.token import verify_token
from ..utils.filtros import order, filtrosWhere, peridoFecha
from ..message import MESSAGE
import json
import datetime


# CRUD COMPLETO DE LA TABLA DE materiales
class Estadistica_View(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

  
    def get(self, request):
        try:
            cursor = connection.cursor()
            verify = verify_token(request.headers)
            if not verify["status"]:
                datos = {
                    "status": False,
                    "message": verify["message"],
                }
                return JsonResponse(datos)
            if(not (bool(verify['info']['administrador']) or 9 in verify['info']['permisos'])):
                datos = {
                    'status': False,
                    'message': MESSAGE['NonePermisos'],
                }
                return JsonResponse(datos)

            pagos = request.GET.get("pagos", False)
            servicios = request.GET.get("servicios", False)
            recreadores = request.GET.get("recreadores", False)
            eventos = request.GET.get("eventos", False)
            eventos_estado = request.GET.get("eventos_estado", False)
            preguntas = request.GET.get("preguntas", False)
            todo = request.GET.get("todo", False)
            año = request.GET.get("año", datetime.date.today().year)

            data={}

            if(preguntas=="true"):

                if todo=="true":
                    todo=""
                else:
                    todo="""
                        WHERE 
                        pe.estado = 1
                    """
                query="""
                SELECT 
                    pe.id AS pregunta_id,
                    pe.pregunta,
                    AVG(ee.evaluacion) AS promedio_evaluacion
                FROM 
                    eventos_preguntas_evento ee
                INNER JOIN 
                    preguntas_eventos pe ON ee.pregunta_id = pe.id
                {}
                GROUP BY 
                    pe.id
                ORDER BY 
                    promedio_evaluacion DESC;
                """.format(todo)
                cursor.execute(query)
                preguntas=dictfetchall(cursor)
                data["preguntas"]=preguntas

            if(recreadores=="true"):

                query="""
                SELECT 
                    r.id,
                    p.nombres,
                    p.apellidos,
                    AVG(COALESCE(esr.evaluacion_recreador, 0)) AS evaluacion
                FROM 
                    recreadores_eventos_servicios esr
                JOIN 
                    recreadores r ON esr.recreador_id = r.id
                JOIN 
                    personas p ON r.persona_id = p.id
                GROUP BY 
                    esr.recreador_id
                ORDER BY 
                    evaluacion DESC;
                """
                cursor.execute(query)
                recreadores=dictfetchall(cursor)
                data["recreadores"]=recreadores

            if(pagos=="true"):

                query="""
                SELECT 
                	MONTH(p.fecha_registro ) AS id,
                    DATE_FORMAT(p.fecha_registro, '%M') AS month,
                    SUM(p.monto) AS total_monto
                FROM 
                    pagos p
                WHERE 
                    YEAR(p.fecha_registro) = {}
                GROUP BY 
                    DATE_FORMAT(p.fecha_registro, '%M')
                ORDER BY 
                    id ASC;
                """.format(año)
                cursor.execute(query)
                pagos=dictfetchall(cursor)
                data["pagos"]=pagos

            if(servicios=="true"):
                query="""
                SELECT 
                    s.id,
                    s.nombre,
                    COUNT(se.servicio_id) AS contador
                FROM 
                    servicios_eventos se
                JOIN 
                    eventos e ON se.evento_id = e.id
                JOIN 
                    servicios s ON se.servicio_id = s.id
                WHERE 
                    e.estado = 1 AND 
                    YEAR(e.fecha_evento_inicio) = {}
                GROUP BY 
                    se.servicio_id
                ORDER BY 
                    contador DESC;
                """.format(año)
                cursor.execute(query)
                servicios=dictfetchall(cursor)
                data["servicios"]=servicios

            if(eventos=="true"):
                query="""
                SELECT 
                	MONTH(fecha_evento_inicio ) AS id,
                    DATE_FORMAT(fecha_evento_inicio, '%M') AS mont,
                    COUNT(*) AS count
                FROM 
                    eventos
                WHERE 
                    YEAR(fecha_evento_inicio) = {} AND estado=1
                GROUP BY 
                    DATE_FORMAT(fecha_evento_inicio, '%M')
                ORDER BY 
                    id;
                """.format(año)
                cursor.execute(query)
                evento=dictfetchall(cursor)
                data["evento"]=evento

            if(eventos_estado=="true"):
                query="""
                SELECT 
                    estado,
                    COUNT(*) AS count
                FROM 
                    eventos
                WHERE 
                    YEAR(fecha_evento_inicio) = {}
                    AND (estado IS NULL OR estado = 1 OR estado = 0)
                GROUP BY 
                    estado
                ORDER BY 
                    estado;
                """.format(año)
                cursor.execute(query)
                estado=dictfetchall(cursor)
                data["estado"]=estado


            datos = {
                "status": True,
                "message": "Estadisticas Consuladas",
                "data": data
            }
            
            return JsonResponse(datos)
        except Exception as error:
            print(error)
            datos = {
                "status": False,
                "message": f"{MESSAGE['errorConsulta']}: {error}",
                "data": None,
                "pages": 0,
                "total": 0,
                "total_material": 0
            }
            return JsonResponse(datos)
        finally:
            cursor.close()
            connection.close()
