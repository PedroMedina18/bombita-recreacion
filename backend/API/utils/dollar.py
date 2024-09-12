import datetime
from .serializador import dictfetchall
from ..models import PrecioDolar
from ..message import MESSAGE
import requests

def consultDollar(cursor):
    ultimo_registro = ultimoRegistro(cursor)
    if(not ultimo_registro["status"]):
        dollar={
            'status':False,
            'message':MESSAGE["errorDollar"],
            'price':'0.0',
            'fecha':datetime.datetime.now(),
        }
        return dollar
    # Obtener la fecha y hora actuales del servidor
    fecha_hora_actual = datetime.datetime.now()
    ultimo_registro = ultimo_registro["dolar"]

    # si el registro es del mismo dia pero superior a las 12:00PM se devuelve el mismo registro
    if ultimo_registro and ultimo_registro["fecha_registro"] >= fecha_hora_actual.replace(hour=12, minute=0, second=0):
        dollar={
            'status':True,
            'message':"Exito",
            'price':ultimo_registro["precio"],
            'fecha':ultimo_registro["fecha_registro"],
        }
        return dollar

    # si el registro es menor que las 12:00PM y mayor que las 1:00 AM de ese mismo dia se devuelve el mismo registro
    elif ultimo_registro and ultimo_registro["fecha_registro"] <= fecha_hora_actual.replace(hour=12, minute=0, second=0)  and ultimo_registro["fecha_registro"] >= fecha_hora_actual.replace(hour=1, minute=0, second=0):
        dollar={
            'status':True,
            'message':"Exito",
            'price':ultimo_registro["precio"],
            'fecha':ultimo_registro["fecha_registro"],
        }
        return dollar
    # si no se cumple esas condiciones hay que buscar el precio del dollar
    
    else:
        dollar = registroDollar(cursor)
        return dollar

def registroDollar(cursor):
    try:
        dollar = requests.get('https://pydolarve.org/api/v1/dollar?page=bcv', timeout=2.00)
        data=dollar.json()
        precioDollarBCV=data['monitors']['usd']['price']
        PrecioDolar.objects.create(precio=precioDollarBCV, fecha_registro=datetime.datetime.now())
        dollar={
                'status':True,
                'message':MESSAGE["exitoGet"],
                'price':precioDollarBCV,
                'fecha':datetime.datetime.now(),
            }
        return dollar
    except requests.exceptions.ReadTimeout as e:
        dollar={
            'status':False,
            'message':MESSAGE["errorDollar"],
            'price':'0.0',
            'fecha':datetime.datetime.now(),
        }
        return dollar
    except Exception as e:
        dollar={
            'status':False,
            'message':MESSAGE["errorDollar"],
            'price':'0.0',
            'fecha':datetime.datetime.now(),
        }
        return dollar

def ultimoRegistro(cursor):
     # Consultar el último registro de la tabla
    try:
        query = """
        SELECT 
            * 
        FROM precio_dolar 
        ORDER BY fecha_registro DESC
        LIMIT 1
        """
        cursor.execute(query)
        ultimo_registro = dictfetchall(cursor)

        datos = {
            'status': True,
            'dolar': ultimo_registro[0],
        }
        return datos
    except Exception as error:
        datos = {
            'status': False,
            'dolar': None,
        }
        return datos

