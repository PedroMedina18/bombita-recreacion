import datetime
from .serializador import dictfetchall
from ..models import PrecioDolar
import requests

def consultDollar(cursor):

    # Consultar el último registro de la tabla
    consulta = """
    SELECT 
        * 
    FROM precio_dolar 
    ORDER BY fecha_registro DESC
    LIMIT 1
    """
    cursor.execute(consulta)
    ultimo_registro = cursor.fetchone()

    # Obtener la fecha y hora actuales del servidor
    fecha_hora_actual = datetime.datetime.now()

    # si el registro es del mismo dia pero superior a las 12:00PM se devuelve el mismo registro
    if ultimo_registro and ultimo_registro[2] >= fecha_hora_actual.replace(hour=12, minute=0, second=0):
        dollar={
            "price":ultimo_registro[1],
            "fecha":ultimo_registro[2]
        }
        return dollar

    # si el registro es menor que las 12:00PM y mayor que las 1:00 AM de ese mismo dia se devuelve el mismo registro
    elif ultimo_registro and ultimo_registro[2] <= fecha_hora_actual.replace(hour=12, minute=0, second=0)  and ultimo_registro[2] >= fecha_hora_actual.replace(hour=1, minute=0, second=0):
        dollar={
            "price":ultimo_registro[1],
            "fecha":ultimo_registro[2]
        }
        return dollar
    # si no se cumple esas condiciones hay que buscar el precio del dollar
    else:
        dollar = registroDollar()
        return dollar

def registroDollar():
    dollar = requests.get('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', timeout=2.00)
    data=dollar.json()
    precioDollarBCV=data["monitors"]["usd"]["price"]
    PrecioDolar.objects.create(precio=precioDollarBCV)
    dollar={
            "price":precioDollarBCV,
            "fecha":datetime.datetime.now()
        }
    return dollar
