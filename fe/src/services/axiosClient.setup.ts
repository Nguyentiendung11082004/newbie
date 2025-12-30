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

// axiosClient.interceptors.response.use(
//     (response) => response.data,
//     async (error) => {
//         const originalRequest = error.config;
//         const status = error?.response?.status;

//         // Nếu 401 → thử refresh token
//         if (status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const res: any = await axiosClient.get("/refreshToken", { withCredentials: true });
//                 const newAccessToken = res.accessToken;
//                 // update accessToken vào state
//                 store.dispatch(setAccessToken(newAccessToken));
//                 // retry lại request cũ với token mới
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return axiosClient(originalRequest);
//             } catch (err) {
//                 // refresh token hết hạn → logout
//                 // store.dispatch(handleLogout());
//                 return Promise.reject(err);
//             }
//         }
//         return Promise.reject(error);
//     }
//     // (error) => {
//     //     const status = error?.response?.status;
//     //     const data = error?.response?.data;
//     //     const errorMsg = Array.isArray(data?.message)
//     //         ? data.message.join(', ')
//     //         : data?.message || 'Đã có lỗi xảy ra';
//     //     toast.error(errorMsg);
//     //     return Promise.reject(error);
//     // }
// );
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