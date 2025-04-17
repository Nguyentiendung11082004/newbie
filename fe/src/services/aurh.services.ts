import axiosClient from "./axiosClient.setup";

export const AuthServices = {
    Login : (params: any) => axiosClient.post('/auth/login', params)
}