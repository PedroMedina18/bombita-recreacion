import datetime


def order(request):
    order = request.GET.get('order', 'DESC')
    if not(order == 'ASC') and not(order == 'DESC'):
        order = 'DESC'
    return order

def filtrosWhere(filtros=[]):
    if(len(filtros)==0):
        return ""
    else:
        where = "WHERE"
        for i, filtro  in enumerate(filtros):
            operador = 'AND' if (i>0) else ''
            where = where + " " +  operador + " " + filtro.strip()
        return where
    
def peridoFecha(request, nameFecha):
    try:
        desde = request.GET.get('desde', None)
        hasta = request.GET.get('hasta', datetime.date.today().strftime("%d-%m-%Y"))
        hasta = datetime.datetime.strptime(str(hasta), "%d-%m-%Y").date()
        if desde:
            desde = datetime.datetime.strptime(desde, "%d-%m-%Y").date()
            query = f"DATE({str(nameFecha)}) BETWEEN '{desde}' AND '{hasta}'"
        else:
            query = f"DATE({str(nameFecha)}) <= '{hasta}'"
        return query 
    except Exception as error:
        print(error)
        return False
    
    
