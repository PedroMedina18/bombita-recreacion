from decouple import config
from email.message import EmailMessage
import os
import re
import ssl
import smtplib

def emailRegistroEvento(diretionEmail):
    patron=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    tituloCorreo = "Contratación  de servicio de Recreadores Bombita Recreación"
    body = """
        Usted a contradato nuestros servicios gracia :)
    """

    em = EmailMessage()
    em['From'] = CORREO
    em['To'] = diretionEmail
    em['Subject'] = tituloCorreo
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(CORREO, PASSWORD)
        smtp.send_message(em)


def emailRegistroPago(diretionEmail):
    patron=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    tituloCorreo = 'Registro de Pagos'
    body = """
        Usted realizado un pago muchas gracias
    """

    em = EmailMessage()
    em['From'] = CORREO
    em['To'] = diretionEmail
    em['Subject'] = tituloCorreo
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(CORREO, PASSWORD)
        smtp.send_message(em)