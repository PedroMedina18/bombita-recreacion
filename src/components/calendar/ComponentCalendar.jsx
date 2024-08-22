import { useState, useEffect } from "react"
import { Calendar, dayjsLocalizer } from "react-big-calendar"
import dayjsEs from '../../utils/dayjs.js'
import { toastError } from "../alerts.jsx"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./ComponentCalendar.css"

function ComponentCalendar({height="100vh", width="100%", object, filtros={}}) {
  const [view, setView]=useState("month")
  const dayjs = dayjsEs({weekdaysAbre:false})
  const [range, setRange]=useState([])
  const [listEventos, setListeventos]=useState([])
  const [navigate, setNavigate]=useState(null)
  const [rangoFecha, setRangoFecha]=useState({})
  const localizer = dayjsLocalizer(dayjs)
  const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Sin eventos"
  };

  const buscarEventos=()=>{
    // try{
    //   const 
    // }catch(error){
    //   toastError(error)
    // }
  }
  const RangoFecha=()=>{
    switch (view) {
      case "month":
        let fecha
        if(navigate){
          fecha = dayjs(navigate)
        }else{
          fecha = dayjs()
        }
        const totalDias = fecha.daysInMonth()
        const mes = `${(fecha.month() + 1) < 10? "0":""}${fecha.month() + 1}`
        return {
          desde:`01-${mes}-${fecha.year()}`,
          hasta:`${totalDias}-${mes}-${fecha.year()}`
        }
      case "week":
        return {
          desde:dayjs(range[0]).format("DD-MM-YYYY"),
          hasta:dayjs(range[6]).format("DD-MM-YYYY")
        }
      case "day":
        return {
          desde:dayjs(range[0]).format("DD-MM-YYYY"),
          hasta:dayjs(range[0]).format("DD-MM-YYYY")
        }
      default:
        return {
          desde:dayjs(range.start).format("DD-MM-YYYY"),
          hasta:dayjs(range.end).format("DD-MM-YYYY")
        }
    }
  }
  console.log(RangoFecha())
  return (
      <Calendar
        localizer={localizer}
        messages={messages} 
        view={view}

        style={{
          width:width,
          height:height
        }}
        formats={{
          dayHeaderFormat:date=>{
            return dayjs(date).format('dddd, DD [de] MMMM YYYY')
          },
          dayRangeHeaderFormat:date=>{
            const startDate = dayjs(date.start);
            const endDate = dayjs(date.end);
            if (startDate.year() === endDate.year() && startDate.month() === endDate.month()) {
              // Same year and month
              return `${startDate.format('DD')} - ${endDate.format('DD')} de ${startDate.format('MMMM')} ${startDate.year()}`;
            } else if (startDate.year() === endDate.year()) {
              // Same year, different month
              return `${startDate.format('DD')} de ${startDate.format('MMMM')} - ${endDate.format('DD')} de ${endDate.format('MMMM')} ${startDate.year()}`;
            } else {
              // Different year
              return `${startDate.format('DD')} de ${startDate.format('MMMM')} ${startDate.year()} - ${endDate.format('DD')} de ${endDate.format('MMMM')} ${endDate.year()}`;
            }
          },
          timeGutterFormat:date=>{
            return dayjs(date).format('hh:mm A')
          },
        }}
        onView={(e)=>{
          setView(e)
        }}
        onNavigate={(e)=>{
          setNavigate(e)
        }}
        onRangeChange={(date)=>{
          setRange(date)
        }}
      />
  )
}

export default ComponentCalendar