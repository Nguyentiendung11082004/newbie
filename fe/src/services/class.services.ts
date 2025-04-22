import axiosClient from "./axiosClient.setup";
type GetClassListParams = {
    _page?: number;
    _limit?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
    name?: string;
    email?: string;
    [key: string]: any; 
};
export const ClassServices = {
    GetList: (params: GetClassListParams) => axiosClient.get('/class', { params }),
};
