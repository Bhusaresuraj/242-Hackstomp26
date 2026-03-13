'use client';

import { useState } from 'react';

const defaultValues = {
  title: '',
  description: '',
  location: '',
  drive_date: '',
  waste_collected: '',
  volunteers_count: '',
  success: false,
};

export default function DriveForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting,
  disabled = false,
}) {
  const [formValues, setFormValues] = useState(() =>
    initialValues
      ? {
          title: initialValues.title || '',
          description: initialValues.description || '',
          location: initialValues.location || '',
          drive_date: initialValues.drive_date || '',
          waste_collected: initialValues.waste_collected ?? '',
          volunteers_count: initialValues.volunteers_count ?? '',
          success: Boolean(initialValues.success),
        }
      : defaultValues
  );

  const handleChange = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...formValues,
      waste_collected: Number(formValues.waste_collected || 0),
      volunteers_count: Number(formValues.volunteers_count || 0),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            Drive Form
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
            {initialValues ? 'Edit NGO Drive' : 'Create NGO Drive'}
          </h3>
        </div>
        {initialValues && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Title</span>
          <input
            value={formValues.title}
            onChange={(event) => handleChange('title', event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Location</span>
          <input
            value={formValues.location}
            onChange={(event) => handleChange('location', event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-teal-900">Description</span>
          <textarea
            value={formValues.description}
            onChange={(event) => handleChange('description', event.target.value)}
            rows={4}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Drive Date</span>
          <input
            type="date"
            value={formValues.drive_date}
            onChange={(event) => handleChange('drive_date', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Waste Collected</span>
          <input
            type="number"
            min="0"
            value={formValues.waste_collected}
            onChange={(event) => handleChange('waste_collected', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Volunteers Count</span>
          <input
            type="number"
            min="0"
            value={formValues.volunteers_count}
            onChange={(event) => handleChange('volunteers_count', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
          <input
            type="checkbox"
            checked={formValues.success}
            onChange={(event) => handleChange('success', event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm font-semibold text-teal-900">Mark as successful</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting || disabled}
        className="mt-6 rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {disabled
          ? 'NGO setup required'
          : submitting
          ? 'Saving...'
          : initialValues
          ? 'Update Drive'
          : 'Create Drive'}
      </button>
    </form>
  );
}
