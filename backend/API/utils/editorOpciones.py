from .serializador import dictfetchall


# INFO: sirve para agregar y eliminar registros en una tabla intermedia dependiendo de una lista de indices 
def editorOpciones(registros, id, tablaIntermedia, tablaAgregar, itemGet, list_new_registros, **kwargs):
    # convertimos una listas de ids
    list_id_registros = [item['id'] for item in registros]
    # se buscan que registros hay que eliminar
    eliminar = [id for id in list_id_registros if id not in list_new_registros]
    for item in eliminar:
        filter_kwargs = {kwargs['filtro_principal']: id, kwargs['filtro_secundario']: item}
        tablaIntermedia.objects.filter(**filter_kwargs).delete()
    agregar = [id for id in list_new_registros if id not in list_id_registros]
    for item in agregar:
        item = tablaAgregar.objects.get(id=item)
        create_kwargs = {kwargs['campo_principal']: itemGet, kwargs['campo_secundario']: item}
        tablaIntermedia.objects.create(**create_kwargs)