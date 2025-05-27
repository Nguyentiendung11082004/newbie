import axiosClient from "./axiosClient.setup";

const tc = 'teachingassignment/'
export const StudentServices = {
    GetList: (params: any) => axiosClient.post('/students', params)
}

export const StudentSubjectServices = {
    GetSubjectEnroll: (params: any) => axiosClient.post('/enrollsubject/GetByIdEnrollment', params),
    AddSubjectEnroll: (params: any) => axiosClient.post('/enrollsubject/CreateEnrollment', params),
    GetTeachingAssignmentsForEnroll: (params: any) => axiosClient.post('enrollsubject/getTeachingAssignmentsForEnroll', params),
    DeleteEnroll: (id: string) => axiosClient.delete(`enrollsubject/DeleteEnroll/${id}`),
    UpdateEnroll: (id: string) => axiosClient.put(`enrollsubject/updateEnrollSubject/${id}`),
    GetEnrollmentByTeacher: (params: any) => axiosClient.post(`enrollsubject/GetEnrollmentByTeacher`, params)
}
export const SubjectServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`subject?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
    GetAll: () => axiosClient.get('subject/all'),
    Add: (params: any) => axiosClient.post(`/subject`, params)
}
export const TeacherServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`teacher?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
    GetClassesByTeacher: (params: {}) => axiosClient.post(`teacher/GetClassesByTeacher`, params),
    GetById: (params: {}) => axiosClient.post('enrollsubject/GetEnrollmentsByTeachingAssignment', params)
}
export const ClassServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`/class?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
};
export const TechingAssignmentServices = {
    GetList: () => axiosClient.get(tc + `GetAllTeachingassignment`),
    Add: (params: Record<string, any>) => axiosClient.post(tc + `CreateTeachingassignment`, params),
    GetById: (id: string) => axiosClient.get(`${tc}GetByIdTeachingassignment?id=${id}`),
    Update: (id: any, params: Record<string, any>) => axiosClient.put(tc + `UpdateTeachingassignment?id=${id}`, params),
    Delete: (id: string) => axiosClient.delete(tc + `DeleteTeachingassignment/${id}`),
}
export const AttendanceServices = {
    CreateAttendance: (pay: {}) => axiosClient.post(`/attendance/CreateAttendance`, pay)
}
export const HistoryServices = {
    GetAttendanceHistory: (id: string, from: string, to: string) => axiosClient.get(`attendance?teaching_assignment_id=${id}&from=${from}&to=${to}`)
}