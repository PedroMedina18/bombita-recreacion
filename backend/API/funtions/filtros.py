import datetime


def order(request):
    order = request.GET.get('order', 'ASC')
    if not(order == 'ASC') and not(order == 'DESC'):
        order = 'ASC'
    return order

def typeOrder(request):
    order = request.GET.get('organizar', 'orig')
    if order == "alf":
        return True
    elif order == "orig":
        return False
    else:
        return False

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
        hasta = request.GET.get('hasta', datetime.date.today())
        hasta = datetime.datetime.strptime(hasta, "%Y-%m-%d").date()
        if desde:
            desde = datetime.datetime.strptime(desde, "%Y-%m-%d").date()
            query = f"DATE({str(nameFecha)}) BETWEEN '{desde}' AND '{hasta}';"
        else:
            query = f"DATE({str(nameFecha)}) <= '{hasta}';"
            
        return query 
    except:
        return False
    
    
