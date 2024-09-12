from werkzeug.security import generate_password_hash, check_password_hash

def encriptado_constraseña(text):
    texto_encriptado=generate_password_hash(text, 'pbkdf2:sha256', 30)
    return texto_encriptado

def desencriptado_contraseña(texto_encriptado, contraseña):
    respuesta=check_password_hash(texto_encriptado, contraseña)
    return(respuesta)