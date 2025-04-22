import axiosClient from "./axiosClient.setup";

const tc = 'teachingassignment/'
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
export const TeacherServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`teacher?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`)
}
export const ClassServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`/class?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
};
export const TechingAssignmentServices = {
    GetList: () => axiosClient.get(tc + `GetAllTeachingassignment`),
    Add: (params: Record<string, any>) => axiosClient.post(`teachingassignment`, params)
}
