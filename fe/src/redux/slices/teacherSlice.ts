import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TeacherServices } from "../../services/student.services";

interface TeacherState {
    data: any[];
    loading: boolean;
    error: string | null;
    filter: {
        CurrentPage: number;
        PageSize: number;
        totalDocs: number,
        totalPages: number,
    };
}
const initialState: TeacherState = {
    data: [],
    loading: false,
    error: null,
    filter: {
        CurrentPage: 1,
        PageSize: 10,
        totalDocs: 0,
        totalPages: 0,
    },
};

export const GetDataTeacher = createAsyncThunk("getTeacher", async (_, { getState }: any) => {
    const { teacher } = getState();
    const res = await TeacherServices.GetList(teacher.filter.CurrentPage, teacher.filter.PageSize);
    return res;
})

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = { ...state.filter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetDataTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetDataTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.filter.totalDocs = action.payload.data.pagination.totalDocs;
                state.filter.totalPages = action.payload.data.pagination.totalPages;
                state.filter.CurrentPage = action.payload.data.pagination.page;
                state.filter.PageSize = action.payload.data.pagination.limit;
            })
            .addCase(GetDataTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
})
export const { setFilter } = teacherSlice.actions;
export default teacherSlice.reducer;