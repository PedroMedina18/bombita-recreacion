import Swal from 'sweetalert2';
import { personas } from "./API.js"


export function hasLeadingOrTrailingSpace(name) {
  return /^\s/.test(name) || /\s$/.test(name);
}

// Para permitir editar los datos al registrar un usuario, cliente o recreador
export const habilitarEdicion = ({ setValue, setdataNewUser, dataPersona }) => {
  const keys = Object.keys(dataPersona);
  keys.forEach(key => {
    setValue(`${key}`, ``)
  });
  setValue('tipo_documento', "")
  setdataNewUser({ tipo_documento: null, numero_documento: null })
  setValue("id_persona", "")
}

// Para calcular la edad al dar la fecha de nacimiento y la fecha actual
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