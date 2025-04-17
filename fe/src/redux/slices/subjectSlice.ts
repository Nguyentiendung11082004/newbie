import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SubjectServices } from "../../services/student.services";

interface SubjectState {
    data: any[];
    loading: boolean;
    error: string | null;
    filter: {
        CurrentPage: number;
        PageSize: number;
    };
}

const initialState: SubjectState = {
    data: [],
    loading: false,
    error: null,
    filter: {
        CurrentPage: 1,
        PageSize: 10,
    },
};

export const GetDataSubject = createAsyncThunk("getSubject", async (_, { getState }: any) => {
    const { subject } = getState();
    console.log(getState());
    const res = await SubjectServices.GetList(subject.filter.CurrentPage, subject.filter.PageSize);
    return res.data;
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
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(GetDataSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
});

export const { setFilter } = subjectSlice.actions;
export default subjectSlice.reducer;
