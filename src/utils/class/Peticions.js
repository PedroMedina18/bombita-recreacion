import { getCookie } from "../cookie.jsx"
import { API } from "../API.jsx"
import { addOptionalQueryParams, addOptionalSubDomains } from "../process.jsx"

export default class Petisions {
    constructor(dominio) {
        this.dominio = dominio
    }

    async get({ subDominio = [], params = null } = {}) {
        const token = getCookie("token")
        let url = `${this.dominio}/`
        url = addOptionalSubDomains(url, subDominio)
        url = addOptionalQueryParams(url, params)
        return API.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    }

    async post(data, { subDominio = [], params = null} = {}) {
        const token = getCookie("token")
        let url = `${this.dominio}/`
        url = addOptionalSubDomains(url, subDominio)
        url = addOptionalQueryParams(url, params)
        return API.post(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: data,
        })
    }

    async postData(data, { subDominio = [], params = null} = {}) {
        const token = getCookie("token")
        let url = `${this.dominio}/`
        url = addOptionalSubDomains(url, subDominio)
        url = addOptionalQueryParams(url, params)
        return API.request(url, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data: data
        })
    }

    async putData(data, code) {
        const token = getCookie("token")
        return API.request(`${this.dominio}/${code}/?_method=PUT`, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data: data
        })
    }

    async put(data, code) {
        const token = getCookie("token")
        return API.put(`${this.dominio}/${code}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: data,
        })
    }

    async delete(code) {
        const token = getCookie("token")
        return API.delete(`${this.dominio}/${code}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    }
}