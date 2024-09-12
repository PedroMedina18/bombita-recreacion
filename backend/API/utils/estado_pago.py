def estadoPagoDescription(estado):
    if(estado==0):
        return "Ningun Pago"
    if(estado==1):
        return "Anticipo Pagado"
    if(estado==2):
        return "Pago Completo"
    if(estado==3):
        return "Pago Completo - Con Devolución"
    
def tipoPagoDescription(estado):
    if(estado==0):
        return "Ningun Pago"
    if(estado==1):
        return "Anticipo"
    if(estado==2):
        return "Pago Faltante"
    if(estado==3):
        return "Pago Total"
    