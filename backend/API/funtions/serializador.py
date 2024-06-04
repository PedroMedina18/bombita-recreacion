
# INFO: funcion para retornar un diccionario con los campos al pasar el resulto de ejecutar una consuta en la bd
def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]