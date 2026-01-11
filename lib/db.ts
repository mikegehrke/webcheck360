// Database - Vercel compatible (in-memory on serverless)
import { v4 as uuidv4 } from 'uuid';
import { Audit, Lead, AdminNote, LeadStatus, AuditScores, AuditIssue, AuditScreenshots } from './types';

// Check if we're on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// In-memory storage for Vercel (data doesn't persist between requests)
let memoryDb = {
  audits: [] as Audit[],
  leads: [] as Lead[],
  notes: [] as AdminNote[]
};

// Database schema
interface DbSchema {
  audits: Audit[];
  leads: Lead[];
  notes: AdminNote[];
}

// Lazy-initialized lowdb (only for local development)
let db: any = null;
let dbInitialized = false;

async function getDb() {
  // On Vercel: Use in-memory storage
  if (isVercel) {
    return null;
  }
  
  // Local: Use lowdb
  if (!dbInitialized) {
    try {
      const { Low } = await import('lowdb');
      const { JSONFile } = await import('lowdb/node');
      const path = await import('path');
      const fs = await import('fs');
      
      const DATA_DIR = path.join(process.cwd(), 'data');
      const DB_PATH = path.join(DATA_DIR, 'db.json');
      
      // Ensure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      const defaultData: DbSchema = { audits: [], leads: [], notes: [] };
      const adapter = new JSONFile<DbSchema>(DB_PATH);
      db = new Low<DbSchema>(adapter, defaultData);
      
      await db.read();
      if (!db.data) {
        db.data = defaultData;
        await db.write();
      }
    } catch (err) {
      console.error('Failed to initialize lowdb:', err);
      db = null;
    }
    dbInitialized = true;
  }
  
  return db;
}

// Helper functions
export async function createAudit(data: {
  url: string;
  domain: string;
  score_total: number;
  scores: AuditScores;
  issues: AuditIssue[];
  screenshots: AuditScreenshots;
  raw_data?: Record<string, unknown>;
  industry?: string;
  goal?: string;
}): Promise<Audit> {
  const audit: Audit = {
    id: uuidv4(),
    url: data.url,
    domain: data.domain,
    score_total: data.score_total,
    scores: data.scores,
    issues: data.issues,
    screenshots: data.screenshots,
    raw_data: data.raw_data || {},
    industry: data.industry,
    goal: data.goal,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const localDb = await getDb();
  if (localDb) {
    await localDb.read();
    localDb.data!.audits.push(audit);
    await localDb.write();
  } else {
    memoryDb.audits.push(audit);
  }
  
  return audit;
}

export async function getAuditById(id: string): Promise<Audit | null> {
  const localDb = await getDb();
  if (localDb) {
    await localDb.read();
    return localDb.data!.audits.find((a: Audit) => a.id === id) || null;
  }
  return memoryDb.audits.find(a => a.id === id) || null;
}

export async function getAuditWithLead(id: string) {
  const localDb = await getDb();
  
  if (localDb) {
    await localDb.read();
    const audit = localDb.data!.audits.find((a: Audit) => a.id === id);
    if (!audit) return null;
    const lead = localDb.data!.leads.find((l: Lead) => l.audit_id === id);
    const notes = localDb.data!.notes.filter((n: AdminNote) => n.audit_id === id);
    return { ...audit, lead, notes };
  }
  
  const audit = memoryDb.audits.find(a => a.id === id);
  if (!audit) return null;
  const lead = memoryDb.leads.find(l => l.audit_id === id);
  const notes = memoryDb.notes.filter(n => n.audit_id === id);
  return { ...audit, lead, notes };
}

export async function getAllAudits(limit = 100, offset = 0) {
  const localDb = await getDb();
  
  const audits = localDb 
    ? (await (async () => { await localDb.read(); return localDb.data!.audits; })())
    : memoryDb.audits;
  
  const leads = localDb 
    ? localDb.data!.leads 
    : memoryDb.leads;
  
  return audits
    .sort((a: Audit, b: Audit) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(offset, offset + limit)
    .map((audit: Audit) => {
      const lead = leads.find((l: Lead) => l.audit_id === audit.id);
      return {
        ...audit,
        hasEmail: Boolean(lead?.email),
        status: lead?.status || 'new' as LeadStatus
      };
    });
}

export async function createLead(data: {
  audit_id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent: boolean;
}): Promise<Lead> {
  const localDb = await getDb();
  
  if (localDb) {
    await localDb.read();
    const existing = localDb.data!.leads.find((l: Lead) => l.audit_id === data.audit_id);
    if (existing) {
      existing.name = data.name || existing.name;
      existing.email = data.email || existing.email;
      existing.phone = data.phone || existing.phone;
      existing.message = data.message || existing.message;
      existing.consent = data.consent;
      existing.updated_at = new Date().toISOString();
      await localDb.write();
      return existing;
    }
  }
  
  const lead: Lead = {
    id: uuidv4(),
    audit_id: data.audit_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    consent: data.consent,
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (localDb) {
    localDb.data!.leads.push(lead);
    await localDb.write();
  } else {
    memoryDb.leads.push(lead);
  }
  
  return lead;
}

export async function updateLeadStatus(auditId: string, status: LeadStatus): Promise<Lead | null> {
  const localDb = await getDb();
  
  if (localDb) {
    await localDb.read();
    const lead = localDb.data!.leads.find((l: Lead) => l.audit_id === auditId);
    if (!lead) return null;
    lead.status = status;
    lead.updated_at = new Date().toISOString();
    await localDb.write();
    return lead;
  }
  
  const lead = memoryDb.leads.find(l => l.audit_id === auditId);
  if (!lead) return null;
  lead.status = status;
  lead.updated_at = new Date().toISOString();
  return lead;
}

export async function addNote(auditId: string, content: string): Promise<AdminNote> {
  const note: AdminNote = {
    id: uuidv4(),
    audit_id: auditId,
    content,
    created_at: new Date().toISOString()
  };
  
  const localDb = await getDb();
  if (localDb) {
    await localDb.read();
    localDb.data!.notes.push(note);
    await localDb.write();
  } else {
    memoryDb.notes.push(note);
  }
  
  return note;
}

export async function getAuditStats() {
  const localDb = await getDb();
  
  const audits = localDb 
    ? (await (async () => { await localDb.read(); return localDb.data!.audits; })())
    : memoryDb.audits;
  
  const leads = localDb ? localDb.data!.leads : memoryDb.leads;
  
  const today = new Date().toISOString().split('T')[0];
  const auditsToday = audits.filter((a: Audit) => a.created_at.startsWith(today));
  const leadsWithEmail = leads.filter((l: Lead) => l.email);
  const avgScore = audits.length > 0
    ? Math.round(audits.reduce((sum: number, a: Audit) => sum + a.score_total, 0) / audits.length)
    : 0;
  
  return {
    total: audits.length,
    leads: leadsWithEmail.length,
    avgScore,
    today: auditsToday.length
  };
}

export async function getNotesForAudit(auditId: string) {
  const localDb = await getDb();
  
  const notes = localDb 
    ? (await (async () => { await localDb.read(); return localDb.data!.notes; })())
    : memoryDb.notes;
  
  return notes
    .filter((n: AdminNote) => n.audit_id === auditId)
    .sort((a: AdminNote, b: AdminNote) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getLeadByAuditId(auditId: string) {
  const localDb = await getDb();
  
  if (localDb) {
    await localDb.read();
    return localDb.data!.leads.find((l: Lead) => l.audit_id === auditId) || null;
  }
  return memoryDb.leads.find(l => l.audit_id === auditId) || null;
}

export async function getAllLeads(limit = 100) {
  const localDb = await getDb();
  
  const leads = localDb 
    ? (await (async () => { await localDb.read(); return localDb.data!.leads; })())
    : memoryDb.leads;
  
  const audits = localDb ? localDb.data!.audits : memoryDb.audits;
  
  return leads
    .sort((a: Lead, b: Lead) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
    .map((lead: Lead) => {
      const audit = audits.find((a: Audit) => a.id === lead.audit_id);
      return {
        ...lead,
        url: audit?.url,
        domain: audit?.domain,
        score_total: audit?.score_total
      };
    });
}

export default { getDb };
