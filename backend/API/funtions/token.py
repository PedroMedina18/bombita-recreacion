from datetime import datetime, timedelta
from jwt import encode, decode, ExpiredSignatureError, InvalidSignatureError, DecodeError
from decouple import config

def new_token(user):
    fecha=datetime.now()
    fechaNew=datetime.now() + timedelta(hours=10)
    payload = {
            'iat': fecha,
            'exp': fechaNew,
            "id":user["id"],
            "nombre":user["nombre"],
            "cargo":user["cargo_id"],
            # "administrador":administrador,
            # "permisos":permisos
        }
    return {"token":encode(payload, config('TOKEN'), algorithm="HS256"), "fecha":fechaNew}

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
    datos = {'status':False,'message': 'Sin Autorizacion'}
    return datos
