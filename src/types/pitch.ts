/** Default stage ids; custom stages use ids like "custom-xxx" */
export type PipelineStage =
  | 'draft'
  | 'sent'
  | 'replied'
  | 'covered'
  | 'declined'
  | (string & {});

export interface StageDefinition {
  id: string;
  label: string;
}

export interface Pitch {
  id: string;
  title: string;
  journalistName: string;
  outlet: string;
  stage: string; // default stage ids or custom stage id
  createdAt: string; // ISO date
  updatedAt: string;
  summary?: string;
  campaignId?: string;
}

export const DEFAULT_PIPELINE_STAGES: StageDefinition[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'replied', label: 'Replied' },
  { id: 'covered', label: 'Covered' },
  { id: 'declined', label: 'Declined' },
];

/** @deprecated Use DEFAULT_PIPELINE_STAGES */
export const PIPELINE_STAGES = DEFAULT_PIPELINE_STAGES;
