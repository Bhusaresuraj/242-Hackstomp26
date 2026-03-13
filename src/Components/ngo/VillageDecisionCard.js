'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BrainCircuit, MapPinned } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const priorityStyles = {
  CRITICAL: 'border-red-200 bg-red-50 text-red-700',
  HIGH: 'border-orange-200 bg-orange-50 text-orange-700',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-700',
  LOW: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

function parseRecommendedActions(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
}

function deriveVillageName(village) {
  return (
    village.village_name ||
    village.name ||
    village.village ||
    village.villageLabel ||
    village.area_name ||
    village.locality_name ||
    'Unnamed village'
  );
}

function DecisionReportCard({ village }) {
  const priorityLevel = (village.priority_level || 'LOW').toUpperCase();
  const badgeClassName =
    priorityStyles[priorityLevel] || 'border-slate-200 bg-slate-50 text-slate-700';
  const actions = parseRecommendedActions(village.recommended_actions);

  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            Village Decision Report
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
            {deriveVillageName(village)}
          </h3>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <MapPinned className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Priority Score
          </p>
          <p className="mt-2 text-3xl font-extrabold text-teal-950">
            {typeof village.priority_score === 'number'
              ? village.priority_score.toFixed(2)
              : village.priority_score || 'N/A'}
          </p>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Priority Level
          </p>
          <span
            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badgeClassName}`}
          >
            {priorityLevel}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-teal-700" />
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-900">
            Recommended Actions
          </p>
        </div>

        {actions.length ? (
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {actions.map((action) => (
              <li key={action} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No recommended actions were returned by the model.
          </p>
        )}
      </div>
    </article>
  );
}

export default function VillageDecisionCard({ villageId = null, className = '' }) {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadVillages = async () => {
      setLoading(true);
      setErrorMessage('');

      let query = supabase
        .from('villages')
        .select('*')
        .order('priority_score', { ascending: false });

      if (villageId) {
        query = query.eq('id', villageId);
      }

      const { data, error } = await query;

      if (!isMounted) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        setVillages([]);
        setLoading(false);
        return;
      }

      setVillages(data || []);
      setLoading(false);
    };

    loadVillages();

    return () => {
      isMounted = false;
    };
  }, [villageId]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-semibold text-slate-600">
            Loading village decision reports...
          </p>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-xl">
          <div className="flex items-start gap-3 text-red-700">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em]">
                Unable to load village decisions
              </p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!villages.length) {
      return (
        <div className="rounded-3xl border border-dashed border-teal-200 bg-teal-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            No village decision reports are available yet.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Add rows to the `villages` table to display model predictions here.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 xl:grid-cols-2">
        {villages.map((village) => (
          <DecisionReportCard key={village.id} village={village} />
        ))}
      </div>
    );
  }, [errorMessage, loading, villages]);

  return <div className={className}>{content}</div>;
}
