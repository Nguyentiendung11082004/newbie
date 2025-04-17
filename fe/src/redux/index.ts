// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import subjectReducer from './slices/subjectSlice';
const persistConfig = {
    key: 'root',
    storage,
};
// persistStore lưu vào locastogare
const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        subject: subjectReducer,
    },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;