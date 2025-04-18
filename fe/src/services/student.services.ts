import axiosClient from "./axiosClient.setup";

export const StudentServices = {
    GetList: (params: any) => axiosClient.post('/students', params)
}

export const StudentSubjectServices = {
    GetSubjectEnroll: (params: any) => axiosClient.post('/enrollsubject/enrollment', params),
    AddSubjectEnroll: (params: any) => axiosClient.post('/enrollsubject', params)
}
export const SubjectServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`subject?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
    GetAll: () => axiosClient.get('subject/all'),
    Add: (params: any) => axiosClient.post(`/subject`, params)
}