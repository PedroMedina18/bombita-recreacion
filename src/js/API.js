import axios from 'axios'
import { getCookie } from "../js/cookie.js"


const API = axios.create({
    baseURL: "http://127.0.0.1:8000/API/v1/",
})

export const login = async (data) => {
    return API.post("login/", data)
}

export const post_cargos = async (data) => {
    const token = getCookie("token")
    return API.post("cargos/", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: data,
    })
}
export const post_tipoDocumento = async (data) => {
    const token = getCookie("token")
    return API.post("tipo_documento/", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: data,
    })
}

export const verify_token = async () => {
    const token = getCookie("token")
    return API.get("verify/", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
}

export const permisos_get = async () => {
    const token = getCookie("token")
    return API.get("permisos/", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
}