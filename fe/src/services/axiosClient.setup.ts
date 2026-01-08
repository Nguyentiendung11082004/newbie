/// <reference types="vite/client" />
import axios, { AxiosRequestConfig } from 'axios';
import { store } from '../redux';
import { setAccessToken } from '../redux/slices/userSlice';
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = store.getState().user.accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
axiosClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        const isLoginApi = originalRequest.url?.includes("/auth/login");
        const isRefreshApi = originalRequest.url?.includes("/auth/refreshToken");
        if (
            status === 401 &&
            !originalRequest._retry &&
            !isLoginApi &&
            !isRefreshApi
        ) {
            originalRequest._retry = true;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/refreshToken`,
                    { withCredentials: true }
                );

                const newAccessToken = res.data.accessToken;
                store.dispatch(setAccessToken(newAccessToken));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error.response?.data || error);
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