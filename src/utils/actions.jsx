import { personas } from "./API.jsx"
import { toastError, alertConfim, alertLoading, alertAceptar } from '../components/alerts.jsx'
import Swal from 'sweetalert2';
import texts from "../context/text_es.js"
import {useAuthContext} from "../context/AuthContext.jsx"

// *Para permitir editar los datos al registrar un usuario, cliente o recreador
export const habilitarEdicion = ({ setValue, setdataNewUser, dataPersona }) => {
    const keys = Object.keys(dataPersona);
    keys.forEach(key => {
        setValue(`${key}`, ``)
    });
    setValue('tipo_documento', "")
    setdataNewUser({ tipo_documento: null, numero_documento: null })
    setValue("id_persona", "")
}

export const controlErrors = ({ respuesta, constrolError, message200=null, messageStatus=null }) => {
    if (respuesta.status !== 200) {
        constrolError(`${message200? message200 : `Error. ${respuesta.status} ${respuesta.statusText}`}`)
        return true
    }
    if (respuesta.data.status === false) {
        constrolError(`${messageStatus? messageStatus : respuesta.data.message}`)
        return true
    }
    return false
}

// *verifica la respuesta de la peticion al buscar las opciones de los selects
export const verifyOptionsSelect = ({ respuesta, setOptions, label }) => {
    if (respuesta.status !== 200) {
        toastError(`Error. ${respuesta.status} ${respuesta.statusText}`)
        return
    }

    if (respuesta.data.status === false) {
        toastError(`${respuesta.data.message}`)
        return
    }
    const options = respuesta.data.data.map((element) => {
        return {
            value: element.id,
            label: label(element)
        }
    })
    setOptions(options)
}

export const getDataAll = async ({ api, setData, label = null, message = null }) => {
    try {
        const data = await api.get({params:{all:true, order:"ASC"}})
        verifyOptionsSelect({
            respuesta: data,
            setOptions: setData,
            label: label ? label : (e) => { return e.nombre }
        })
    } catch (error) {
        toastError(message ? message : "Error Consulta en Data")
    }

}
// *Funcion encargada de buscar los datos de una persona si cuenta con el tipo de documento y su numero
export const getPersona = async ({ dataNewUser, setPersona, setValue, setDisabledInputs }) => {
    try {
        if (dataNewUser.tipo_documento && dataNewUser.numero_documento && dataNewUser.numero_documento.length >= 8) {
            const respuesta = await personas.get({ subDominio: [dataNewUser.tipo_documento, dataNewUser.numero_documento] })
            if (respuesta.status === 200 && respuesta.data.status === true) {
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
    } catch (error) {
        console.log(error)
    }
}
// *Funcion encargada de buscar los datos del recreador y agregarlos al formulario
export const getRecreador = async ({ dataNewUser, setPersona, setValue, setDisabledInputs }) => {
    try {
        if (dataNewUser.tipo_documento && dataNewUser.numero_documento && dataNewUser.numero_documento.length >= 8) {
            const respuesta = await personas.get({ subDominio: [dataNewUser.tipo_documento, dataNewUser.numero_documento] })
            if (respuesta.status === 200 && respuesta.data.status === true) {
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
    } catch (error) {
        console.log(error)
    }
}

// *funcion para realizar una peticion delete en la tabla
export const deleteItem = async ({ row, objet, functionGet }) => {
    try {
        const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirmDelete)
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
                    toastError(`${respuesta.data.message}`)
                }
            } else {
                Swal.close()
                toastError(`Error.${respuesta.status} ${respuesta.statusText}`)
            }
        }
    } catch (error) {
        Swal.close()
        console.log(error)
        toastError(texts.errorMessage.errorDelete)
    }
}

// *funcion para realizar una consulta get al pasar un search
export const searchCode = async ({ value, object, setList, setLoading, setData, filtros={} }) => {
    try {
        setLoading(true)
        const result = value ? await object.get({ params:{...filtros, search:value} }) : await object.get({params:filtros})
        if (result.status !== 200) {
            setList([])
            setData({ pages: 1, total: 0 })
            toastError(`Error. ${result.status} ${result.statusText}`)
            return
        }
        if (result.data.status === false) {
            setList([])
            setData({ pages: 1, total: 0 })
            toastError(`${result.data.message}`)
            return
        }
        if (result.data.data === null) {
            setList([])
            setData({ pages: 1, total: 0 })
            toastError(`Sin Resultados`)
            return
        }
        if (!Array.isArray(result.data.data)) {
            setList([result.data.data])
            setData({ pages: result.data.pages ? result.data.pages : 1, total: result.data.total ? result.data.total : 1 })
        } else {
            setList(result.data.data)
            setData({ pages: result.data.pages ? result.data.pages : 1, total: result.data.total ? result.data.total : 1 })
        }

    } catch (error) {
        console.log(error)
        setList([])
        setData({ pages: 1, total: 0 })
        if (!error.response.status === 404) {
            toastError(texts.errorMessage.errorSystem)
        }
    } finally {
        setLoading(false)
    }
}

// *funcion para buscar lista de elementos en la API
export const getListItems = async ({ object, setList, setData, setLoading, filtros={}}) => {
    try {
        const result = await object.get({params:filtros})
        if (result.status === 200) {
            if (result.data.status === true) {
                setList(result.data.data)
                setData({ pages: result.data.pages, total: result.data.total })
            } else {
                toastError(`${result.data.message}`)
            }
        }
    } catch (error) {
        console.log(error)
        setData({ pages: 1, total: 0 })
        toastError(texts.errorMessage.errorSystem)
    } finally {
        setLoading(false)
    }
}

// *funcion orientada a verificar la respuesta al realizar un registro en la API
export const controlResultPost = async ({ respuesta, messageExito, useNavigate = null, callbak = () => { } }) => {
    if (respuesta.status = 200) {
        if (respuesta.data.status) {
            Swal.close()
            const aceptar = await alertAceptar("Exito!", `${messageExito}`)
            callbak()
            if (aceptar.isConfirmed && useNavigate) {
                useNavigate.navigate(useNavigate.direction)
            }
        } else {
            Swal.close()
            toastError(`${respuesta.data.message}`)
        }
    } else {
        Swal.close()
        toastError(`Error.${respuesta.status} ${respuesta.statusText}`)
    }
}