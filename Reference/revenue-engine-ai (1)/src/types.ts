export interface Product {
  id: number;
  name: string;
  description: string;
  hypothesis: string;
  pricing: string;
  created_at: string;
}

export interface ICP {
  id: number;
  product_id: number;
  persona: string;
  pain_mapping: string;
  transformation: string;
  offer: string;
  objection_handling: string;
}

export interface Contact {
  id: number;
  product_id: number;
  name: string;
  company: string;
  role: string;
  channel: string;
  status: 'lead' | 'contacted' | 'replied' | 'booked' | 'paying' | 'lost';
  reply_type?: 'positive' | 'curious' | 'objection' | 'price_sensitive' | 'referral' | 'ghosted';
  revenue_value: number;
  last_contacted_at?: string;
}

export interface Stats {
  total_outreach: number;
  total_replies: number;
  total_booked: number;
  total_paying: number;
  total_revenue: number;
}
