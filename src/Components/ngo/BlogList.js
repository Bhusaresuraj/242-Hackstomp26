'use client';

import { CalendarRange, Pencil, Trash2 } from 'lucide-react';

export default function BlogList({ blogs, onEdit, onDelete }) {
  if (!blogs.length) {
    return (
      <div className="rounded-3xl border border-dashed border-teal-200 bg-white p-6 text-sm text-slate-600 shadow-xl">
        No blog posts published yet.
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {blogs.map((blog) => (
        <article
          key={blog.id}
          className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl"
        >
          {blog.cover_image ? (
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="h-44 w-full object-cover"
            />
          ) : null}

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                  NGO Blog
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-teal-950">{blog.title}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(blog)}
                  className="rounded-xl border border-teal-200 bg-white p-2 text-teal-700 transition hover:bg-teal-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(blog.id)}
                  className="rounded-xl border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <CalendarRange className="h-4 w-4 text-teal-700" />
              {blog.created_at || 'No publish date'}
            </div>

            <p className="mt-4 line-clamp-5 text-sm leading-7 text-slate-600">
              {blog.content}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
