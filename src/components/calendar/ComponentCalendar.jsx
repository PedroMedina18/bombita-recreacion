import { useState, useEffect, useRef } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import {controlErrors} from "../../utils/actions.jsx";
import { toastError } from "../alerts.jsx";
import dayjsEs from "../../utils/dayjs.js";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ComponentCalendar.css";

function ComponentCalendar({ className="", object, subDominio=[], filtros = {}, eventData, ...props}) {
  const dayjs = dayjsEs({ weekdaysAbre: false });
  const localizer = dayjsLocalizer(dayjs);
  const [view, setView] = useState("month");
  const [range, setRange] = useState([]);
  const [listEventos, setListeventos] = useState([{}]);
  const [navigateFecha, setNavigate] = useState(null);
  const renderizado = useRef(0);
  const [rangoFechas, setRangoFechas] = useState({
    desde: dayjs().format("DD-MM-YYYY"),
    hasta: dayjs().format("DD-MM-YYYY"),
  });
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
    noEventsInRange: "Sin eventos",
    showMore: (total, remainingEvents, events) => `+${total} Más`,
  };

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      return
    }
    buscarEventos()
  }, [rangoFechas]);

  useEffect(() => {
    determinarRangoFechas()
  }, [range]);

  useEffect(() => {
    if (renderizado.current === 0) {
      return
    }
    color()
  }, [listEventos]);

  const color = () => {
    const $eventos = document.querySelectorAll(".rbc-event");
    $eventos.forEach((evento) => {
      const $contenido = evento.querySelector(".rbc-event-content");
      const $div = $contenido.querySelector("div");
      if ($div) {
        evento.style.backgroundColor = getComputedStyle($div).backgroundColor;
        evento.style.color = getComputedStyle($div).color;
      }
    });
  };

  const buscarEventos = async () => {
    try {
      const params = {
        ...filtros,
        desde: rangoFechas.desde,
        hasta: rangoFechas.hasta,
        all:true,
        fecha:"fecha_evento"
      };
      
      const respuesta = await object.get({ subDominio:subDominio, params: params });
      if(!controlErrors({respuesta:respuesta, constrolError:toastError})){
        const data=respuesta.data.data? respuesta.data.data : []
        const events = data.map((event, index) => {
          return eventData(event, index);
        });
        setListeventos(events);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const determinarRangoFechas = () => {
    switch (view) {
      case "month":
        let fecha;
        if (navigateFecha) {
          fecha = dayjs(navigateFecha);
        } else {
          fecha = dayjs();
        }
        const totalDias = fecha.daysInMonth();
        const mes = `${fecha.month() + 1 < 10 ? "0" : ""}${fecha.month() + 1}`;
        setRangoFechas({
          desde: `01-${mes}-${fecha.year()}`,
          hasta: `${totalDias}-${mes}-${fecha.year()}`,
        });
        break;
      case "week":
        setRangoFechas({
          desde: dayjs(range[0]).format("DD-MM-YYYY"),
          hasta: dayjs(range[6]).format("DD-MM-YYYY"),
        });
        break;
      case "day":
        if(Array.isArray(range)){
          setRangoFechas({
          desde: dayjs(range[0]).format("DD-MM-YYYY"),
          hasta: dayjs(range[0]).format("DD-MM-YYYY"),
        })
        }else{
          setRangoFechas({
            desde: dayjs(range.start).format("DD-MM-YYYY"),
            hasta: dayjs(range.end).format("DD-MM-YYYY")
          })
        }
        break;
      case "agenda":
        setRangoFechas({
          desde: dayjs(range.start).format("DD-MM-YYYY"),
          hasta: dayjs(range.end).format("DD-MM-YYYY")
        })
        break;
    }
  };

  return (
    <Calendar
      localizer={localizer}
      className={className}
      messages={messages}
      view={view}
      events={listEventos}
      formats={{
        dayHeaderFormat: (date) => {
          return dayjs(date).format("dddd, DD [de] MMMM YYYY");
        },

        dayRangeHeaderFormat: (date) => {
          const startDate = dayjs(date.start);
          const endDate = dayjs(date.end);
          if (
            startDate.year() === endDate.year() &&
            startDate.month() === endDate.month()
          ) {
            // Same year and month
            return `${startDate.format("DD")} - ${endDate.format("DD")} de ${startDate.format("MMMM")} ${startDate.year()}`;
          } else if (startDate.year() === endDate.year()) {
            // Same year, different month
            return `${startDate.format("DD")} de ${startDate.format("MMMM")} - ${endDate.format("DD")} de ${endDate.format("MMMM")} ${startDate.year()}`;
          } else {
            // Different year
            return `${startDate.format("DD")} de ${startDate.format("MMMM")} ${startDate.year()} - ${endDate.format("DD")} de ${endDate.format("MMMM")} ${endDate.year()}`;
          }
        },
        agendaHeaderFormat: (date) => {
          const startDate = dayjs(date.start);
          const endDate = dayjs(date.end);
          if (
            startDate.year() === endDate.year() &&
            startDate.month() === endDate.month()
          ) {
            // Same year and month
            return `${startDate.format("DD")} - ${endDate.format("DD")} de ${startDate.format("MMMM")} ${startDate.year()}`;
          } else if (startDate.year() === endDate.year()) {
            // Same year, different month
            return `${startDate.format("DD")} de ${startDate.format("MMMM")} - ${endDate.format("DD")} de ${endDate.format("MMMM")} ${startDate.year()}`;
          } else {
            // Different year
            return `${startDate.format("DD")} de ${startDate.format("MMMM")} ${startDate.year()} - ${endDate.format("DD")} de ${endDate.format("MMMM")} ${endDate.year()}`;
          }
        },
        timeGutterFormat: (date) => {
          return dayjs(date).format("hh:mm A");
        },
        eventTimeRangeFormat: (date) => {
          return `${dayjs(date.start).format("hh:mm A")} - ${dayjs(date.end).format("hh:mm A")}`;
        },
        agendaTimeRangeFormat: (date) => {
          return `${dayjs(date.start).format("hh:mm A")} - ${dayjs(date.end).format("hh:mm A")}`;
        },
      }}
      onRangeChange={(date) => {
        setRange(date);
      }}
      onView={(e) => {
        setView(e);
      }}
      onNavigate={(e) => {
        setNavigate(e);
      }}
      {
        ...props
      }
    />
  );
}

export default ComponentCalendar;
