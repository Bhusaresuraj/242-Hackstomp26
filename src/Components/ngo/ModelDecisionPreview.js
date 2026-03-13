'use client';

import { useEffect, useState } from 'react';
import { Bot, Sparkles, TriangleAlert } from 'lucide-react';

const priorityStyles = {
  CRITICAL: 'border-red-200 bg-red-50 text-red-700',
  HIGH: 'border-orange-200 bg-orange-50 text-orange-700',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-700',
  LOW: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function ModelDecisionPreview() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPrediction = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch('/api/ngos/recommend-intervention', {
          method: 'GET',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to run village intervention model.');
        }

        if (!isMounted) {
          return;
        }

        setReport(data.report || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPrediction();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            Local ML Model
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
            Live village intervention inference
          </h3>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <Bot className="h-5 w-5" />
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-sm font-semibold text-slate-600">
          Running `recommendintervention.py`...
        </p>
      ) : errorMessage ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em]">
                Model runtime unavailable
              </p>
              <p className="mt-2 text-sm">{errorMessage}</p>
              <p className="mt-2 text-sm">
                Install Python dependencies with `pip3 install joblib numpy`.
              </p>
            </div>
          </div>
        </div>
      ) : report ? (
        <div className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Priority Score
              </p>
              <p className="mt-2 text-3xl font-extrabold text-teal-950">
                {typeof report.priority_score === 'number'
                  ? report.priority_score.toFixed(2)
                  : report.priority_score || 'N/A'}
              </p>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Priority Level
              </p>
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                  priorityStyles[report.priority_level] ||
                  'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {report.priority_level || 'UNKNOWN'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-700" />
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-900">
                Recommended Actions
              </p>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {(report.recommended_actions || []).map((action) => (
                <li key={action} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
