const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://awsldhpoagtdbznyqcjn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3c2xkaHBvYWd0ZGJ6bnlxY2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODcxMTcsImV4cCI6MjA4MzY2MzExN30.rmbnE7cLZPmI9E13Zt5Mo8Xby8iAnWhB_1B6PeL1JRM'
);

async function check() {
  const { data: audits, error: auditsErr } = await supabase.from('audits').select('id, url, created_at');
  const { data: leads, error: leadsErr } = await supabase.from('leads').select('id, audit_id, email');
  
  console.log('=== AUDITS ===');
  console.log('Count:', audits?.length || 0);
  console.log('Error:', auditsErr?.message || 'none');
  if (audits) {
    console.log('Recent audits:');
    audits.slice(0,10).forEach(a => console.log(' -', a.url, a.created_at));
  }
  
  console.log('\n=== LEADS ===');
  console.log('Count:', leads?.length || 0);
  console.log('Error:', leadsErr?.message || 'none');
  if (leads) {
    leads.slice(0,5).forEach(l => console.log(' -', l.email));
  }

  // Check today's audits
  const today = new Date().toISOString().split('T')[0];
  const todayAudits = audits?.filter(a => a.created_at?.startsWith(today)) || [];
  console.log('\n=== TODAY ===');
  console.log('Today:', today);
  console.log('Audits today:', todayAudits.length);
}

check().catch(console.error);
