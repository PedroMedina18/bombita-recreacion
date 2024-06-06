import Swal from 'sweetalert2';
import { personas } from "./API.jsx"
import texts from '../context/text_es.js';

// *Para verificar que no queden espacios en los inputs ni al inicio ni al final
export function hasLeadingOrTrailingSpace(name) {
  return /^\s/.test(name) || /\s$/.test(name);
}



// *Para calcular la edad al dar la fecha de nacimiento y la fecha actual
export const calcularEdad = (fecha_nacimiento) => {
  const fechaNacimiento = new Date(fecha_nacimiento)
  const fecha = new Date()
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


export const errorAxios = async (error) => {
  if (error.code = "ERR_NETWORK") {
    return (texts.errorMessage.errorConexion)
  } else if (error.request) {
    return (texts.errorMessage.errorRequest)
  } else {
    return ('Error', error.message)
  }
}

export const formatoNumero = (numero) => {
  const strNumero = numero.toString();
  const longitud = strNumero.length;

  if (longitud < 4) {
    let ceros = '';
    for (let i = 0; i < 4 - longitud; i++) {
      ceros += '0';
    }
    return ceros + strNumero;
  } else {
    return strNumero;
  }
}

export function formatDateWithTime12Hour(date) {
  const fecha = new Date(date);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Intl.DateTimeFormat('es-ES', options).format(fecha);
}