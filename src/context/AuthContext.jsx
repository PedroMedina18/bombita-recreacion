import { useEffect, useContext, useState, createContext } from 'react'
import { verify_token } from "../js/API.js"
export const AuthContext = createContext();
import { getCookie } from "../js/cookie.js"

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState()
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
        fecha:json.inicio_sesion
      }
    )
    setIsAuthenticated(true)
    document.cookie = `token=${token}; path=/`
  }

  // funcion que devuelve los datos del usuario
  const getUser = () => {
    return user
  }

  const checkAuth = async () => {
    try {
      const token = getCookie("token")
      if (token) {
        const res = await verify_token()
        if (res.statusText = "OK" && res.data.status && res.data.token) {
          saveUser(res.data.data, res.data.token)
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
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={
      {
        saveUser,
        getUser,
        isAuthenticateds,
      }
    }>
      {isloading ? <div>Loading...</div> : children}
    </AuthContext.Provider>

  )
}