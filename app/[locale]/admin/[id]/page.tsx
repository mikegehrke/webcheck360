'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  ExternalLink,
  Mail,
  User,
  Calendar,
  FileText,
  Send,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreCircle } from '@/components/ui/score-circle';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatDate, generateFollowUpText } from '@/lib/utils';
import { LeadStatus } from '@/lib/types';

interface AuditDetail {
  id: string;
  url: string;
  domain: string;
  score_total: number;
  scores: Record<string, number>;
  issues: Array<{ id: string; title: string; category: string; severity: string }>;
  screenshots: { desktop: string | null; mobile: string | null };
  industry?: string;
  goal?: string;
  created_at: string;
  lead?: {
    id: string;
    name?: string;
    email?: string;
    status: LeadStatus;
  };
}

interface Note {
  id: string;
  content: string;
  created_at: string;
}

export default function AdminDetailPage({ 
  params: { locale, id } 
}: { 
  params: { locale: string; id: string } 
}) {
  const t = useTranslations('admin');
  
  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [followUpText, setFollowUpText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, [id]);

  const loadAudit = async () => {
    try {
      const res = await fetch(`/api/admin/audits/${id}`);
      const data = await res.json();
      setAudit(data.audit);
      setNotes(data.notes || []);
      
      if (data.audit) {
        const text = generateFollowUpText(
          data.audit.domain,
          data.audit.score_total,
          data.audit.issues,
          locale as 'de' | 'en'
        );
        setFollowUpText(text);
      }
    } catch (error) {
      console.error('Failed to load audit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: LeadStatus) => {
    try {
      await fetch(`/api/admin/audits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadAudit();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await fetch(`/api/admin/audits/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      });
      setNewNote('');
      loadAudit();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const copyFollowUp = () => {
    navigator.clipboard.writeText(followUpText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <p>Audit nicht gefunden</p>
      </div>
    );
  }

  const statuses: LeadStatus[] = ['new', 'contacted', 'meeting', 'proposal', 'closed'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href={`/${locale}/admin`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                Zurück
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <h1 className="font-semibold">{audit.domain}</h1>
            </div>
            <a 
              href={audit.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              Website öffnen
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Score & Screenshots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-8">
                  <ScoreCircle score={audit.score_total} size="default" />
                  <div className="flex-1 grid grid-cols-5 gap-4">
                    {Object.entries(audit.scores).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{key}</p>
                        <p className="font-bold">{value}</p>
                        <ProgressBar value={value} size="sm" color="dynamic" className="mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screenshots */}
            <div className="grid md:grid-cols-2 gap-6">
              {audit.screenshots.desktop && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Desktop</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800">
                      <Image
                        src={audit.screenshots.desktop}
                        alt="Desktop"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              {audit.screenshots.mobile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mobile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[9/16] max-w-[150px] mx-auto relative rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800">
                      <Image
                        src={audit.screenshots.mobile}
                        alt="Mobile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Follow-up Text */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('detail.followUp')}</CardTitle>
                <Button variant="outline" size="sm" onClick={copyFollowUp}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Kopiert!' : 'Kopieren'}
                </Button>
              </CardHeader>
              <CardContent>
                <textarea
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  className="w-full h-64 p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Lead Info & Notes */}
          <div className="space-y-6">
            {/* Lead Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('detail.leadInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audit.lead ? (
                  <>
                    {audit.lead.name && (
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{audit.lead.name}</span>
                      </div>
                    )}
                    {audit.lead.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${audit.lead.email}`} className="text-primary-600 hover:underline">
                          {audit.lead.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(audit.created_at, locale as 'de' | 'en')}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                      <p className="text-sm font-medium mb-2">Status ändern:</p>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(status)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              audit.lead?.status === status
                                ? 'bg-primary-500 text-black'
                                : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
                            }`}
                          >
                            {t(`audits.status.${status}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">{t('detail.noLead')}</p>
                )}

                {audit.industry && (
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Branche</p>
                    <p className="font-medium">{audit.industry}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>{t('detail.notes')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Notiz hinzufügen..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                  />
                  <Button size="sm" onClick={addNote}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notes.map((note) => (
                    <div 
                      key={note.id} 
                      className="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg"
                    >
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(note.created_at, locale as 'de' | 'en')}
                      </p>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Noch keine Notizen
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
