import axios from 'axios';

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
        console.error('API error:', error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
