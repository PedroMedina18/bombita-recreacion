from .serializador import dictfetchall


# INFO: sirve para agregar y eliminar registros en una tabla intermedia dependiendo de una lista de indices 
def editorOpciones(items, tablaIntermedia, tablaAgregar, itemGet, listTabla, id, **kwargs):
    ids_items = [item["id"] for item in items]
    eliminar = [num for num in ids_items if num not in listTabla]
    for item in eliminar:
        filter_kwargs = {kwargs['filtro_principal']: id, kwargs['filtro_secundario']: item}
        tablaIntermedia.objects.filter(**filter_kwargs).delete()
    agregar = [num for num in listTabla if num not in ids_items]
    for item in agregar:
        item = tablaAgregar.objects.get(id=item)
        create_kwargs = {kwargs['campo_principal']: itemGet, kwargs['campo_secundario']: item}
        tablaIntermedia.objects.create(**create_kwargs)


############ *EJEMPLO FUNCION BASE
# cursor.execute(query, [int(id)])
# permisos = dictfetchall(cursor)
# ids_permisos = [permiso["id"] for permiso in permisos]
# eliminar = [num for num in ids_permisos if num not in req["permisos"]]
# for permiso in eliminar:
#     PermisosCargos.objects.filter(cargos=id, permisos=permiso).delete()
# agregar = [num for num in req["permisos"] if num not in ids_permisos]
# for permiso in agregar:
#     permiso = Permisos.get(id=permiso)
#     PermisosCargos.objects.create(cargos=cargo, permisos=permiso)
# datos = {
#     "status": True,
#     'message': "Exito. Registro Editado"
# }