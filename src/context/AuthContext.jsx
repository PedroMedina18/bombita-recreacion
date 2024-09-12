import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { verify_token, generos, niveles, tipo_documentos, materiales, actividades, cargos } from "../utils/API.jsx";
import { getCookie } from "../utils/cookie.jsx";
import { getDataAll } from "../utils/actions.jsx";
import { LoaderRule } from "../components/loader/Loader.jsx";
import { toastError } from "../components/alerts.jsx";
import texts from "./text_es.js";
const AuthContext = createContext();


export const useAuthContext = () => {
  return useContext(AuthContext)
}

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({})
  const [permisos, setPermisos] = useState({ administrador: false, permisos: [], img: null })
  const [isAuthenticateds, setIsAuthenticated] = useState(false)
  const [isloading, setIsLoading] = useState(true);
  const [dataGeneros, setGeneros] = useState([])
  const [dataNiveles, setNiveles] = useState([])
  const [dataTipoDocumentos, setTipoDocumentos] = useState([])
  const [dataMateriales, setMateriales] = useState([])
  const [dataActividades, setActividades] = useState([])
  const [dataCargos, setCargos] = useState([])
  const renderizado = useRef(0);

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      checkAuth();
      return
    }
  }, []);

  const getData = () => {
    getDataAll({
      api: generos,
      setData: setGeneros,
      message: "Error al consultar los Generos"
    })
    getDataAll({
      api: niveles,
      setData: setNiveles,
      message: "Error al consultar los Niveles"
    })
    getDataAll({
      api: tipo_documentos,
      setData: setTipoDocumentos,
      message: "Error al consultar los Tipos de Documentos"
    })
    getDataAll({
      api: materiales,
      setData: setMateriales,
      message: "Error al consultar los Materiales"
    })
    getDataAll({
      api: actividades,
      setData: setActividades,
      message: "Error al consultar los Actividades"
    })
    getDataAll({
      api: cargos,
      setData: setCargos,
      message: "Error al consultar los Cargos"
    })
  }

  const getDataOptional = () => {
    if (!dataGeneros.length) {
      getDataAll({
        api: generos,
        setData: setGeneros,
        message: "Error al consultar los Generos"
      })
    }
    if (!dataNiveles.length) {
      getDataAll({
        api: niveles,
        setData: setNiveles,
        message: "Error al consultar los Niveles"
      })
    }
    if (!dataTipoDocumentos.length) {
      getDataAll({
        api: tipo_documentos,
        setData: setTipoDocumentos,
        message: "Error al consultar los Tipos de Documentos"
      })
    }
    if (!dataMateriales.length) {
      getDataAll({
        api: materiales,
        setData: setMateriales,
        message: "Error al consultar los Materiales"
      })
    }
    if (!dataActividades.length) {
      getDataAll({
        api: actividades,
        setData: setActividades,
        message: "Error al consultar los Actividades"
      })
    }
    if (!dataCargos.length) {
      getDataAll({
        api: cargos,
        setData: setCargos,
        message: "Error al consultar los Cargos"
      })
    }
  }

  const getOption = (option) => {
    switch (option) {
      case 'genero':
        getDataAll({
          api: generos,
          setData: setGeneros,
          message: "Error al consultar los Generos"
        })
        break;
      case 'nivel':
        getDataAll({
          api: niveles,
          setData: setNiveles,
          message: "Error al consultar los Niveles"
        })
        break;
      case 'tipo_documento':
        getDataAll({
          api: tipo_documentos,
          setData: setTipoDocumentos,
          message: "Error al consultar los Tipos de Documentos"
        })
        break;
      case 'material':
        getDataAll({
          api: materiales,
          setData: setMateriales,
          message: "Error al consultar los Materiales"
        })
        break;
      case 'actividad':
        getDataAll({
          api: actividades,
          setData: setActividades,
          message: "Error al consultar los Actividades"
        })
        break;
      case 'cargo':
        getDataAll({
          api: cargos,
          setData: setCargos,
          message: "Error al consultar los Cargos"
        })
        break;
    }
  }

  const dataOptions = () => {
    return {
      niveles: dataNiveles,
      generos: dataGeneros,
      tipos_documentos: dataTipoDocumentos,
      materiales: dataMateriales,
      actividades: dataActividades,
      cargos: dataCargos,
    }
  }

  // *funcion encargada de guardar los datos del usuario al ingresar
  const saveUser = (json, token) => {
    document.cookie = `token=${token}; path=/; SameSite=Strict`
    setPermisos({
      ...permisos,
      administrador: Boolean(json.administrador),
      permisos: json.permisos ? json.permisos : [],
      img: json.img
    })
    getData()
    setUser(
      {
        ...user,
        id: json.id,
        usuario: json.usuario,
        cargo: json.cargo,
        cargo_id: json.cargo_id,
        fecha: json.inicio_sesion,
        dollar: json.dollar
      }
    )
    setIsAuthenticated(true)
  };

  const editUser = (nombreUsuario) => {
    setUser(
      {
        ...user,
        usuario: nombreUsuario,
      }
    )
  };

  // *funcion encargada de guardar la informacion relacionada con el cargo del usuario
  // const saveCargo = async (json) => {
  //   const cargo = await cargos.get({ subDominio: [json.cargo_id] })
  //   if (!cargo.status === 200) {
  //     toastError(`Error 200. Permisos no encontrados`)
  //     return
  //   }
  //   if (!cargo.data.status) {
  //     toastError(`${cargo.data.message}`)
  //     return
  //   }
  //   const permisosCargos=cargo.data.data
  //   const permisosPermitidos = permisosCargos.permisos?.map((e) => {
  //     return e.id
  //   })
  //   setPermisos({
  //     ...permisos,
  //     administrador: Boolean(permisosCargos.administrador),
  //     permisos: permisosPermitidos ? permisosPermitidos : [],
  //     img: permisosCargos.img
  //   })
  //   return true
  // };

  const getPermisos = () => {
    return permisos
  };

  // *funcion que devuelve los datos del usuario
  const getUser = () => {
    return user
  };

  // *funcion para chekear si el token es valido
  const checkAuth = async () => {
    try {
      const token = getCookie("token")
      if (token) {
        const respuesta = await verify_token.get()
        if (respuesta.statusText == "OK" && respuesta.data.status && respuesta.data.token) {
          saveUser(respuesta.data.data, respuesta.data.token)
        } else {
          setUser({})
          document.cookie = `token=; path=/; max-age=0`
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      setUser({})
      setIsAuthenticated(false)
      document.cookie = `token=; path=/; max-age=0`
    } finally {
      setIsLoading(false)
    }
  };

  // *funcion para cerrar sesion
  const closeSession = () => {
    setGeneros([])
    setNiveles([])
    setTipoDocumentos([])
    setActividades([])
    setMateriales([])
    setUser({})
    setPermisos({ administrador: false, permisos: [], img: null })
    setIsAuthenticated(false)
    document.cookie = `token=; path=/; max-age=0`
  };

  return (
    <AuthContext.Provider value={
      {
        saveUser,
        getUser,
        isAuthenticateds,
        editUser,
        closeSession,
        getData,
        dataOptions,
        getDataOptional,
        getOption,
        getPermisos
      }
    }>
      {isloading ?
        <div className="w-100 d-flex justify-content-center align-items-center heigh-100 haikus">
          <LoaderRule />
        </div>
        :
        children
      }
    </AuthContext.Provider>

  )
}