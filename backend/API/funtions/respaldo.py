import os
import pyzipper
from datetime import datetime
from decouple import config
import time


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
        comprobarSize(respaldo)

def comprobarSize(respaldo):
    while True:
        try:
            archivo_size = os.path.getsize(respaldo)
            if archivo_size > 0:
                time.sleep(5)
                new_size = os.path.getsize(respaldo)
                if new_size == archivo_size:
                    comprimir(respaldo  )
                    break 
        except FileNotFoundError:
            print("Archivo no encontrado. Esperando...")
            time.sleep(5)

def comprimir(rutaArchivo):
    password  = config('KEYZIP')

    passworZip = bytes(password, "utf-8")

    #archivo zip
    archivoZip = rutaRespaldo + f"\\respaldo_{fechaHora}.zip"
    imagenes = buscar_carpeta_media()

    try:
        with pyzipper.AESZipFile(archivoZip, 'w', compression=pyzipper.ZIP_DEFLATED, encryption=pyzipper.WZ_AES) as zip_file:
            zip_file.setpassword(passworZip)
            zip_file.write(rutaArchivo, f'respaldo_{fechaHora}.sql')
            if(imagenes):
                for root, dirs, files in os.walk(imagenes):
                    for file in files:
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, imagenes)
                        zip_file.write(file_path, f'media/{rel_path}')
        print(f"Respaldo COMPLETADO {rutaArchivo}")
        os.remove(rutaArchivo)
    except Exception as e:
        print(f"Error desconocido: {e}")

def buscar_carpeta_media():
    ruta_actual = os.path.abspath(".")
    while True:
        ruta_padre = os.path.dirname(ruta_actual)
        if ruta_padre == ruta_actual:
            break
        if os.path.basename(ruta_actual) == "bombita-recreacion":
            if "media" not in os.listdir(ruta_actual):
                print("No se encontró la carpeta media en el directorio bombita_recreacion")
                return None
        for nombre_carpeta in os.listdir(ruta_actual):
            if nombre_carpeta == "media":
                return os.path.join(ruta_actual, nombre_carpeta)
        ruta_actual = ruta_padre
    return None

