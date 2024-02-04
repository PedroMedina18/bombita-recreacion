
import './login.css'
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { login, verify_token } from "../../js/API.js"
import { getCookie } from "../../js/cookie.js"


function Login() {
  const { saveUser, isAuthenticateds } = useContext(AuthContext)
  const [alert, setAlert] = useState()
  const navigate = useNavigate();


  // the useform
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  //funcion del evento submit para comprobar el usuario
  const onSubmit = handleSubmit(
    async (data) => {
      try {
        document.getElementById("button-login").disabled = true
        const res = await login(data)
        document.getElementById("button-login").disabled = false
        if (res.status = 200) {
          if (res.data.status && res.data.token) {
            saveUser(res.data.data, res.data.token)
            navigate("/inicio")
            setAlert("")
          } else {
            setAlert(res.data.message)
            document.getElementById("button-login").disabled = false
          }
        } else {
          setAlert("Error de sistema. Por favor intentet mas tarde")
          document.getElementById("button-login").disabled = false
        }
      } catch (error) {
        console.log(error)
        setAlert("Error de sistema. Por favor intentet mas tarde")
        document.getElementById("button-login").disabled = false
      }
    }
  )
  
  // verificacion por si ya esta logeado el usuario
  if(isAuthenticateds && getCookie("token")){
    <Navigate to="/inicio"/>
  }
  
  return (
    <main className='w-100 vh-100 d-flex justify-content-center align-items-center bg-login'>
      <form className='form'
        onSubmit={onSubmit}
      >
        <div className="icon-user" >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"></path></svg>
        </div>

        <h1 className='h1 fw-bold mb-4 mt-4 text-white'>Inicio de Sesión</h1>

        <div className={`w-100 position-relative overflow-hidden my-2 ${errors.usuario ? "error" : ""}`}>
          <input
            type="text"
            id="user"
            name="usuario"
            {
            ...register("usuario", {
              required: {
                value: true,
                message: "Se requiere el usuario",
              },
              maxLength: {
                value: 20,
                message: "Máximo 20 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9+-@_.%&$#/]+$/,
                message: "Usuario invalido",
              }
            })
            }
          />
          <label htmlFor="user" className='lb-name  cursor-pointer'>
            <span className='text-name'>Usuario</span>
          </label>
        </div>
        {errors.usuario ? <span className='error-login'>{errors.usuario.message}</span> : <span className='error-login invisible'>error</span>}

        <div className={`w-100 position-relative overflow-hidden my-2 ${errors.contraseña ? "error" : ""}`}>
          <input
            id="password"
            type="password"
            name="contraseña"
            {
            ...register("contraseña", {
              required: {
                value: true,
                message: "Contraseña requerido",
              },
              maxLength: {
                value: 16,
                message: "Máximo 16 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9+-@_.%&$#/]+$/,
                message: "Contraseña no válida",
              }
            })
            }
          />
          <label htmlFor="password" className='lb-name  cursor-pointer'>
            <span className='text-name'>Contraseña</span>
          </label>
        </div>
        {errors.contraseña ? <span className='error-login'>{errors.contraseña.message}</span> : <span className='error-login invisible'>error</span>}

        {
          alert ?
            (
              <div className='alert-login'>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7h2v7h-2zm0 8h2v2h-2z"></path><path d="m21.707 7.293-5-5A.996.996 0 0 0 16 2H8a.996.996 0 0 0-.707.293l-5 5A.996.996 0 0 0 2 8v8c0 .266.105.52.293.707l5 5A.996.996 0 0 0 8 22h8c.266 0 .52-.105.707-.293l5-5A.996.996 0 0 0 22 16V8a.996.996 0 0 0-.293-.707zM20 15.586 15.586 20H8.414L4 15.586V8.414L8.414 4h7.172L20 8.414v7.172z"></path></svg>
                <p>{alert}</p>
              </div>
            )
            :
            ""
        }

        <button type="subtmit" className={`button-style-login mt-4 btn-disabled`} id="button-login">
          <span className="transition"></span>
          <span className="gradient"></span>
          <span className="name">Ingresar</span>
        </button>
      </form>
    </main>
  )
}

export default Login