import axiosClient from "./axiosClient.setup";

export const AuthServices = {
    Login: (params: any) => axiosClient.post('/auth/login', params),
    Logout: (token: any) => axiosClient.post('/auth/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    Register: (params:any) => axiosClient.post('/auth/register', params)
}