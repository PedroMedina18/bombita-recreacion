import Navbar from '../components/navbar/Navbar';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import useInactivity from '../context/useInactivity.jsx';
import { ButtonSimple } from "../components/button/Button.jsx"
import { respaldo } from "../utils/API.jsx"
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
      </div>
    </Navbar>
  )
}

export default Inicio