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

// *Para el formato de numeros utilizados en vez de id
export const formatoId = (numero) => {
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

// *Para devolver un formato de fecha y hora  de 12 horas
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

export function formatoFechaInput(date) {

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

// *Para devolver una lista con los objetos que coinciden
export function coincidences(options, optionDefault) {
  const resultado = options.filter(item1 => {
    return optionDefault.some(item2 => item1.value === item2.id);
  });
  return resultado;
}

export function addOptionalQueryParams(url, queryParams) {
  if (queryParams) {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach(key => {
      params.append(key, queryParams[key]);
    });
    url += `?${params.toString()}`;
  }
  return url;
}

export function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
}

export function normalizeDecimalNumber(number) {
  // Convertir a string para trabajar con la parte decimal
  const strNumber = number.toString();

  // Verificar si es un número decimal
  if (strNumber.includes('.')) {
    // Separar la parte entera y decimal
    let [integerPart, decimalPart] = strNumber.split('.');

    // Verificar si la parte decimal tiene 2 dígitos
    if (decimalPart.length < 2) {
      // Rellenar con ceros hasta tener 2 dígitos
      decimalPart += '0'.repeat(2 - decimalPart.length);
    }

    // Reconstruir el número con la parte decimal normalizada
    return `${integerPart}.${decimalPart}`;
  } else {
    // Si no es un número decimal, convertirlo a decimal y rellenar con 2 ceros
    return `${strNumber}.00`;
  }
}

export function FalseTrue(param){
  if(param==="false"){
    return false
  }
  if(param==="true"){
    return true
  }
  return param
}