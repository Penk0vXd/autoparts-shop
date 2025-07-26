// TODO: DELETE THIS FILE AFTER LIVE VERIFICATION
// Quick test page to verify production integration with one click

'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';

// Security gate - page is invisible unless explicitly enabled
if (process.env.NEXT_PUBLIC_ENABLE_QUICK_TEST !== 'true') {
  notFound();
}

export default function QuickTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/quick-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.ok) {
        setMessage({
          type: 'success',
          text: 'Успешно – провери Discord!'
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Възникна грешка при теста'
        });
      }
    } catch (error) {
      console.error('Test error:', error);
      setMessage({
        type: 'error',
        text: 'Мрежова грешка при теста'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full border border-slate-200">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            🧪 Бърз тест
          </h1>
          <p className="text-slate-600 text-sm">
            Тества запис в requests + Discord webhook
          </p>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTest}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            isLoading
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Изпращане...
            </span>
          ) : (
            '🚀 Изпрати реален тест'
          )}
        </button>

        {/* Toast Messages */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              {message.type === 'success' ? '✅' : '❌'}
              {message.text}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <p className="mb-1">Този тест ще:</p>
          <p>• Запише dummy запис в requests таблицата</p>
          <p>• Изпрати известие в Discord канала</p>
        </div>
      </div>
    </div>
  );
}

// Purpose: Single-click test to verify production requests table + Discord integration
// Security: Hidden unless NEXT_PUBLIC_ENABLE_QUICK_TEST=true in environment
// Cleanup: Delete this file after live verification is complete 