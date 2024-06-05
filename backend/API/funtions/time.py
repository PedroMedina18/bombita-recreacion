
# INFO: Devuelve el total de horas y minutos al recibir el tiempo total en milisegundos
def duration(total_time):
    total_seconds = total_time / 1000000
    minutes = int(total_seconds / 60) % 60
    hours = int(total_seconds / 3600)

    return {"horas":hours, "minutos":minutes}