import axiosClient from "./axiosClient.setup";

export const StaticServices = {
    GetAdminSumary: () => axiosClient.get('/static/GetAdminSumary'),
    GetEnrolmentBySemester: () => axiosClient.get('/static/GetEnrolmentBySemester'),
    GetStudentByMajor: () => axiosClient.get('/static/GetStudentByMajor'),
}