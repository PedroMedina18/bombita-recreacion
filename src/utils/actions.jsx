import { personas } from "./API.jsx"
import { toastError, alertConfim, alertLoading, alertAceptar } from '../components/alerts.jsx'
import Swal from 'sweetalert2';
import texts from "../context/text_es.js"

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

// *verifica la respuesta de la peticion al buscar las opciones de los selects
export const verifyOptionsSelect = ({ respuesta, setError, setOptions }) => {
    if (respuesta.status !== 200) {
        setError(`Error. ${respuesta.status} ${respuesta.statusText}`)
        return
    }

    if (respuesta.data.status === false) {
        setError(`${respuesta.data.message}`)
        return
    }
    const options = respuesta.data.data.map((elements) => {
        return {
            value: elements.id,
            label: elements.nombre || `${elements.nombres} ${elements.apellidos}`
        }
    })
    setOptions(options)
}

// *Funcion encargada de buscar los datos de una persona si cuenta con el tipo de documento y su numero
export const getPersona = async ({ dataNewUser, setPersona, setValue, setDisabledInputs }) => {
    try {
        if (dataNewUser.tipo_documento && dataNewUser.numero_documento && dataNewUser.numero_documento.length >= 8) {
            const respuesta = await personas.get({paramOne:dataNewUser.tipo_documento, paramTwo:dataNewUser.numero_documento})
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
// *Funcion encargada de buscar los datos del y agregarlos al formulario
export const getRecreador = async ({ dataNewUser, setPersona, setValue, setDisabledInputs }) => {
    try {
        if (dataNewUser.tipo_documento && dataNewUser.numero_documento && dataNewUser.numero_documento.length >= 8) {
            const respuesta = await personas.get({paramOne:dataNewUser.tipo_documento, paramTwo:dataNewUser.numero_documento})
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
export const searchCode = async ({ value, object, setList,  setLoading, setData}) => {
    try {
        setLoading(true)
        const result = await object.get({paramOne:value})
        if (result.status === 200) {
            if (result.data.status === true) {
                if (!Array.isArray(result.data.data)) {
                    setList([result.data.data])
                    setData({ pages: result.data.pages?result.data.pages : 1, total: result.data.total?result.data.total : 1 })
                } else {
                    setList(result.data.data)
                    setData({ pages: result.data.pages?result.data.pages : 1, total: result.data.total?result.data.total : 1 })
                }
            } else {
                setList([])
                setData({ pages: 1, total: 0 })
                toastError(`${result.data.message}`)
            }
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
export const getListItems = async ({ object, setList, setData, setLoading }) => {
    try {
        const result = await object.get({})
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
    }finally {
        setLoading(false)
    }
}

// *funcion orientada a verificar la respuesta al realizar un registro en la API
export const controlResultPost = async ({ respuesta, messageExito, useNavigate = null }) => {
    if (respuesta.status = 200) {
        if (respuesta.data.status) {
            Swal.close()
            const aceptar = await alertAceptar("Exito!", `${messageExito}`)
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