import { useState, useEffect } from 'react';
import error404 from '../assets/error-404.png'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import { ButtonSimple } from '../components/button/Button.jsx';
import { getCookie } from "../utils/cookie.jsx"

function Error404() {
  const [login, setLogin] = useState(false)
  const { isAuthenticateds } = useAuthContext()
  const navigate = useNavigate();

  useEffect(()=>{
    if (isAuthenticateds && getCookie("token")) {
      setLogin(true)
    }
  },[])
  

  return (
    <main className='w-100 vh-100 d-flex flex-column justify-content-center align-items-center bacerror'>
      <div>
        <img width={"450px"} src={error404} alt="error 404" />
        <p className='fw-bold h1 text-center'>Pagina no Encontrada</p>
      </div>
      <ButtonSimple className="mt-2 py-3 px-5" onClick={(e) => { navigate(login ? "/inicio" : "/") }}>{login ? "Inicio" : "Iniciar Sesión"}</ButtonSimple>
    </main>
  )
}

export default Error404