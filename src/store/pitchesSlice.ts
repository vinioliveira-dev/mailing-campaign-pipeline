import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pitch, PipelineStage } from '../types/pitch';

export interface PitchesState {
  items: Pitch[];
  loading: boolean;
  error: string | null;
}

const initialState: PitchesState = {
  items: [],
  loading: false,
  error: null,
};

const pitchesSlice = createSlice({
  name: 'pitches',
  initialState,
  reducers: {
    setPitches: (state, action: PayloadAction<Pitch[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    movePitch: (
      state,
      action: PayloadAction<{ pitchId: string; newStage: PipelineStage }>
    ) => {
      const { pitchId, newStage } = action.payload;
      const pitch = state.items.find((p) => p.id === pitchId);
      if (pitch) {
        pitch.stage = newStage;
        pitch.updatedAt = new Date().toISOString();
      }
    },
    addPitch: (state, action: PayloadAction<Pitch>) => {
      state.items.push(action.payload);
    },
    removePitch: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    updatePitch: (state, action: PayloadAction<Partial<Pitch> & { id: string }>) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
  },
});

export const {
  setPitches,
  setLoading,
  setError,
  movePitch,
  addPitch,
  removePitch,
  updatePitch,
} = pitchesSlice.actions;
export default pitchesSlice.reducer;
