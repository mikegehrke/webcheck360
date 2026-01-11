import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbAudit {
  id: string;
  url: string;
  domain: string;
  score_total: number;
  score_performance: number;
  score_mobile_ux: number;
  score_seo: number;
  score_trust: number;
  score_conversion: number;
  issues: any[];
  screenshot_desktop: string | null;
  screenshot_mobile: string | null;
  industry: string | null;
  goal: string | null;
  created_at: string;
}

export interface DbLead {
  id: string;
  audit_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}

// Audit functions
export async function createAudit(audit: Omit<DbAudit, 'created_at'>): Promise<DbAudit | null> {
  const { data, error } = await supabase
    .from('audits')
    .insert([audit])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating audit:', error);
    return null;
  }
  return data;
}

export async function getAudit(id: string): Promise<DbAudit | null> {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error getting audit:', error);
    return null;
  }
  return data;
}

export async function getAllAudits(): Promise<DbAudit[]> {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting audits:', error);
    return [];
  }
  return data || [];
}

// Lead functions
export async function createLead(lead: Omit<DbLead, 'created_at'>): Promise<DbLead | null> {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating lead:', error);
    return null;
  }
  return data;
}

export async function getLeadByAuditId(auditId: string): Promise<DbLead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('audit_id', auditId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Error getting lead:', error);
  }
  return data || null;
}

export async function getAllLeads(): Promise<DbLead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting leads:', error);
    return [];
  }
  return data || [];
}
