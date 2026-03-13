'use client';

import { useEffect, useState } from 'react';
import {
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  TimerReset,
  Users,
} from 'lucide-react';
import RoleDashboardLayout from '@/Components/RoleDashboardLayout';
import { supabase } from '@/lib/supabase';

const navItems = [
  { href: '#overview', label: 'Overview', icon: LayoutDashboard },
  { href: '#dashboard', label: 'Dashboard', icon: Users },
  { href: '#campaigns', label: 'Assignments', icon: ClipboardList },
];

const workerStats = [
  { label: 'Assigned Villages', value: '11' },
  { label: 'Open Field Reports', value: '7' },
  { label: 'Average Response Time', value: '2h' },
];

const assignments = [
  {
    id: 'anganwadi-check',
    title: 'Anganwadi Safety Check',
    village: 'Pimpalgaon',
    summary: 'Inspect medicine storage, infant records, and sanitation around the center.',
    urgency: 'High',
    due: 'Today, 5:00 PM',
  },
  {
    id: 'village-camp-support',
    title: 'Medical Camp Support',
    village: 'Sinnar Block',
    summary: 'Coordinate patient queueing, verify registrations, and track basic vitals.',
    urgency: 'Medium',
    due: 'Tomorrow, 11:30 AM',
  },
  {
    id: 'nutrition-followup',
    title: 'Nutrition Follow-up Visit',
    village: 'Kheda Cluster',
    summary: 'Revisit flagged households and capture updated beneficiary progress notes.',
    urgency: 'Open',
    due: 'Apr 19, 3:00 PM',
  },
];

function AssignmentCard({ assignment }) {
  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
            {assignment.urgency}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">{assignment.title}</h3>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <ClipboardList className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">{assignment.summary}</p>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
          <MapPinned className="h-4 w-4 text-teal-700" />
          {assignment.village}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
          <TimerReset className="h-4 w-4 text-teal-700" />
          Due: {assignment.due}
        </div>
      </div>
    </article>
  );
}

export default function WorkersPage() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted || error || !data?.user) {
        if (isMounted) {
          setUser(null);
        }
        return;
      }

      setUser({
        name: data.user.user_metadata?.full_name || 'Worker',
        email: data.user.email || 'No email available',
        avatar: data.user.user_metadata?.avatar_url || '',
      });
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileOpen(false);
    window.location.href = '/login';
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/Workers')}`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [assignment.title, assignment.village, assignment.summary, assignment.urgency].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  return (
    <RoleDashboardLayout
      user={user}
      mobileOpen={mobileOpen}
      onMobileOpen={() => setMobileOpen(true)}
      onMobileClose={() => setMobileOpen(false)}
      onLogout={handleLogout}
      onSwitchAccount={handleGoogleLogin}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      platformName="Seva Swasthya"
      panelTitle="Worker Dashboard"
      navItems={navItems}
      tipTitle="Field Tip"
      tipText="Keep assignment notes short and factual so NGO coordinators can act on them without extra follow-up."
      searchPlaceholder="Search villages, tasks, or urgency"
    >
      <section
        id="overview"
        className="rounded-3xl border border-teal-100 bg-white px-6 py-7 shadow-xl sm:px-8"
      >
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
              Field Operations
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-teal-950 sm:text-5xl">
              Track village assignments, report issues, and support healthcare outreach on the ground
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Use the worker dashboard to manage daily field responsibilities, coordinate with NGOs, and maintain clean reporting across every village visit.
            </p>
          </div>

          <div className="grid gap-4">
            {workerStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-teal-100 bg-teal-50 p-5 shadow-md"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-extrabold text-teal-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="dashboard"
        className="mt-8 rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-7"
      >
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
          Worker Dashboard
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Households Visited
            </p>
            <p className="mt-4 text-4xl font-extrabold text-teal-950">128</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Verified Reports
            </p>
            <p className="mt-4 text-4xl font-extrabold text-teal-950">22</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Compliance Score
            </p>
            <p className="mt-4 text-4xl font-extrabold text-teal-950">94%</p>
          </div>
        </div>
      </section>

      <section id="campaigns" className="mt-8">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
            Assignments
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
            Current field tasks across your assigned villages
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            {filteredAssignments.length} assignment{filteredAssignments.length === 1 ? '' : 's'} match your search.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </section>
    </RoleDashboardLayout>
  );
}
