
import dayjs from 'dayjs'
import "dayjs/locale/es.js"
import updateLocale from 'dayjs/plugin/updateLocale.js'


const dayjsEs=({ weekdaysAbre=true, monthsAbre=true }={})=>{
    dayjs.locale("es")

    dayjs.extend(updateLocale)
    const weekdaysShort = weekdaysAbre ?
    [
        "Dom.",
        "Lun.",
        "Mar.",
        "Mié.",
        "Jue.",
        "Vie.",
        "Sáb.",
    ]
    :
    [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ]

    const monthsShort= monthsAbre ?
    [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
        ]
        :
        [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ]

    dayjs.updateLocale('es', {
        months: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ],
        weekdays: [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ],
        weekdaysShort: weekdaysShort,
        monthsShort : monthsShort,
    })

    return dayjs
}

export default dayjsEs