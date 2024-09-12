import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { ButtonSimple } from "../components/button/Button.jsx";
import { Toaster } from "sonner";
import { toastError } from '../components/alerts.jsx'
import { eventos, recreadores, clientes, servicios, materiales } from "../utils/API.jsx";
import { controlErrors } from "../utils/actions.jsx";
import { IconClient, IconRecreadores, IconDollar, IconService, IconInventario, IconEvent } from "../components/Icon.jsx"
import { useNavigate } from "react-router-dom"
import Navbar from '../components/navbar/Navbar';
import CardInfo from "../components/card/CardInfo.jsx";
import ComponentCalendarEvents from "../components/calendar/ComponentCalendarEvents.jsx"

function Inicio() {
  const { getUser, getPermisos } = useAuthContext();
  const [dollar] = useState(getUser().dollar);
  const renderizado = useRef(0)
  const [dataCards, setDataCards] = useState({ recreadores: 0, clientes: 0,eventosRecreadores:0, eventosPagos:0, servicios: 0, material:0, materialesBajos:0 })
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Bombita Recreación"
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getData()
      return
    }
  }, [])

  const getData = async () => {

    const cliente = await clientes.get({ params: { total: true } })

    const recreador = await recreadores.get({ params: { total: true } })

    const material = await materiales.get({ params: { total: true } })
    const servicio = await servicios.get({ params: { total: true } })
    const evento = await eventos.get({ params: { total: true } })
    setDataCards({
      ...dataCards,
      recreadores: recreador.data?.data.total,
      clientes: cliente.data?.data.total,
      servicios: servicio.data?.data.total,
      material:material.data?.data.total,
      materialesBajos:material.data?.data.bajo,
      eventosRecreadores:evento.data?.data.sin_recreador,
      eventosPagos:evento.data?.data.sin_pagos,
      
    })
  }


  // const estado = useInactivity()
  return (
    <Navbar name="Bienvenido" dollar={false}>
      <div className='div-main justify-content-between px-3 px-md-4 px-lg-5 py-3'>
        <div className='w-100 d-flex flex-wrap justify-content-between'>
          {
            (getPermisos().administrador || getPermisos().permisos.includes(8)) &&
            <CardInfo title={`Clientes: ${dataCards.clientes}`} icon={<IconClient />} cursor={true} className='my-1 mx-2' color='purple'
              onDoubleClick={() => {
                navigate("/clientes")
              }}
            />
          }

          {
            (getPermisos().administrador || getPermisos().permisos.includes(7)) &&
            <CardInfo title={`Recreadores: ${dataCards.recreadores}`} icon={<IconRecreadores />} cursor={true} className='my-1 mx-2' color='blue'
              onDoubleClick={() => {
                navigate("/recreadores")
              }}
            />
          }

          {
            (getPermisos().administrador || getPermisos().permisos.includes(5)) &&
            <CardInfo title={`Servicios: ${dataCards.servicios}`} icon={<IconService />} cursor={true} className='my-1 mx-2' color='secundario'
              onDoubleClick={() => {
                navigate("/servicios")
              }}
            />
          }

          {
            (getPermisos().administrador || getPermisos().permisos.includes(9)) &&
            <CardInfo title={`Materiales: ${dataCards.material}`} icon={<IconInventario />} cursor={true} className='my-1 mx-2' color='naranja'
              onDoubleClick={() => {
                navigate("/materiales")
              }}
            />
          }
          {
            (getPermisos().administrador || getPermisos().permisos.includes(9)) &&
            <CardInfo title={`Inventario Bajo: ${dataCards.materialesBajos}`} icon={<IconInventario />} cursor={true} className='my-1 mx-2' color='naranja'
              onDoubleClick={() => {
                navigate("/materiales/")
              }}
            />
          }


          <CardInfo title={`Dolar: ${dollar?.price} Bs`} icon={<IconDollar />} cursor={true} className='my-2 mx-2' color='greed'
            onDoubleClick={() => {
              navigate("/dolar/")
            }}
          />
          {
            (getPermisos().administrador || getPermisos().permisos.includes(12)) &&
            <CardInfo title={`Event. Sin Pago: ${dataCards.eventosPagos}`} icon={<IconEvent />} cursor={true} className='my-2 mx-2' color='azulado'
            onDoubleClick={() => {
              navigate("/eventos/")
            }}
          />
        }
        {

          
            (getPermisos().administrador || getPermisos().permisos.includes(12)) &&
            <CardInfo title={`Event. Sin Recreadores: ${dataCards.eventosRecreadores}`} icon={<IconEvent />} cursor={true} className='my-2 mx-2' color='azulado'
            onDoubleClick={() => {
              navigate("/eventos/")
            }}
          />
        }
            

        </div>
        {
          (getPermisos().administrador || getPermisos().permisos.includes(12)) &&
          <ComponentCalendarEvents />
        }
      </div>
      <Toaster />
    </Navbar>
  )
}

export default Inicio