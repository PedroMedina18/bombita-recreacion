import { useEffect, useState, createContext } from 'react'
import { verify_token } from "../utils/API.jsx"
import { getCookie } from "../utils/cookie.jsx"
import {LoaderCircle} from "../components/loader/Loader.jsx"
export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({})
  const [isAuthenticateds, setIsAuthenticated] = useState(false)
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // *funcion encargada de guardar los datos del usuario al ingresar
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

  // *funcion que devuelve los datos del usuario
  const getUser = () => {
    return user
  }

  // *funcion para chekear si el token es valido
  const checkAuth = async () => {
    try {
      const token = getCookie("token")
      if (token) {
        const respuesta = await verify_token.get()
        if (respuesta.statusText = "OK" && respuesta.data.status && respuesta.data.token) {
          saveUser(respuesta.data.data, respuesta.data.token)
        } else {
          setUser({})
          setIsAuthenticated(false)
          document.cookie = `token=; path=/; max-age=0`
        }
      }
    } catch (error) {
      console.log(error)
      setUser({})
      setIsAuthenticated(false)
      document.cookie = `token=; path=/; max-age=0`
    } finally {
      setIsLoading(false)
    }
  }

  // *funcion para cerrar sesion
  const closeSession = () => {
    setUser({})
    setIsAuthenticated(false)
    document.cookie = `token=; path=/; max-age=0`
  }

  return (
    <AuthContext.Provider value={
      {
        saveUser,
        getUser,
        isAuthenticateds,
        closeSession,
      }
    }>
      {isloading ? <div className="w-100 d-flex justify-content-center align-items-center heigh-100 haikus"><LoaderCircle/></div> : children}
    </AuthContext.Provider>

  )
}