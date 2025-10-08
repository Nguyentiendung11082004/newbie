/// <reference types="vite/client" />
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error?.response?.status;
        const data = error?.response?.data;
        const errorMsg = Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Đã có lỗi xảy ra';
        toast.error(errorMsg);
        return Promise.reject(error);
    }
);

// ✅ Wrapper function để đúng type
export const request = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        axiosClient.get(url, config) as Promise<T>,

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        axiosClient.post(url, data, config) as Promise<T>,

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        axiosClient.put(url, data, config) as Promise<T>,

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        axiosClient.delete(url, config) as Promise<T>,
};
export default axiosClient;