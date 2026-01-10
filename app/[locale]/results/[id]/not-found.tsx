import Link from 'next/link';
import { AlertCircle, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Analyse nicht gefunden
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Diese Analyse existiert nicht mehr oder der Link ist ungültig. 
          Starten Sie eine neue Analyse für Ihre Website.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/de/funnel"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-xl transition-colors"
          >
            <Search className="w-5 h-5" />
            Neue Analyse starten
          </Link>
          
          <Link
            href="/de"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zur Startseite
          </Link>
        </div>

        {/* Logo */}
        <div className="mt-12 flex items-center justify-center gap-2 text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-xs font-bold text-black">W3</span>
          </div>
          <span className="font-medium">WebCheck360</span>
        </div>
      </div>
    </div>
  );
}
