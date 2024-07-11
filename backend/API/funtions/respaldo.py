import os
from datetime import datetime
from decouple import config

def respaldo():
    # ruta principal
    rutaPrincipal = config('RUTA_RAIZ') + "\\respaldo_bombita_recreacion"
    
    # Datos de Fecha y Hora
    fechaActual = datetime.now()
    fechaHora = fechaActual.strftime('%d-%m-%Y')
    año = fechaActual.strftime('%Y')
    mes = fechaActual.strftime('%B')
    
    # ruta donde se guarda el respaldo
    rutaRespaldo = rutaPrincipal+f"\\{año}\\{mes}"
    os.makedirs(rutaRespaldo, exist_ok = True)
    
    
    # Nombre del archivo
    respaldo = rutaRespaldo + f"\\respaldo_{fechaHora}.sql"
    # ubicacion del mysql
    pathBase = config('RUTA_RAIZ') + "\\xampp\\mysql\\bin\\mysqldump"
    
    try:
        print("CARGANDO ....")
        os.popen(pathBase + f" -h localhost -u {config('USER')} {config('NAME_BASE_DATOS')} > " + respaldo)
        print(f"Respaldo COMPLETADO {respaldo}")
    except PermissionError as e:
        print(f"Error de permisos: {e}")
    except OSError as e:
        print(f"Error de sistema: {e}")
    except Exception as e:
        print(f"Error desconocido: {e}")
        exit
