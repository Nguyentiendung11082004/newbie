import axiosClient from "./axiosClient.setup";

export const StudentServices = {
    GetList: (params: any) => axiosClient.post('/students', params)
}

export const StudentSubjectServices = {
    GetSubjectEnroll: (params:any) => axiosClient.post('/enrollsubject/enrollment', params)
}