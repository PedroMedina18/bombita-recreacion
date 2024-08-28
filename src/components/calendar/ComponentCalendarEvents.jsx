import React from 'react'
import ComponentCalendar from "../calendar/ComponentCalendar.jsx"
import { useNavigate } from "react-router-dom"
import dayjsEs from '../../utils/dayjs.js'
import { eventos } from "../../utils/API.jsx";


function ComponentCalendarEvents() {
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
        const estadoEvento = (day.isSame(start, 'day') || day.isAfter(start, 'day'))
        if (dataExtra) {
            return <div className={`d-flex flex-column ${estadoEvento && "bg-new bg-after"}`}>
                <p className='m-0'>{event.title}</p>
                <p className='m-0'>{event.event.cliente}</p>
                <p className='m-0'>{event.event.direccion}</p>
            </div>
        } else {
            return <div className={`${estadoEvento && "bg-new bg-after"}`}>
                {event.title}
            </div>
        }

    }
    return (
        <div className=' px-sm-0 px-md-1 px-4 mt-5 w-100'>
            <h6 className='text-center h3 fw-bold'>Calendario de Eventos</h6>
            <ComponentCalendar
                object={eventos}
                eventData={eventData}
                components={components}
                onDoubleClickEvent={
                    (event) => {
                        navigate(`/eventos/${event.id}/`)
                    }
                }
            />
        </div>
    )
}

export default ComponentCalendarEvents