import os
import pyzipper
from datetime import datetime
from decouple import config
from threading import Timer


# Datos de Fecha y Hora
fechaActual = datetime.now()
fechaHora = fechaActual.strftime('%d-%m-%Y')
año = fechaActual.strftime('%Y')
mes = fechaActual.strftime('%B')


# ruta donde se guarda el respaldo
rutaRespaldo = config('RUTA_RAIZ') + f"\\respaldo_bombita_recreacion\\{año}\\{mes}"

def respaldo():
    
    os.makedirs(rutaRespaldo, exist_ok = True)
    
    # Nombre del archivo
    respaldo = rutaRespaldo + f"\\respaldo_{fechaHora}.sql"


    # ubicacion del mysql
    pathBase = config('RUTA_RAIZ') + "\\xampp\\mysql\\bin\\mysqldump"

    pasword = config('PASSWORD')

    pathPasword = f"p {pasword} " if pasword else " "
    
    try:
        print("CARGANDO ....")
        os.popen(pathBase + f" -h localhost -u {config('USER')}"+ pathPasword + f"{config('NAME_BASE_DATOS')} > " + respaldo)
    except PermissionError as e:
        print(f"Error de permisos: {e}")
    except OSError as e:
        print(f"Error de sistema: {e}")
    except Exception as e:
        print(f"Error desconocido: {e}")
        exit
    finally:
        t= Timer(20, lambda: comprimir(respaldo))
        t.start()
        
    

def comprimir(rutaArchivo):
    password  = config('KEYZIP')

    passworZip = bytes(password, "utf-8")

    #archivo zip
    archivoZip = rutaRespaldo + f"\\respaldo_{fechaHora}.zip"

    try:
        with pyzipper.AESZipFile(archivoZip, 'w', compression=pyzipper.ZIP_DEFLATED, encryption=pyzipper.WZ_AES) as zip_file:
            zip_file.setpassword(passworZip)
            zip_file.write(rutaArchivo, f'respaldo_{fechaHora}.sql')
        print(f"Respaldo COMPLETADO {rutaArchivo}")
        os.remove(rutaArchivo)
    except Exception as e:
        print(f"Error desconocido: {e}")

