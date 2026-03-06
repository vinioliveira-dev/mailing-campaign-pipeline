import { useCallback, useEffect } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { PIPELINE_STAGES } from '../types/pitch';
import type { Pitch, PipelineStage } from '../types/pitch';
import { setPitches, setLoading, setError, movePitch } from '../store/pitchesSlice';
import type { RootState } from '../store';
import { mockApi } from '../api/mockApi';
import { PipelineColumn } from './PipelineColumn';
import styles from './PipelineBoard.module.css';

interface PipelineBoardProps {
  /** When provided, display these pitches instead of full list (e.g. filtered by campaign). */
  pitchesOverride?: Pitch[];
}

export function PipelineBoard({ pitchesOverride }: PipelineBoardProps) {
  const dispatch = useDispatch();
  const { items: reduxPitches, loading } = useSelector((state: RootState) => state.pitches);
  const pitches = pitchesOverride ?? reduxPitches;

  const loadPitches = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await mockApi.fetchPitches();
      dispatch(setPitches(data));
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Failed to load pitches'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadPitches();
  }, [loadPitches]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const pitchId = String(active.id);
      const newStage = over.id as PipelineStage;
      const pitch = pitches.find((p) => p.id === pitchId);
      if (!pitch || pitch.stage === newStage) return;

      const validStages = PIPELINE_STAGES.map((s) => s.id);
      if (!validStages.includes(newStage)) return;

      dispatch(movePitch({ pitchId, newStage }));

      try {
        dispatch(setLoading(true));
        await mockApi.movePitch(pitchId, newStage);
      } catch {
        dispatch(movePitch({ pitchId, newStage: pitch.stage }));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, pitches]
  );

  const pitchesByStage = PIPELINE_STAGES.reduce(
    (acc, { id }) => {
      acc[id] = pitches.filter((p) => p.stage === id);
      return acc;
    },
    {} as Record<PipelineStage, typeof pitches>
  );

  if (loading && pitches.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading pipeline…</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {loading && <div className={styles.globalLoading}>Saving…</div>}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {PIPELINE_STAGES.map(({ id, label }) => (
            <PipelineColumn
              key={id}
              stageId={id}
              label={label}
              pitches={pitchesByStage[id]}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
