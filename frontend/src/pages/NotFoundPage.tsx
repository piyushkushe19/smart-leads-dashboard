import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
    <div className="p-3 bg-brand-600/20 rounded-2xl mb-6">
      <Zap className="w-8 h-8 text-brand-400" />
    </div>
    <h1 className="text-8xl font-bold text-slate-800 dark:text-slate-700 mb-4 font-mono">
      404
    </h1>
    <h2 className="text-xl font-semibold text-slate-300 mb-2">Page not found</h2>
    <p className="text-slate-500 text-sm mb-8 max-w-xs">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <Link
      to="/dashboard"
      className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
