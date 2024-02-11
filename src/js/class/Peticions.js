import { getCookie } from "../cookie.js"
import {API} from "../API.js"




export default class Petisions{
    constructor(params){
        this.params=params
        this.token= getCookie("token")
    }

    async get(paramOne=null, paramTwo=null){
        if(paramTwo){
            return API.get(`${this.params}/${paramOne}/${paramTwo}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`
                }
            })
        }
        if(paramOne){
            return API.get(`${this.params}/${paramOne}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`
                }
            })
        }
        return API.get(`${this.params}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`
            }
        })
    }

    async post(data){
        return API.post(`${this.params}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`
            },
            body: data,
        })
    }
}