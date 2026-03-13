'use client';

import { useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';

export default function ImageUploader({
  onUpload,
  uploading,
  images,
  disabled = false,
  errorMessage = '',
}) {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    await onUpload({ file, caption });
    setCaption('');
    setFile(null);
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
              Media Upload
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
              Upload NGO Images
            </h3>
          </div>
          <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
            <ImagePlus className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {errorMessage ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Media is unavailable right now: {errorMessage}
            </div>
          ) : null}

          <label className="space-y-2">
            <span className="text-sm font-semibold text-teal-900">Select Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-teal-900">Caption</span>
            <input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Short caption for this image"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading || !file || disabled || Boolean(errorMessage)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Upload className="h-4 w-4" />
          {disabled
            ? 'NGO setup required'
            : errorMessage
            ? 'Media setup required'
            : uploading
            ? 'Uploading...'
            : 'Upload Image'}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image) => (
          <article
            key={image.id}
            className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl"
          >
            <img
              src={image.image_url}
              alt={image.caption || 'NGO upload'}
              className="h-44 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-semibold text-teal-950">
                {image.caption || 'No caption'}
              </p>
              <p className="mt-2 text-xs text-slate-500">{image.created_at || 'No date'}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
