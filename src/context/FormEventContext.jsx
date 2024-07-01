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
    const [SaveDataServicios, setSaveDataServicios] = useState([])
    const [SaveDataSobrecargos, setSaveDataSobrecargos] = useState([])
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})

    const [dataEvent, setDataEvent] = useState({

    })

    return (
      <FormEventContext.Provider value={{
        SaveDataSobrecargos, 
        SaveDataServicios, 
        dataSobrecargos, 
        dataServicios, 
        dataTipo_documentos, 
        dataNewUser, 
        dataPersona, 
        dataEvent, 
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