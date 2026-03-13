'use client';

import { CalendarRange, MapPin, Pencil, Trash2, Users } from 'lucide-react';

export default function DriveList({ drives, onEdit, onDelete }) {
  if (!drives.length) {
    return (
      <div className="rounded-3xl border border-dashed border-teal-200 bg-white p-6 text-sm text-slate-600 shadow-xl">
        No drives created yet.
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {drives.map((drive) => (
        <article
          key={drive.id}
          className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                {drive.success ? 'Successful' : 'Open'}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-teal-950">{drive.title}</h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(drive)}
                className="rounded-xl border border-teal-200 bg-white p-2 text-teal-700 transition hover:bg-teal-50"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(drive.id)}
                className="rounded-xl border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">{drive.description}</p>

          <div className="mt-5 grid gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-teal-700" />
              {drive.location}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
              <CalendarRange className="h-4 w-4 text-teal-700" />
              {drive.drive_date || 'No date'}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
              <Users className="h-4 w-4 text-teal-700" />
              {drive.volunteers_count || 0} volunteers | Waste: {drive.waste_collected || 0}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
