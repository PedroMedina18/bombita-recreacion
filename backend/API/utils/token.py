from datetime import datetime, timedelta
from jwt import encode, decode, ExpiredSignatureError, InvalidSignatureError, DecodeError
from decouple import config

#  INFO: Para crear un nuevo token
def new_token(user):
    fecha=datetime.now()
    fechaNew=datetime.now() + timedelta(hours=10)
    payload = {
            'iat': fecha,
            'exp': fechaNew,
            "id":user["id"],
            "nombre":user["usuario"],
            "administrador":user["administrador"],
            "permisos":user["permisos"] if 'permisos' in user else [],
        }
    return {"token":encode(payload, config('TOKEN'), algorithm="HS256"), "fecha":fechaNew}


#  INFO: Para verificar si el token es correcto y devolver la informacion que contiene

def verify_token(headers):
    if 'Authorization' in headers:
        authorization = headers['Authorization']
        encoded_token = authorization.split(" ")[1]
        if (len(authorization) > 0):
            try:
                payload = decode(encoded_token, config('TOKEN'), algorithms=["HS256"])
                if(payload):
                    return {'status':True,'message': 'Token valido', "info":payload}
            except DecodeError:
                datos = {'status':False,'message': 'Token Invalido'}
                return datos
            except ExpiredSignatureError:
                datos = {'status':False,'message': 'Token Expirado'}
                return datos
            except InvalidSignatureError:
                datos = {'status':False,'message': 'Firma Invalida'}
                return datos
    datos = {'status':False,'message': 'No se encontro el token. Sin Autorización'}
    return datos
