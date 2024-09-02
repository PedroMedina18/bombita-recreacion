import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { ButtonSimple } from "../components/button/Button.jsx";
import { Toaster } from "sonner";
import { toastError } from '../components/alerts.jsx'
import {  eventos, recreadores, clientes, servicios } from "../utils/API.jsx";
import { controlErrors } from "../utils/actions.jsx";
import { IconClient, IconRecreadores, IconDollar, IconService } from "../components/Icon.jsx"
import Navbar from '../components/navbar/Navbar';
import CardInfo from "../components/card/CardInfo.jsx";
import ComponentCalendarEvents from "../components/calendar/ComponentCalendarEvents.jsx"
import useInactivity from '../context/useInactivity.jsx';
import { useNavigate } from "react-router-dom"

function Inicio() {
  const { getUser } = useAuthContext();
  const [dollar] = useState(getUser().dollar);
  const renderizado = useRef(0)
  const [dataCards, setDataCards] = useState({ recreadores: 0, clientes: 0, servicios: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getData()
      return
    }
  }, [])

  const getData = async () => {
    const cliente = await clientes.get({ params: { total: true } })
    const recreador = await recreadores.get({ params: { total: true } })
    const servicio = await servicios.get({ params: { total: true } })
    setDataCards({
      ...dataCards,
      recreadores: recreador.data?.data.total,
      clientes: cliente.data?.data.total,
      servicios: servicio.data?.data.total,
    })
  }

  
  // const estado = useInactivity()
  return (
    <Navbar name="Bienvenido" dollar={false}>
      <div className='div-main justify-content-between px-3 px-md-4 px-lg-5 py-3'>
        <div className='w-100 d-flex flex-wrap justify-content-between'>
          <CardInfo title={`Clientes: ${dataCards.clientes}`} icon={<IconClient />} cursor={true} margin='5px 10px' color='purple' />
          <CardInfo title={`Recreadores: ${dataCards.recreadores}`} icon={<IconRecreadores />} cursor={true} margin='5px 10px' color='blue' />
          <CardInfo title={`Servicios: ${dataCards.servicios}`} icon={<IconService />} cursor={true} margin='5px 10px' color='secundario' />
          <CardInfo title={`Precio Dolar: ${dollar.price} Bs`} icon={<IconDollar />} cursor={true} margin='5px 10px' color='greed' />
        </div>
        {/* <p className='h2'>{`${dataUser.dollar.price} Bs`}</p> */}
        {/* <ButtonSimple onClick={()=>{respaldo.get({})}}>
          Realizar Respaldo
        </ButtonSimple> */}
        <ComponentCalendarEvents/>
      </div>
      <Toaster />
    </Navbar>
  )
}

export default Inicio