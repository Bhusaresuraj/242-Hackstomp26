'use client';

import { HeartHandshake, Stethoscope, Users } from 'lucide-react';

export default function NGODashboard({
  doctors,
  donors,
  drives,
  blogs,
  activeNgo,
}) {
  return (
    <section
      id="dashboard"
      className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-7"
    >
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
        NGO Dashboard
      </p>
      <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
        {activeNgo?.name || 'NGO Management Hub'}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Connected Doctors
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{doctors.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Connected Donors
          </p>
          <div className="mt-4 flex items-center gap-3">
            <HeartHandshake className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{donors.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Drives Managed
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{drives.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Blogs Published
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{blogs.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Connected Doctors
          </p>
          <div className="mt-4 space-y-3">
            {doctors.length ? (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="rounded-xl bg-white px-4 py-3 text-sm text-slate-700"
                >
                  Doctor ID: {doctor.doctor_id}
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600">
                No connected doctors yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Connected Donors
          </p>
          <div className="mt-4 space-y-3">
            {donors.length ? (
              donors.map((donor) => (
                <div
                  key={donor.id}
                  className="rounded-xl bg-white px-4 py-3 text-sm text-slate-700"
                >
                  Donor ID: {donor.donor_id}
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600">
                No connected donors yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
