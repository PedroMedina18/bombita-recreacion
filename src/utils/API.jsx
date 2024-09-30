import axios from 'axios'
import Petisions from './class/Peticions.js'

export const API = axios.create({
    baseURL: "http://127.0.0.1:8000/API/v1/",
});

export const login = async (data) => {
    return API.post("login/", data)
}

export const usuarios = new Petisions("usuarios");

export const recreadores = new Petisions("recreadores");

export const actividades = new Petisions("actividades");

export const verify_token = new Petisions("verify");

export const permisos = new Petisions("permisos");

export const estadisticas = new Petisions("estadisticas");

export const personas = new Petisions("personas");

export const cargos = new Petisions("cargos");

export const niveles = new Petisions("niveles");

export const generos = new Petisions("generos");

export const eventos = new Petisions("eventos");

export const clientes = new Petisions("clientes");

export const sobrecostos = new Petisions("sobrecostos");

export const materiales = new Petisions("materiales");

export const tipo_documentos = new Petisions("tipos_documentos");

export const servicios = new Petisions("servicios");

export const respaldo = new Petisions("respaldo");

export const preguntas = new Petisions("preguntas");

export const inventario = new Petisions("inventario");

export const metodoPago = new Petisions("metodos_pago");

export const evaluacion = new Petisions("evaluacion");

export const dolar = new Petisions("dolar");