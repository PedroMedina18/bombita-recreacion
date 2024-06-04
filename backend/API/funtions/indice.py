
def indiceInicial(indice):
    if indice==1:
        inicial=0
    elif indice>1:
        inicial=25*(indice-1)
    return inicial

def indiceFinal(indice):
    if indice==1:
        ultimo=25
    elif indice>1:
        ultimo=25*indice
    return ultimo