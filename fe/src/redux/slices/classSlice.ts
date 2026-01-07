import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ClassServices } from "../../services/student.services";
import { ApiResponse } from "../../types/api";
// import { RootState } from "redux";
interface Class {
    _id: string;
    name: string;
    // Thêm field khác nếu có
  }
  
interface ClassState {
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
const initialState: ClassState = {
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

export const GetDataClass = createAsyncThunk<ApiResponse<any[]>, void, { state: any }>("getClass", async (_, { getState }: any) => {
    const { class: classState } = getState();
    const res = await ClassServices.GetList(classState.filter.CurrentPage, classState.filter.PageSize);
    return res;
})
const classSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = { ...state.filter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetDataClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetDataClass.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.filter.totalDocs = action.payload.pagination.totalDocs;
                state.filter.totalPages = action.payload.pagination.totalPages;
                state.filter.CurrentPage = action.payload.pagination.page;
                state.filter.PageSize = action.payload.pagination.limit;
            })
            .addCase(GetDataClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
})
export const { setFilter } = classSlice.actions;
export default classSlice.reducer;