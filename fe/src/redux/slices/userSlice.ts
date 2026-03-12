import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userInfo: any;
  accessToken: string;
  profile: any
}
const initialState: UserState = {
  userInfo: null,
  accessToken: "",
  profile: null
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<any>) => {
      state.accessToken = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
    }
  },
});
export const { setUser, clearUser, setAccessToken } = userSlice.actions;
export default userSlice.reducer;
