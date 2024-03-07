def duration(total_time):
    total_seconds = total_time / 1000000
    minutes = int(total_seconds / 60) % 60
    hours = int(total_seconds / 3600)

    return {"horas":hours, "minutos":minutes}