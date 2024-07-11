import { useReducer, createContext, useContext, useState } from 'react'
import { verify_token } from "../utils/API.jsx"
import Form_Eventos from "../pages/eventos/Form_Eventos.jsx"
const FormEventContext = createContext();

export const useFormEventContext=()=>{
    return useContext(FormEventContext)
  }

export function FormEventContextProvider() {
    const [dataTipo_documentos, setTipoDocumentos] = useState([])
    const [dataServicios, setServicios] = useState([])
    const [dataSobrecargos, setSobrecargos] = useState([])
    const [valueCliente, setValueCliente] = useState(null)
    const [dataClientes, setClientes] = useState([])
    const [saveDataServicios, setSaveDataServicios] = useState([])
    const [saveDataSobrecargos, setSaveDataSobrecargos] = useState([])
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})
    const [dataEvent, setDataEvent] = useState({})

    return (
      <FormEventContext.Provider value={{
        saveDataSobrecargos, 
        saveDataServicios, 
        dataSobrecargos, 
        dataServicios, 
        dataTipo_documentos, 
        dataNewUser, 
        dataPersona, 
        dataEvent, 
        dataClientes, 
        valueCliente, 
        setValueCliente,
        setClientes,
        setDataEvent,
        setPersona,
        setdataNewUser,
        setTipoDocumentos,
        setServicios,
        setSobrecargos,
        setSaveDataServicios,
        setSaveDataSobrecargos,
      }}>
        <Form_Eventos/>
      </FormEventContext.Provider>
  
    )
  }