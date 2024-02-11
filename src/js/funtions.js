import Swal from 'sweetalert2';
import {personas} from "./API.js"


export function hasLeadingOrTrailingSpace(name) {
  return /^\s/.test(name) || /\s$/.test(name);
}

// verificacion de respuesta guarda las opciones dadas
export const verificacion_options = ({ respuesta, setError, setOptions }) => {
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


export const get_persona = async ({dataNewUser, setPersona, setValue, setDisabledInputs}) => {
  try {

      if (dataNewUser.tipo_documento && dataNewUser.numero_documento && dataNewUser.numero_documento.length >= 8) {
          const res = await personas.get(dataNewUser.tipo_documento, dataNewUser.numero_documento)
          if (res.status === 200) {
              if (res.data.status === true) {
                  setPersona({
                      ...res.data.data
                  })
                  const keys = Object.keys(res.data.data);
                  keys.forEach(key => {
                      setValue(`${key}`, `${res.data.data[key]}`)
                  });
                  setValue("id_persona", res.data.data.id)
                  setDisabledInputs(true)
              }
          }
      }
  } catch (error) {
      console.log(error)
  }
}
export const habilitarEdicion = ({setValue, setdataNewUser, dataPersona}) => {
  const keys = Object.keys(dataPersona);
  keys.forEach(key => {
      setValue(`${key}`, ``)
  });
  setValue('tipo_documento', "")
  setdataNewUser({ tipo_documento: null, numero_documento: null })
  setValue("id_persona", "")
}
export const calcular_edad = (fecha_nacimiento, fecha) => {
  const fechaNacimiento = new Date(fecha_nacimiento)
  const añoActual = Number(fecha.getFullYear())
  const mesActual = Number(fecha.getMonth() + 1)
  const diaActual = Number(fecha.getDate())

  const añoNacimiento = Number(fechaNacimiento.getFullYear())
  const mesNacimiento = Number(fechaNacimiento.getMonth() + 1)
  const diaNacimiento = Number(fechaNacimiento.getDate() + 1)
  let edad = añoActual - añoNacimiento
  if (mesActual < mesNacimiento) {
      edad = edad - 1
  } else if (mesActual === mesNacimiento) {
      if (diaActual < diaNacimiento) {
          edad = edad - 1
      }
  }
  return edad
}