import axios from 'axios'
import Petisions from './class/Peticions.js'

export const API = axios.create({
    baseURL: "http://127.0.0.1:8000/API/v1/",
})

export const login = async (data) => {
    return API.post("login/", data)
}

export const usuarios=new Petisions("usuarios")

export const recreadores=new Petisions("recreadores")

export const actividades=new Petisions("actividades")

export const verify_token=new Petisions("verify")

export const permisos=new Petisions("permisos")

export const personas=new Petisions("personas")

export const cargos=new Petisions("cargos")

export const niveles=new Petisions("niveles")

export const tipo_documentos=new Petisions("tipo_documento")