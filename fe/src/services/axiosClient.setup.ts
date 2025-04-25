import axios from 'axios';
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
        // const token = localStorage.getItem('token');
        // if (token && config.headers) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error?.response?.status;
        const data = error?.response?.data;

        // Chỉ toast những lỗi không phải validation
        if (status !== 400) {
            const errorMsg = data?.message?.join(', ') || 'Đã có lỗi xảy ra';
            toast.error(errorMsg);
        }

        return Promise.reject(error);
    }
);


export default axiosClient;
