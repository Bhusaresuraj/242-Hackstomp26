'use client';

import Link from 'next/link';
import {
  Bell,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  RefreshCcw,
  Search,
  X,
} from 'lucide-react';

const navigationItems = [
  { href: '#overview', label: 'Overview', icon: LayoutDashboard },
  { href: '#dashboard', label: 'Dashboard', icon: HeartHandshake },
  { href: '#campaigns', label: 'Campaigns', icon: Layers3 },
];

function SidebarProfile({ donor }) {
  return (
    <div className="rounded-2xl border border-teal-800/50 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        {donor?.avatar ? (
          <img
            src={donor.avatar}
            alt={donor.name}
            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-300/30"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white ring-2 ring-teal-300/20">
            {donor?.name?.charAt(0) || 'D'}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {donor?.name || 'Guest Donor'}
          </p>
          <p className="truncate text-xs text-teal-100/80">
            {donor?.email || 'Sign in to personalize'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  donor,
  mobileOpen,
  onClose,
  onLogout,
  onSwitchAccount,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform overflow-y-auto border-r border-teal-800/60 bg-gradient-to-b from-teal-950 via-teal-900 to-emerald-900 px-5 py-6 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between lg:hidden">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white transition hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 lg:mt-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-lg">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200">
              Seva Swasthya
            </p>
            <h1 className="text-xl font-bold text-white">Donor Platform</h1>
          </div>
        </div>

        <div className="mt-8">
          <SidebarProfile donor={donor} />
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-teal-50 transition hover:bg-white/10"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}

          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-teal-50 transition hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </nav>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={onSwitchAccount}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-teal-800 shadow-lg transition hover:bg-teal-50"
          >
            <RefreshCcw className="h-4 w-4" />
            {donor ? 'Switch Google Account' : 'Sign in with Google'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
            Donor Tip
          </p>
          <p className="mt-2 text-sm leading-6 text-teal-50/90">
            Review campaign progress before donating and use the search bar to find NGOs quickly.
          </p>
        </div>
      </aside>
    </>
  );
}

function Navbar({
  donor,
  searchValue,
  onSearchChange,
  onMenuToggle,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-teal-100 bg-white/90 backdrop-blur lg:left-64">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Seva Swasthya
            </p>
            <h2 className="text-base font-bold text-slate-950">
              Donor Dashboard
            </h2>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-4 md:flex">
          <label className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search NGOs, locations, or campaigns"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:bg-slate-50"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-500" />
          </button>
          {donor?.avatar ? (
            <img
              src={donor.avatar}
              alt={donor.name}
              className="h-10 w-10 rounded-2xl object-cover ring-2 ring-teal-100"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-sm font-bold text-white">
              {donor?.name?.charAt(0) || 'D'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function DonorDashboardLayout({
  donor,
  mobileOpen,
  onMobileOpen,
  onMobileClose,
  onLogout,
  onSwitchAccount,
  searchValue,
  onSearchChange,
  children,
}) {
  return (
    <div className="h-screen overflow-hidden bg-teal-50">
      <Sidebar
        donor={donor}
        mobileOpen={mobileOpen}
        onClose={onMobileClose}
        onLogout={onLogout}
        onSwitchAccount={onSwitchAccount}
      />

      <Navbar
        donor={donor}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onMenuToggle={onMobileOpen}
      />

      <main className="h-screen overflow-y-auto pt-16 lg:ml-64">
        <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
