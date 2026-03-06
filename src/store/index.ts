import { configureStore } from '@reduxjs/toolkit';
import pitchesReducer from './pitchesSlice';
import mailingsReducer from './mailingsSlice';

export const store = configureStore({
  reducer: {
    pitches: pitchesReducer,
    mailings: mailingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
