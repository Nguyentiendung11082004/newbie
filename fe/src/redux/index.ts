import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './slices/userSlice';
import subjectReducer from './slices/subjectSlice';
import teacherReducer from './slices/teacherSlice';
import classReducer from './slices/classSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    subject: subjectReducer,
    teacher: teacherReducer,
    class: classReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // 🔥 Bỏ check mấy action này
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
