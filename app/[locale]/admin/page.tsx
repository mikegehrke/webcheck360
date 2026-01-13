'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Target, 
  Calendar,
  ExternalLink,
  Mail,
  MailX,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { formatDate, getScoreColor } from '@/lib/utils';

interface AuditListItem {
  id: string;
  url: string;
  domain: string;
  score_total: number;
  industry?: string;
  created_at: string;
  hasEmail: boolean;
  status: string;
}

interface Stats {
  total: number;
  leads: number;
  avgScore: number;
  today: number;
}

export default function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  
  const [audits, setAudits] = useState<AuditListItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, leads: 0, avgScore: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'withEmail' | 'withoutEmail' | 'lowScore'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [auditsRes, statsRes] = await Promise.all([
        fetch('/api/admin/audits'),
        fetch('/api/admin/audits?type=stats')
      ]);
      
      const auditsData = await auditsRes.json();
      const statsData = await statsRes.json();
      
      // Transform audits to include hasEmail from lead data
      const transformedAudits = (auditsData.audits || []).map((audit: any) => ({
        ...audit,
        hasEmail: !!audit.lead?.email,
        status: audit.status || 'new'
      }));
      
      setAudits(transformedAudits);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAudits = audits.filter(audit => {
    switch (filter) {
      case 'withEmail':
        return audit.hasEmail;
      case 'withoutEmail':
        return !audit.hasEmail;
      case 'lowScore':
        return audit.score_total < 50;
      default:
        return true;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'error' | 'info'; label: string }> = {
      new: { variant: 'info', label: t('audits.status.new') },
      contacted: { variant: 'warning', label: t('audits.status.contacted') },
      meeting: { variant: 'success', label: t('audits.status.meeting') },
      proposal: { variant: 'default', label: t('audits.status.proposal') },
      closed: { variant: 'success', label: t('audits.status.closed') },
    };
    const config = statusConfig[status] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportCSV = () => {
    const headers = ['Datum', 'Website', 'Score', 'Branche', 'E-Mail', 'Status'];
    const rows = filteredAudits.map(a => [
      a.created_at,
      a.domain,
      a.score_total.toString(),
      a.industry || '-',
      a.hasEmail ? 'Ja' : 'Nein',
      a.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webcheck360-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-sm font-bold text-black">W3</span>
              </div>
              <span className="font-bold text-xl">WebCheck360</span>
              <Badge variant="default">Admin</Badge>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.stats.total')}</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.stats.leads')}</p>
                  <p className="text-2xl font-bold">{stats.leads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.stats.avgScore')}</p>
                  <p className="text-2xl font-bold">{stats.avgScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.stats.today')}</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              {(['all', 'withEmail', 'withoutEmail', 'lowScore'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-500 text-black'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {t(`audits.filters.${f}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Audits Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('audits.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : filteredAudits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Keine Analysen gefunden</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">{t('audits.columns.date')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">{t('audits.columns.website')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">{t('audits.columns.score')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">{t('audits.columns.industry')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">{t('audits.columns.email')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">{t('audits.columns.status')}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudits.map((audit) => (
                      <tr 
                        key={audit.id} 
                        className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">
                          {formatDate(audit.created_at, locale as 'de' | 'en')}
                        </td>
                        <td className="py-3 px-4">
                          <a 
                            href={audit.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                          >
                            {audit.domain}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${getScoreColor(audit.score_total)}`}>
                            {audit.score_total}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {audit.industry || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {audit.hasEmail ? (
                            <Mail className="w-5 h-5 text-green-500" />
                          ) : (
                            <MailX className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(audit.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Link 
                            href={`/${locale}/admin/${audit.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
