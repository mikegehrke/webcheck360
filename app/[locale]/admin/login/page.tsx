'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(`/${params.locale}/admin`);
      } else {
        setError('Falsches Passwort');
      }
    } catch {
      setError('Fehler beim Login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${params.locale}`} className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-lg font-bold text-black">W3</span>
            </div>
            <span className="font-bold text-2xl text-white">WebCheck360</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Admin-Bereich</h1>
          <p className="text-gray-400">Zugang nur für Administratoren</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin-Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Prüfe...' : 'Einloggen'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link href={`/${params.locale}`} className="hover:text-primary-400 transition-colors">
            ← Zurück zur Startseite
          </Link>
        </p>
      </div>
    </div>
  );
}
