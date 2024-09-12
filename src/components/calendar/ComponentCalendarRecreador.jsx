import React from 'react'
import ComponentCalendar from "../calendar/ComponentCalendar.jsx"
import { useNavigate } from "react-router-dom"
import dayjsEs from '../../utils/dayjs.js'
import { recreadores } from "../../utils/API.jsx";

function ComponentCalendarRecreador({ id_recreador, name = null }) {
    const dayjs = dayjsEs({ weekdaysAbre: false })
    const navigate = useNavigate()

    const eventData = (event, index) => {
        return {
            title: `Evento ${event.id}`,
            start: dayjs(event.fecha_evento_inicio).toDate(),
            end: dayjs(event.fecha_evento_final).toDate(),
            direccion: event.direccion,
            cliente: `${event.nombres} ${event.apellidos}`,
            id: event.id,
        }
    }

    const components = {
        day: {
            event: (event) => { return eventoStandar(event, true) }
        },
        week: {
            event: (event) => { return eventoStandar(event) }
        },
        month: {
            event: (event) => { return eventoStandar(event) }
        },
        agenda: {
            event: (event) => {
                return <div >
                    {event.title} - {event.event.cliente} - {event.event.direccion}
                </div>
            }
        }
    }

    const eventoStandar = (event, dataExtra = false) => {
        const day = dayjs()
        const start = dayjs(event.event.start)
        const eventosAfter = (day.isAfter(start, 'day'))
        const eventosSame = (day.isSame(start, 'day'))
        if (dataExtra) {
            return <div className={`d-flex flex-column ${eventosAfter && "bg-new bg-after"} ${eventosSame && "bg-new bg-same"}`}>
                <p className='m-0'>{event.title}</p>
                <p className='m-0'>{event.event.cliente}</p>
                <p className='m-0'>{event.event.direccion}</p>
            </div>
        } else {
            return <div className={`${eventosAfter && "bg-new bg-after"} ${eventosSame && "bg-new bg-same"}`}>
                {event.title}
            </div>
        }

    }
    return (
        <div className=' px-sm-0 px-md-1 px-4 mt-5 w-100'>
            <h6 className='text-center h3 fw-bold mb-1'>{name}</h6>
            <div className='w-100 overflow-auto scroll'>
                <ComponentCalendar
                    object={recreadores}
                    className='h-calendar w-calendar'
                    subDominio={["eventos", Number(id_recreador)]}
                    eventData={eventData}
                    components={components}
                    onDoubleClickEvent={
                        (event) => {
                            navigate(`/eventos/${event.id}/`)
                        }
                    }
                />
            </div>
        </div>
    )
}

export default ComponentCalendarRecreador