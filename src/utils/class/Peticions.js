import { getCookie } from "../cookie.jsx"
import {API} from "../API.jsx"




export default class Petisions{
    constructor(params){
        this.params=params
    }

    async get(paramOne=null, paramTwo=null){
        const token=getCookie("token")
        if(paramTwo){
            return API.get(`${this.params}/${paramOne}/${paramTwo}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
        }
        if(paramOne){
            return API.get(`${this.params}/${paramOne}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
        }
        return API.get(`${this.params}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    }

    async post(data){
        const token=getCookie("token")
        return API.post(`${this.params}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: data,
        })
    }

    async postData(data){
        const token=getCookie("token")
        return API.request(`${this.params}/`, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data:data
        })
    }

    async delete(code){
        const token=getCookie("token")
        return API.delete(`${this.params}/${code}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    }
}