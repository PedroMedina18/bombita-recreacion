from decouple import config
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
import os
import re
import ssl
import smtplib

def emailRegistroEvento(diretionEmail, objetEvento):
    patron=r'^[a-zA-Z0-9._%+\-$!]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    current_dir = os.path.dirname(__file__)
    template_dir = os.path.join(current_dir, '../template/')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("template_evento.html")
    body = template.render(
        **objetEvento
    )

    destinatario=diretionEmail
    tituloCorreo = "Contratación de Evento Bombita Recreación"
    
    

    smg = MIMEMultipart('alternative')
    smg['From'] = CORREO
    smg['To'] = tituloCorreo
    smg['Subject'] = destinatario
    smg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(CORREO, PASSWORD)
    server.sendmail(CORREO, destinatario, smg.as_string())
    server.quit()



def emailEventoCancelado(diretionEmail, objetEvento):
    patron=r'^[a-zA-Z0-9._%+\-$!]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    current_dir = os.path.dirname(__file__)
    template_dir = os.path.join(current_dir, '../template/')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("template_cancel.html")
    body = template.render(
        **objetEvento
    )

    destinatario=diretionEmail
    tituloCorreo = "Evento Cancelado - Bombita Recreación"
    
    

    smg = MIMEMultipart('alternative')
    smg['From'] = CORREO
    smg['To'] = tituloCorreo
    smg['Subject'] = destinatario
    smg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(CORREO, PASSWORD)
    server.sendmail(CORREO, destinatario, smg.as_string())
    server.quit()

def emailEventoCompleto(diretionEmail, objetEvento):
    patron=r'^[a-zA-Z0-9._%+\-$!]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    current_dir = os.path.dirname(__file__)
    template_dir = os.path.join(current_dir, '../template/')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("template_completo.html")
    body = template.render(
        **objetEvento
    )

    destinatario=diretionEmail
    tituloCorreo = "Evento Completado - Bombita Recreación"
    
    

    smg = MIMEMultipart('alternative')
    smg['From'] = CORREO
    smg['To'] = tituloCorreo
    smg['Subject'] = destinatario
    smg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(CORREO, PASSWORD)
    server.sendmail(CORREO, destinatario, smg.as_string())
    server.quit()


def emailRegistroPago(diretionEmail, objetEvento):
    patron=r'^[a-zA-Z0-9._%+\-$!]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    current_dir = os.path.dirname(__file__)
    template_dir = os.path.join(current_dir, '../template/')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("template_facture.html")
    body = template.render(
        **objetEvento
    )

    destinatario=diretionEmail
    tituloCorreo = "Evento Cancelado - Bombita Recreación"
    
    

    smg = MIMEMultipart('alternative')
    smg['From'] = CORREO
    smg['To'] = tituloCorreo
    smg['Subject'] = destinatario
    smg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(CORREO, PASSWORD)
    server.sendmail(CORREO, destinatario, smg.as_string())
    server.quit()


    patron=r'^[a-zA-Z0-9._%+\-$!]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not (re.match(patron, diretionEmail)):
        return
    PASSWORD = config('PASSWORDCORREO')
    CORREO = config('CORREO')

    current_dir = os.path.dirname(__file__)
    template_dir = os.path.join(current_dir, '../template/')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("template_facture.html")
    body = template.render(
        **objetEvento
    )

    destinatario=diretionEmail
    tituloCorreo = "Recibo de pago - Bombita Recreación"
    
    

    smg = MIMEMultipart('alternative')
    smg['From'] = CORREO
    smg['To'] = tituloCorreo
    smg['Subject'] = destinatario
    smg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(CORREO, PASSWORD)
    server.sendmail(CORREO, destinatario, smg.as_string())
    server.quit()