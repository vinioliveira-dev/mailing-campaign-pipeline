export type MailingStatus = 'draft' | 'scheduled' | 'sent';

export interface Mailing {
  id: string;
  subject: string;
  createdAt: string; // ISO date
  updatedAt: string;
  status: MailingStatus;
  campaignId: string;
  recipientCount: number;
  sentAt?: string; // ISO date, when status is 'sent'
  scheduledFor?: string; // ISO date, when status is 'scheduled'
}
