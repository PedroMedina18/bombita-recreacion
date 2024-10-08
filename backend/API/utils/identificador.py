
# INFO: Para determinar si la variable es un string o un int 
# ALERT: solo funciona con esos dos tipos de datos 
def determinar_valor(variable):
    if(not variable):
        return {'type':'null', 'valor':None}
    try:
        numero=int(variable)
        return {'type':'int', 'valor':numero}
    except ValueError:
        string=str(variable)
        if(string==""):
            return {'type':'str', 'valor':None}
        return {'type':'str', 'valor':string}

# INFO: funcion para editar un string y añadir % % al inicio y final de cada palabra
def edit_str(input_str):
    # *Convertir la cadena de entrada a minúsculas.
    input_str = input_str.lower()
    # *Elimina todos los espacios de la cadena de entrada.
    input_str = input_str.replace(' ', '_')
    # *Dividir la cadena de entrada en una lista de palabras.
    words = input_str.split('_')
    # *Crea una nueva lista para almacenar las palabras editadas.
    edited_words = []
    # *Iterar sobre la lista de palabras.
    for word in words:
        # *agréguela a la lista de palabras editadas con un signo '%' a cada lado.
        edited_words.append('%%' + word + '%%')
    # *Unir la lista de palabras editadas en una sola cadena.
    edited_str = '_'.join(edited_words)
    # *Devuelve la cadena editada.
    return edited_str

def returnBoolean(str):
    if str == 'true':
        return True
    elif str == 'false':
        return False
    else:
        return str


def normalize_id_list(param):
    if isinstance(param, list):
        return param
    elif isinstance(param, str):
        return [int(x) for x in param.split(',')]
    else:
        raise ValueError('Invalid parameter type')

def formato_id(numero):
    str_numero = str(numero)
    longitud = len(str_numero)

    if longitud < 4:
        ceros = '0' * (4 - longitud)
        return ceros + str_numero
    else:
        return str_numero