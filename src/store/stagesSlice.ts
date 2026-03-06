import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StageDefinition } from '../types/pitch';

export interface StagesState {
  customStages: StageDefinition[];
}

const initialState: StagesState = {
  customStages: [],
};

const stagesSlice = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    addCustomStage: (state, action: PayloadAction<StageDefinition>) => {
      if (!state.customStages.some((s) => s.id === action.payload.id)) {
        state.customStages.push(action.payload);
      }
    },
    removeCustomStage: (state, action: PayloadAction<string>) => {
      state.customStages = state.customStages.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addCustomStage, removeCustomStage } = stagesSlice.actions;
export default stagesSlice.reducer;
