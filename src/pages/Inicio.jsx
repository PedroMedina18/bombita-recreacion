import Navbar from '../components/navbar/Navbar';
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';

function Inicio() {
  const { getUser } = useAuthContext();
  const [dataUser] = useState(getUser());
  return (
    <Navbar name="Bienvenido">
      <div className='w-100 justify-content-between px-3 px-md-4 px-lg-5 py-3'>
        dsd
        <p className='h2'>{`${dataUser.dollar.price} Bs`}</p>
      </div>
    </Navbar>
  )
}

export default Inicio