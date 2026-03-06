import { useDraggable } from '@dnd-kit/core';
import type { Pitch } from '../types/pitch';
import styles from './PitchCard.module.css';

interface PitchCardProps {
  pitch: Pitch;
}

export function PitchCard({ pitch }: PitchCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: pitch.id, data: { pitch } });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <h3 className={styles.title}>{pitch.title}</h3>
      <div className={styles.meta}>
        <span className={styles.journalist}>{pitch.journalistName}</span>
        <span className={styles.outlet}>{pitch.outlet}</span>
      </div>
      {pitch.summary && (
        <p className={styles.summary}>{pitch.summary}</p>
      )}
    </div>
  );
}
