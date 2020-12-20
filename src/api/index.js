import axios from 'axios'

let token = null

export const setToken = (getToken)=>{
    token =  getToken
}

export default axios.create({
    baseURL:'http://localhost:5001',
    headers:{
        'Authorization':`Bearer ${token}`
    }
})

