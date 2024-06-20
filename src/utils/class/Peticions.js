import { getCookie } from "../cookie.jsx"
import {API} from "../API.jsx"
import {addOptionalQueryParams} from "../process.jsx"




export default class Petisions{
    constructor(params){
        this.params=params
    }

    async get({paramOne=null, paramTwo=null, params=null}){
        
        const token = getCookie("token")
        let url
        if(paramTwo && paramOne){
            url = `${this.params}/${paramOne}/${paramTwo}/`
            url = addOptionalQueryParams(url, params)
            return API.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
        }
        if(paramOne){
            url = `${this.params}/${paramOne}/`
            url = addOptionalQueryParams(url, params)
            return API.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
        }
        url = `${this.params}/`
        url = addOptionalQueryParams(url, params)
        return API.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    }

    async post(data){
        const token = getCookie("token")
        return API.post(`${this.params}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: data,
        })
    }

    async postData(data){
        const token = getCookie("token")
        return API.request(`${this.params}/`, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data:data
        })
    }

    async putData(data, code){
        const token = getCookie("token")
        return API.request(`${this.params}/${code}/?_method=PUT`, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data:data
        })
    }

    async put(data, code){
        const token = getCookie("token")
        return API.put(`${this.params}/${code}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: data,
        })
    }

    async delete(code){
        const token = getCookie("token")
        return API.delete(`${this.params}/${code}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    }
}