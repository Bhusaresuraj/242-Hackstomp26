'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Droplets,
  LayoutDashboard,
  MapPinned,
  Recycle,
  ShieldAlert,
} from 'lucide-react';
import RoleDashboardLayout from '@/Components/RoleDashboardLayout';
import { supabase } from '@/lib/supabase';

const navItems = [
  { href: '#overview', label: 'Overview', icon: LayoutDashboard },
  { href: '#dashboard', label: 'Dashboard', icon: Recycle },
  { href: '#campaigns', label: 'Issues', icon: AlertTriangle },
];

const wasteStats = [
  { label: 'Active Cleanup Zones', value: '14' },
  { label: 'Critical Reports', value: '5' },
  { label: 'Collection Partners', value: '18' },
];

const issues = [
  {
    id: 'overflow-drain',
    title: 'Overflowing Drain Near School',
    area: 'Malegaon Hamlet',
    summary: 'Drain blockage causing stagnant water and mosquito breeding near student access route.',
    severity: 'Critical',
    nextStep: 'Escalate to local sanitation crew',
  },
  {
    id: 'waste-dumping',
    title: 'Unauthorized Waste Dumping',
    area: 'Khedgaon East',
    summary: 'Repeated mixed-waste disposal near handpump area creating health contamination risk.',
    severity: 'High',
    nextStep: 'Coordinate awareness visit and bin placement',
  },
  {
    id: 'plastic-burn',
    title: 'Open Plastic Burning',
    area: 'Rahuri Cluster',
    summary: 'Evening plastic burning reported next to residential lane impacting air quality.',
    severity: 'Moderate',
    nextStep: 'Field check and awareness notice',
  },
];

function IssueCard({ issue }) {
  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
            {issue.severity}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950">{issue.title}</h3>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <ShieldAlert className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">{issue.summary}</p>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
          <MapPinned className="h-4 w-4 text-teal-700" />
          {issue.area}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-slate-700">
          <Droplets className="h-4 w-4 text-teal-700" />
          {issue.nextStep}
        </div>
      </div>
    </article>
  );
}

export default function WasteManagementPage() {
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
        name: data.user.user_metadata?.full_name || 'Waste Supervisor',
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
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/WasteManagement')}`;

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

  const filteredIssues = issues.filter((issue) => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [issue.title, issue.area, issue.summary, issue.severity].some((value) =>
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
      panelTitle="Waste Management"
      navItems={navItems}
      tipTitle="Waste Tip"
      tipText="Prioritize water contamination, school-zone hazards, and repeat dumping sites when triaging incoming reports."
      searchPlaceholder="Search issue areas, severity, or response notes"
    >
      <section
        id="overview"
        className="rounded-3xl border border-teal-100 bg-white px-6 py-7 shadow-xl sm:px-8"
      >
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
              Waste Operations
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-teal-950 sm:text-5xl">
              Monitor sanitation issues, field escalations, and village waste risks from one dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Use a structured waste management dashboard to triage health-related environmental issues and coordinate cleanup actions faster.
            </p>
          </div>

          <div className="grid gap-4">
            {wasteStats.map((stat) => (
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
          Waste Dashboard
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Resolved This Week
            </p>
            <p className="mt-4 text-4xl font-extrabold text-teal-950">17</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Hazard Audits
            </p>
            <p className="mt-4 text-4xl font-extrabold text-teal-950">29</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Compliance Rate
            </p>
            <p className="mt-4 text-4xl font-extrabold text-teal-950">91%</p>
          </div>
        </div>
      </section>

      <section id="campaigns" className="mt-8">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
            Issue Queue
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
            Open sanitation and environmental health issues
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            {filteredIssues.length} issue{filteredIssues.length === 1 ? '' : 's'} match your search.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </RoleDashboardLayout>
  );
}
