export type PipelineStage =
  | 'draft'
  | 'sent'
  | 'replied'
  | 'covered'
  | 'declined';

export interface Pitch {
  id: string;
  title: string;
  journalistName: string;
  outlet: string;
  stage: PipelineStage;
  createdAt: string; // ISO date
  updatedAt: string;
  summary?: string;
  campaignId?: string;
}

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'replied', label: 'Replied' },
  { id: 'covered', label: 'Covered' },
  { id: 'declined', label: 'Declined' },
];
