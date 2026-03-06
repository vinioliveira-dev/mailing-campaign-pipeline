import { useCallback, useEffect, useMemo } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_PIPELINE_STAGES } from '../types/pitch';
import type { Pitch } from '../types/pitch';
import type { StageDefinition } from '../types/pitch';
import { setPitches, setLoading, setError, movePitch, setPitchesStage } from '../store/pitchesSlice';
import type { RootState } from '../store';
import { mockApi } from '../api/mockApi';
import { PipelineColumn } from './PipelineColumn';
import styles from './PipelineBoard.module.css';

interface PipelineBoardProps {
  /** When provided, display these pitches instead of full list (e.g. filtered by campaign). */
  pitchesOverride?: Pitch[];
  selectedPitchIds?: Set<string>;
  onTogglePitchSelect?: (id: string) => void;
  onClearSelection?: () => void;
  allStages?: StageDefinition[];
  onAddStage?: () => void;
}

export function PipelineBoard({
  pitchesOverride,
  selectedPitchIds = new Set(),
  onTogglePitchSelect,
  onClearSelection,
  allStages,
  onAddStage,
}: PipelineBoardProps) {
  const dispatch = useDispatch();
  const { items: reduxPitches, loading } = useSelector((state: RootState) => state.pitches);
  const customStages = useSelector((state: RootState) => state.stages.customStages);

  const stages = allStages ?? [...DEFAULT_PIPELINE_STAGES, ...customStages];

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
      const newStage = String(over.id);
      const pitch = pitches.find((p) => p.id === pitchId);
      if (!pitch || pitch.stage === newStage) return;

      const validStageIds = stages.map((s) => s.id);
      if (!validStageIds.includes(newStage)) return;

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
    [dispatch, pitches, stages]
  );

  const handleBulkSetStage = useCallback(
    async (newStage: string) => {
      const ids = Array.from(selectedPitchIds);
      if (ids.length === 0) return;
      dispatch(setPitchesStage({ pitchIds: ids, newStage }));
      onClearSelection?.();
      try {
        dispatch(setLoading(true));
        await Promise.all(ids.map((id) => mockApi.movePitch(id, newStage)));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, selectedPitchIds, onClearSelection]
  );

  const pitchesByStage = useMemo(
    () =>
      stages.reduce<Record<string, Pitch[]>>(
        (acc, { id }) => {
          acc[id] = pitches.filter((p) => p.stage === id);
          return acc;
        },
        {}
      ),
    [pitches, stages]
  );

  if (loading && pitches.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading pipeline…</div>
      </div>
    );
  }

  const selectedCount = selectedPitchIds.size;

  return (
    <div className={styles.wrapper}>
      {loading && <div className={styles.globalLoading}>Saving…</div>}
      {selectedCount > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkLabel}>
            {selectedCount} selected
          </span>
          <div className={styles.bulkActions}>
            <label className={styles.bulkSetLabel}>
              Set status to
              <select
                className={styles.bulkSelect}
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) handleBulkSetStage(v);
                  e.target.value = '';
                }}
                aria-label="Set status for selected"
              >
                <option value="" disabled>Choose…</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={onClearSelection} className={styles.bulkClear}>
              Clear selection
            </button>
          </div>
        </div>
      )}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {stages.map(({ id, label }) => (
            <PipelineColumn
              key={id}
              stageId={id}
              label={label}
              pitches={pitchesByStage[id] ?? []}
              selectedPitchIds={selectedPitchIds}
              onTogglePitchSelect={onTogglePitchSelect}
            />
          ))}
          {onAddStage && (
            <div className={styles.addColumn}>
              <button type="button" onClick={onAddStage} className={styles.addColumnBtn}>
                + Add status
              </button>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}
