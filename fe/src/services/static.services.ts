import axiosClient from "./axiosClient.setup";

export const StaticServices = {
    GetAdminSumary: () => axiosClient.get('/static/GetAdminSumary'),
    GetEnrolmentBySemester: () => axiosClient.get('/static/GetEnrolmentBySemester'),
    GetStudentByMajor: () => axiosClient.get('/static/GetStudentByMajor'),
    GetPayments: (params: any) => axiosClient.get('/static/AdminGetPayments', params),

    GetAllTransactions: (params: any) => axiosClient.get('/wallet/GetAllTransactions', {
        params
    }),
}
