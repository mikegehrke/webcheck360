import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Audit, Lead, AdminNote, LeadStatus, AuditScores, AuditIssue, AuditScreenshots } from './types';

// Database schema
interface DbSchema {
  audits: Audit[];
  leads: Lead[];
  notes: AdminNote[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default data
const defaultData: DbSchema = {
  audits: [],
  leads: [],
  notes: []
};

// Initialize database
const adapter = new JSONFile<DbSchema>(DB_PATH);
const db = new Low<DbSchema>(adapter, defaultData);

// Initialize on first import
async function initDb() {
  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
}

// Call init
initDb();

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
  await db.read();
  
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
  
  db.data!.audits.push(audit);
  await db.write();
  
  return audit;
}

export async function getAuditById(id: string): Promise<Audit | null> {
  await db.read();
  return db.data!.audits.find(a => a.id === id) || null;
}

export async function getAuditWithLead(id: string) {
  await db.read();
  const audit = db.data!.audits.find(a => a.id === id);
  if (!audit) return null;
  
  const lead = db.data!.leads.find(l => l.audit_id === id);
  const notes = db.data!.notes.filter(n => n.audit_id === id);
  
  return { ...audit, lead, notes };
}

export async function getAllAudits(limit = 100, offset = 0) {
  await db.read();
  
  const audits = db.data!.audits
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(offset, offset + limit);
  
  return audits.map(audit => {
    const lead = db.data!.leads.find(l => l.audit_id === audit.id);
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
  consent: boolean;
}): Promise<Lead> {
  await db.read();
  
  // Check if lead already exists
  const existing = db.data!.leads.find(l => l.audit_id === data.audit_id);
  if (existing) {
    // Update existing lead
    existing.name = data.name || existing.name;
    existing.email = data.email || existing.email;
    existing.consent = data.consent;
    existing.updated_at = new Date().toISOString();
    await db.write();
    return existing;
  }
  
  const lead: Lead = {
    id: uuidv4(),
    audit_id: data.audit_id,
    name: data.name,
    email: data.email,
    consent: data.consent,
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.data!.leads.push(lead);
  await db.write();
  
  return lead;
}

export async function updateLeadStatus(auditId: string, status: LeadStatus): Promise<Lead | null> {
  await db.read();
  
  const lead = db.data!.leads.find(l => l.audit_id === auditId);
  if (!lead) return null;
  
  lead.status = status;
  lead.updated_at = new Date().toISOString();
  await db.write();
  
  return lead;
}

export async function addNote(auditId: string, content: string): Promise<AdminNote> {
  await db.read();
  
  const note: AdminNote = {
    id: uuidv4(),
    audit_id: auditId,
    content,
    created_at: new Date().toISOString()
  };
  
  db.data!.notes.push(note);
  await db.write();
  
  return note;
}

export async function getAuditStats() {
  await db.read();
  
  const today = new Date().toISOString().split('T')[0];
  const auditsToday = db.data!.audits.filter(a => a.created_at.startsWith(today));
  const leadsWithEmail = db.data!.leads.filter(l => l.email);
  const avgScore = db.data!.audits.length > 0
    ? Math.round(db.data!.audits.reduce((sum, a) => sum + a.score_total, 0) / db.data!.audits.length)
    : 0;
  
  return {
    total: db.data!.audits.length,
    leads: leadsWithEmail.length,
    avgScore,
    today: auditsToday.length
  };
}

export async function getNotesForAudit(auditId: string) {
  await db.read();
  return db.data!.notes.filter(n => n.audit_id === auditId).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export default db;
