import Navbar from '../components/navbar/Navbar';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import useInactivity from '../context/useInactivity.jsx';
import { ButtonSimple } from "../components/button/Button.jsx"
import { Toaster } from "sonner";
import { respaldo } from "../utils/API.jsx"
import ComponentCalendar from "../components/calendar/ComponentCalendar.jsx"

function Inicio() {
  const { getUser } = useAuthContext();
  const [dataUser] = useState(getUser());
  // const estado = useInactivity()
  return (
    <Navbar name="Bienvenido">
      <div className='w-100 justify-content-between px-3 px-md-4 px-lg-5 py-3'>
        dsd
        <p className='h2'>{`${dataUser.dollar.price} Bs`}</p>
        <ButtonSimple onClick={()=>{respaldo.get({})}}>
          Realizar Respaldo
        </ButtonSimple>
        <ComponentCalendar/>
      </div>
      <Toaster />
    </Navbar>
  )
}

export default Inicio