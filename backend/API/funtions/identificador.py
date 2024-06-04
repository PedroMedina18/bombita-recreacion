def determinar_valor(argumento):
    try:
        numero=int(argumento)
        return {"type":"int", "valor":numero}
    except ValueError:
        string=argumento
        return {"type":"str", "valor":string}

#  funcion para editar un string y añadir % % al inicio y final de cada palabra
def edit_str(input_str):
    # Convertir la cadena de entrada a minúsculas.
    input_str = input_str.lower()
    # Elimina todos los espacios de la cadena de entrada.
    input_str = input_str.replace(" ", "_")
    # Dividir la cadena de entrada en una lista de palabras.
    words = input_str.split("_")
    # Crea una nueva lista para almacenar las palabras editadas.
    edited_words = []
    # Iterar sobre la lista de palabras.
    for word in words:
        # agréguela a la lista de palabras editadas con un signo "%" a cada lado.
        edited_words.append("%" + word + "%")
    # Unir la lista de palabras editadas en una sola cadena.
    edited_str = "_".join(edited_words)
    # Devuelve la cadena editada.
    return edited_str