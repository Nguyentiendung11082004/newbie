import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SubjectServices } from "../../services/student.services";

interface SubjectState {
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

const initialState: SubjectState = {
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

export const GetDataSubject = createAsyncThunk("getSubject", async (_, { getState }: any) => {
    const { subject } = getState();
    const res = await SubjectServices.GetList(subject.filter.CurrentPage, subject.filter.PageSize);
    return res;
}
);

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = { ...state.filter, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetDataSubject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetDataSubject.fulfilled, (state, action) => {
                console.log("state",state.filter)
                console.log("action.payload",action.payload)
                state.loading = false;
                state.data = action.payload.data;
                state.filter.totalDocs = action.payload.data.pagination.totalDocs;
                state.filter.totalPages = action.payload.data.pagination.totalPages;
                state.filter.CurrentPage = action.payload.data.pagination.page;
                state.filter.PageSize = action.payload.data.pagination.limit;
            })
            .addCase(GetDataSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
});

export const { setFilter } = subjectSlice.actions;
export default subjectSlice.reducer;
