import { useDroppable } from '@dnd-kit/core';
import type { Pitch } from '../types/pitch';
import { PitchCard } from './PitchCard';
import styles from './PipelineColumn.module.css';

interface PipelineColumnProps {
  stageId: string;
  label: string;
  pitches: Pitch[];
  selectedPitchIds?: Set<string>;
  onTogglePitchSelect?: (id: string) => void;
}

export function PipelineColumn({
  stageId,
  label,
  pitches,
  selectedPitchIds,
  onTogglePitchSelect,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.over : ''}`}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>{pitches.length}</span>
      </div>
      <div className={styles.cards}>
        {pitches.map((pitch) => (
          <PitchCard
            key={pitch.id}
            pitch={pitch}
            isSelected={selectedPitchIds?.has(pitch.id)}
            onToggleSelect={onTogglePitchSelect}
          />
        ))}
      </div>
    </div>
  );
}
