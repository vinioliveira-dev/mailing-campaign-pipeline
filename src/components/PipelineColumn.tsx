import { useDroppable } from '@dnd-kit/core';
import type { PipelineStage } from '../types/pitch';
import type { Pitch } from '../types/pitch';
import { PitchCard } from './PitchCard';
import styles from './PipelineColumn.module.css';

interface PipelineColumnProps {
  stageId: PipelineStage;
  label: string;
  pitches: Pitch[];
}

export function PipelineColumn({ stageId, label, pitches }: PipelineColumnProps) {
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
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
    </div>
  );
}
