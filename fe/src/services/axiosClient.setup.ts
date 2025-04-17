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
    (response) => response.data,  // Trả về data bình thường khi không có lỗi
    (error) => {
        // Lấy thông báo lỗi từ response (ví dụ, message array)
        const errorMsg = error?.response?.data?.message?.join(', ') || 'Lỗi';
        toast.error(errorMsg); // Hiển thị thông báo lỗi cho người dùng

        // Trả lại lỗi để có thể catch ở nơi gọi
        return Promise.reject(error);
    }
);


export default axiosClient;
