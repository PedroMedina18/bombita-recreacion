import { useState, useEffect } from 'react';
import error404 from '../assets/error-404.svg'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import { ButtonSimple } from '../components/button/Button.jsx';
import { getCookie } from "../utils/cookie.jsx"

function Error404() {
  const [login, setLogin] = useState(false)
  const { isAuthenticateds } = useAuthContext()
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Página Desconocida - Bombita Recreación"
    if (isAuthenticateds && getCookie("token")) {
      setLogin(true)
    }
  }, [])


  return (
    <main className='w-100 vh-100 d-flex flex-column justify-content-center align-items-center haikus'>
      <div className='w-75 w-md-100 d-flex flex-column align-items-center justify-content-center rounded bg-white bg-opacity-25 py-3 px-2'>
        <div className=' d-flex align-items-center justify-content-center'>
          <p className='fw-bold h1 text-center text-white w-50'>Lo sentimos estas en el lugar equivocado</p>
          <img width={"450px"} src={error404} alt="error 404" />
        </div>
        <ButtonSimple className="mt-4 py-3 px-5 " onClick={(e) => { navigate(login ? "/inicio" : "/") }}>{login ? "Inicio" : "Iniciar Sesión"}</ButtonSimple>
      </div>
    </main>
  )
}

export default Error404