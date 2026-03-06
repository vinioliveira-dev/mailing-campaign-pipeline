import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Mailing } from '../types/mailing';
import { MOCK_MAILINGS } from '../data/mockMailings';

export interface MailingsState {
  items: Mailing[];
  selectedId: string | null;
  loading: boolean;
}

const initialState: MailingsState = {
  items: [...MOCK_MAILINGS],
  selectedId: MOCK_MAILINGS[0]?.id ?? null,
  loading: false,
};

const mailingsSlice = createSlice({
  name: 'mailings',
  initialState,
  reducers: {
    setMailings: (state, action: PayloadAction<Mailing[]>) => {
      state.items = action.payload;
    },
    setSelectedMailingId: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    setMailingsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setMailings, setSelectedMailingId, setMailingsLoading } = mailingsSlice.actions;
export default mailingsSlice.reducer;
