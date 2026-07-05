export type ContactMessageChannel = 'redacao' | 'comercial';
export type ContactMessageStatus = 'new' | 'contacted' | 'archived';

export interface ContactMessage {
  id: string;
  channel: ContactMessageChannel;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
}
