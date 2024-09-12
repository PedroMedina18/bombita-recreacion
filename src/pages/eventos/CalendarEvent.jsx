import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { ButtonSimple } from "../../components/button/Button.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import ComponentCalendarEvents from "../../components/calendar/ComponentCalendarEvents.jsx";
import texts from "../../context/text_es.js";
import {
    IconRowLeft
  } from "../../components/Icon.jsx";
import { useEffect } from "react";

function CalendarEvent() {
    const navigate = useNavigate()
    useEffect(()=>{
        document.title="Calendario de Eventos - Bombita Recreación"
    },[])

    return (
        <Navbar name={texts.pages.calendarEvents.name} descripcion={texts.pages.calendarEvents.description}>
            <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
                <ButtonSimple onClick={() => { navigate("/eventos/") }} className={"me-auto"}><IconRowLeft/>Lista de Eventos</ButtonSimple>
                <ComponentCalendarEvents />
            </div>
            <Toaster/>
        </Navbar>
    )
}

export default CalendarEvent