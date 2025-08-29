import { ApiResponse } from "../types/api";
import axiosClient, { request } from "./axiosClient.setup";
const tc = 'teachingassignment/'
export const StudentServices = {
    GetList: (params: any) => request.post<ApiResponse<any[]>>('/students', params),
    Export: () => axiosClient.get('/students/export-student')
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
    GetList: (page: number, limit: number) => request.get<ApiResponse<any[]>>(`/subject?page=${page}&limit=${limit}`),
    GetAll: () => axiosClient.get('subject/all'),
    Add: (params: any) => axiosClient.post(`/subject`, params)
}
export const TeacherServices = {
    GetList: (page: number, limit: any) => axiosClient.get(`teacher?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
    GetClassesByTeacher: (params: {}) => axiosClient.post(`teacher/GetClassesByTeacher`, params),
    GetById: (params: {}) => axiosClient.post('enrollsubject/GetEnrollmentsByTeachingAssignment', params)
}
export const ClassServices = {
    GetList: (page: number, limit: any) => request.get<ApiResponse<any[]>>(`/class?_page=${page}&_limit=${limit}&_sort=createdAt&_order=asc`),
};
export const TechingAssignmentServices = {
    GetList: () => axiosClient.get(tc + `GetAllTeachingassignment`),
    Add: (params: Record<string, any>) => axiosClient.post(tc + `CreateTeachingassignment`, params),
    GetById: (id: string) => axiosClient.get(`${tc}GetByIdTeachingassignment?id=${id}`),
    Update: (id: any, params: Record<string, any>) => axiosClient.put(tc + `UpdateTeachingassignment?id=${id}`, params),
    Delete: (id: string) => axiosClient.delete(tc + `DeleteTeachingassignment/${id}`),
}
export const AttendanceServices = {
    CreateAttendance: (pay: {}) => request.post<ApiResponse<any[]>>(`/attendance/CreateAttendance`, pay)
}
export const HistoryServices = {
    GetAttendanceHistory: (id: string, from: string, to: string) => axiosClient.get(`attendance?teaching_assignment_id=${id}&from=${from}&to=${to}`)
}
export const GradeServices = {
    GetStudentForGrading: (params) => axiosClient.post(`grade/GetStudentListForGrading`, params),
    CreateGrade: (params) => axiosClient.post(`grade/CreateGrade`, params),
    GetMyGrades: (params) => axiosClient.post(`grade/GetMyGrades`, params),
}
export const LeaveServices = {
    GetAllLeave: (params) => request.post<ApiResponse<any[]>>(`leaverequest/GetAllLeave`, params),
    CreateLeave: (params) => request.post<ApiResponse<any[]>>(`leaverequest/CreateLeave`, params),
    ApproveLeave: (params) => request.post<ApiResponse<any[]>>(`leaverequest/ApproveLeave`, params),
}
export const StudentWalletServices = {
    GetStudentWalletById: (params) => request.post<ApiResponse<any[]>>(`wallet/GetStudentWalletById`, params),
    TopUpWallter: (payload) => request.post<ApiResponse<any[]>>(`wallet/TopUpWallter`, payload),
    MakePayment: (payload) => request.post<ApiResponse<any[]>>(`wallet/MakePayment`, payload),
    GetDebtWallter: () => request.get<ApiResponse<any[]>>(`wallet/GetDebtWallter`)
}
export const TimetableServices = {
    GetStudentTimetable: (payload) => request.post<ApiResponse<any[]>>(`students/GetStudentTimeTable`, payload)
}