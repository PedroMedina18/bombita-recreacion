import { useEffect, useState, createContext } from 'react'
import { verify_token } from "../js/API.js"
export const AuthContext = createContext();
import { getCookie } from "../js/cookie.js"
import { toastError, alertConfim, alertLoading, alertAceptar } from '../js/alerts.js'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({})
  const [isAuthenticateds, setIsAuthenticated] = useState(false)
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // funcion encargada de guardar los datos del usuario al ingresar
  const saveUser = (json, token) => {
    setUser(
      {
        ...user,
        id: json.id,
        nombre: json.nombre,
        cargo: json.cargo,
        fecha: json.inicio_sesion
      }
    )
    setIsAuthenticated(true)
    document.cookie = `token=${token}; path=/`
  }

  // funcion que devuelve los datos del usuario
  const getUser = () => {
    return user
  }
  // funcion para chekear si el token es valido
  const checkAuth = async () => {
    try {
      const token = getCookie("token")
      if (token) {
        const respuesta = await verify_token.get()
        if (respuesta.statusText = "OK" && respuesta.data.status && respuesta.data.token) {
          saveUser(respuesta.data.data, respuesta.data.token)
        } else {
          setUser(null)
          setIsAuthenticated(false)
          document.cookie = `token=; path=/; max-age=0`
        }
      }
    } catch (error) {
      console.log(error)
      setUser(null)
      setIsAuthenticated(false)
      document.cookie = `token=; path=/; max-age=0`
    } finally {
      setIsLoading(false)
    }
  }

  const closeSession = () => {
    setUser({})
    setIsAuthenticated(false)
    document.cookie = `token=; path=/; max-age=0`
  }

  // verificacion de respuesta guarda las opciones dadas
  const verificacion_options = ({ respuesta, setError, setOptions }) => {
    if (respuesta.status === 200) {
      if (respuesta.data.status === true) {
        const options = respuesta.data.data.map((elements) => {
          return {
            value: elements.id,
            label: elements.nombre
          }
        })
        setOptions(options)
        setError(``)
      } else {
        setError(`${respuesta.data.message}`)
      }
    } else {
      setError(`Error. ${respuesta.status} ${respuesta.statusText}`)
    }
  }

  const get_persona = async ({ dataNewUser, setPersona, setValue, setDisabledInputs }) => {
    try {

      if (dataNewUser.tipo_documento && dataNewUser.numero_documento && dataNewUser.numero_documento.length >= 8) {
        const res = await personas.get(dataNewUser.tipo_documento, dataNewUser.numero_documento)
        if (respuesta.status === 200) {
          if (respuesta.data.status === true) {
            setPersona({
              ...respuesta.data.data
            })
            const keys = Object.keys(respuesta.data.data);
            keys.forEach(key => {
              setValue(`${key}`, `${respuesta.data.data[key]}`)
            });
            setValue("id_persona", respuesta.data.data.id)
            setDisabledInputs(true)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteItem = async ({ row, objet, functionGet }) => {
    try {
      const confirmacion = await alertConfim("Confirmar", "Confirmar la Solicitud de Eliminación")
      if (confirmacion.isConfirmed) {
        alertLoading("Cargando")
        const respuesta = await objet.delete(row.id)
        if (respuesta.status = 200) {
          if (respuesta.data.status) {
            Swal.close()
            functionGet()
            alertAceptar("Exito!", "Registro Eliminado")
          } else {
            Swal.close()
            toastError(`${respuesta.data.message}`,
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
            )
          }
        } else {
          Swal.close()
          toastError(`Error.${respuesta.status} ${respuesta.statusText}`,
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
          )
        }
      }
    } catch (error) {
      Swal.close()
      console.log(error)
      toastError(`Error de Sistema. Intente mas tarde`,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
      )
    }
  }

  const searchCode = async ({ value, object, setList }) => {
    try {
      const result = await object.get(value)
      if (result.status === 200) {
        if (result.data.status === true) {
          if (!Array.isArray(result.data.data)) {
            setList([result.data.data])
          } else {
            setList(result.data.data)
          }
        } else {
          setList([])
          toastError(`${result.data.message}`,
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
          )
        }
      }
    } catch (error) {
      console.log(error)
      setList([])
      if (!error.response.status === 404) {
        toastError(`Error de Sistema. Intente mas tarde`,
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
        )
      }
    }
  }

  const getData = async ({ object, setList, setData, setLoading }) => {
    try {
      const result = await object.get()
      if (result.status === 200) {
        if (result.data.status === true) {
          setList(result.data.data)
          setData({ pages: result.data.pages, total: result.data.total })
        } else {
          toastError(`${result.data.message}`,
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
          )
        }
      }
    } catch (error) {
      console.log(error)
      toastError(`Error de Sistema. Intente mas tarde`,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
      )
    }
    finally{
      setLoading(false)
    }
  }

  const controlResultPost = async({respuesta, messageExito, navigate=null}) => {
    if (respuesta.status = 200) {
      if (respuesta.data.status) {
        Swal.close()
        const aceptar = await alertAceptar("Exito!", `${messageExito}`)
        if (aceptar.isConfirmed && navigate) { navigate(navigate) }
      } else {
        Swal.close()
        toastError(`${respuesta.data.message}`,
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
        )
      }
    } else {
      Swal.close()
      toastError(`Error.${respuesta.status} ${respuesta.statusText}`,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
      )
    }
  }

  return (
    <AuthContext.Provider value={
      {
        saveUser,
        getUser,
        isAuthenticateds,
        closeSession,
        deleteItem,
        searchCode,
        getData,
        verificacion_options,
        get_persona,
        controlResultPost
      }
    }>
      {isloading ? <div>Loading...</div> : children}
    </AuthContext.Provider>

  )
}