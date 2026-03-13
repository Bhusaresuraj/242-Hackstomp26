'use client';

import { useState } from 'react';

const defaultValues = {
  title: '',
  content: '',
  cover_image: '',
};

export default function BlogEditor({
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
          content: initialValues.content || '',
          cover_image: initialValues.cover_image || '',
        }
      : defaultValues
  );
  const [coverFile, setCoverFile] = useState(null);

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
      coverFile,
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
            Blog Editor
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
            {initialValues ? 'Edit NGO Blog' : 'Write New NGO Blog'}
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

      <div className="mt-6 grid gap-4">
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
          <span className="text-sm font-semibold text-teal-900">Content</span>
          <textarea
            value={formValues.content}
            onChange={(event) => handleChange('content', event.target.value)}
            rows={8}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Cover Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
          {formValues.cover_image && !coverFile && (
            <p className="text-xs text-slate-500">Current cover image is already saved.</p>
          )}
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
          ? 'Update Blog'
          : 'Publish Blog'}
      </button>
    </form>
  );
}
