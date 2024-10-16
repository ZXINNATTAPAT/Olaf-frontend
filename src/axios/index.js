import axios from "axios"

// const API_URL = "http://127.0.0.1:8000/api/"
const API_URL = process.env.REACT_APP_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export const axiosInstanceGet = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const axiosPrivateInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})