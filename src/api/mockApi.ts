import type { Pitch } from '../types/pitch';
import type { Mailing } from '../types/mailing';
import { MOCK_PITCHES } from '../data/mockPitches';
import { MOCK_MAILINGS } from '../data/mockMailings';

const FAKE_DELAY_MS = 600;

function delay(ms: number = FAKE_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockApi = {
  async fetchPitches(): Promise<Pitch[]> {
    await delay();
    return [...MOCK_PITCHES];
  },

  async movePitch(pitchId: string, newStage: string): Promise<Pitch> {
    await delay(400);
    const pitch = MOCK_PITCHES.find((p) => p.id === pitchId);
    if (!pitch) throw new Error('Pitch not found');
    return { ...pitch, stage: newStage, updatedAt: new Date().toISOString() };
  },

  async createPitch(pitch: Omit<Pitch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pitch> {
    await delay(500);
    const now = new Date().toISOString();
    return {
      ...pitch,
      id: `new-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
  },

  async deletePitch(_pitchId: string): Promise<void> {
    await delay(300);
  },

  async fetchMailings(): Promise<Mailing[]> {
    await delay();
    return [...MOCK_MAILINGS];
  },
};
