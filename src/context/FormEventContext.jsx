import { createContext, useContext, useState, useEffect, useRef } from 'react'
import Form_Eventos from "../pages/eventos/FormEventos.jsx"
import { servicios, sobrecargos, clientes } from "../utils/API.jsx";
import { toastError } from "../components/alerts.jsx";
import ErrorSystem from "../components/errores/ErrorSystem.jsx";
import { controlErrors } from "../utils/actions.jsx"
const FormEventContext = createContext();

export const useFormEventContext=()=>{
    return useContext(FormEventContext)
  }

export function FormEventContextProvider() {
    const [dataServicios, setServicios] = useState([])
    const [dataSobrecargos, setSobrecargos] = useState([])
    const [valueCliente, setValueCliente] = useState(null)
    const [dataClientes, setClientes] = useState([])
    const [saveDataServicios, setSaveDataServicios] = useState([])
    const [saveDataSobrecargos, setSaveDataSobrecargos] = useState([])
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})
    const [dataEvent, setDataEvent] = useState({})
    const [loading, setLoading] = useState(true)
    const renderizado = useRef(0)

    useEffect(() => {
      if (renderizado.current === 0) {
          renderizado.current = renderizado.current + 1
          getData()
          return
      }
  }, [])

  // *funcion para buscar los tipos de documentos y los cargos
  const getData = async () => {
      try {
          const get_servicios = await servicios.get({params:{all:true}})
          const get_sobrecargos = await sobrecargos.get({params:{all:true}})
          const get_clientes = await clientes.get()
          controlErrors({ respuesta: get_servicios, constrolError: toastError })
          controlErrors({ respuesta: get_sobrecargos, constrolError: toastError })
          controlErrors({ respuesta: get_clientes, constrolError: toastError })
          setClientes(get_clientes.data.data)
          setServicios(get_servicios.data.data)
          setSobrecargos(get_sobrecargos.data.data)
      } catch (error) {
          console.log(error)
          toastError(texts.inputsMessage.errorSystem)
      } finally {
          setLoading(false)
      }
  }

    return (
      <FormEventContext.Provider value={{
        saveDataSobrecargos, 
        saveDataServicios, 
        dataSobrecargos, 
        dataServicios, 
        dataNewUser, 
        dataPersona, 
        dataEvent, 
        dataClientes, 
        valueCliente, 
        loading,
        setValueCliente,
        setDataEvent,
        setPersona,
        setdataNewUser,
        setSaveDataServicios,
        setSaveDataSobrecargos,
      }}>
        <Form_Eventos/>
      </FormEventContext.Provider>
  
    )
  }