// Audit Types
export interface AuditScores {
  performance: number;
  mobile_ux: number;
  seo: number;
  trust: number;
  conversion: number;
}

export interface AuditIssue {
  id: string;
  category: keyof AuditScores;
  severity: 'critical' | 'high' | 'warning' | 'low' | 'info';
  title: string;
  description: string;
  impact?: string;
  recommendation: string;
}

export interface AuditScreenshots {
  desktop: string | null;
  mobile: string | null;
}

export interface Audit {
  id: string;
  url: string;
  domain: string;
  score_total: number;
  scores: AuditScores;
  issues: AuditIssue[];
  screenshots: AuditScreenshots;
  raw_data: Record<string, unknown>;
  industry?: string;
  goal?: string;
  created_at: string;
  updated_at: string;
}

// Lead Types
export type LeadStatus = 'new' | 'contacted' | 'meeting' | 'proposal' | 'closed';

export interface Lead {
  id: string;
  audit_id: string;
  name?: string;
  email?: string;
  consent: boolean;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

// Admin Note Types
export interface AdminNote {
  id: string;
  audit_id: string;
  content: string;
  created_at: string;
}

// Combined Types for Admin Panel
export interface AuditWithLead extends Audit {
  lead?: Lead;
  notes?: AdminNote[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnalyzeRequest {
  url: string;
  industry?: string;
  goal?: string;
}

export interface AnalyzeResponse {
  auditId: string;
  score: number;
  scores: AuditScores;
  issues: AuditIssue[];
  screenshots: AuditScreenshots;
}

export interface LeadCreateRequest {
  audit_id: string;
  name?: string;
  email?: string;
  consent: boolean;
}

// Filter Types for Admin
export interface AuditFilters {
  hasEmail?: boolean;
  scoreBelow?: number;
  status?: LeadStatus;
  industry?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Score Engine Config
export interface ScoreWeights {
  performance: number;
  mobile_ux: number;
  seo: number;
  trust: number;
  conversion: number;
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  performance: 0.30,
  mobile_ux: 0.25,
  seo: 0.20,
  trust: 0.15,
  conversion: 0.10,
};

// Funnel State
export interface FunnelState {
  step: 1 | 2 | 3 | 4;
  url: string;
  industry: string;
  goal: string;
  auditId: string | null;
  audit: Audit | null;
  isLoading: boolean;
  error: string | null;
}
