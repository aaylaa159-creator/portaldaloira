export type MediaKitLeadStatus = 'new' | 'contacted' | 'archived';

export interface MediaKitLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: MediaKitLeadStatus;
  created_at: string;
}
