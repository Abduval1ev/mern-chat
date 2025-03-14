import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "http://localhost:9080/api",
    withCredentials: true,
})

export default axiosInstance