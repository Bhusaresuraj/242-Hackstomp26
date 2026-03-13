# Sevaswathya Codebase Index

## Overview
- Framework: Next.js 16 App Router
- UI: React 19, Tailwind CSS 4, `lucide-react`
- Auth/data client: Supabase via `@supabase/supabase-js`
- Entry point: `src/app`

## Top-Level Files
- `package.json`: app scripts and dependencies
- `next.config.mjs`: Next.js config
- `jsconfig.json`: path alias support
- `eslint.config.mjs`: linting config
- `postcss.config.mjs`: PostCSS setup
- `README.md`: default Create Next App README, not project-specific

## Scripts
- `npm run dev`: start local dev server
- `npm run build`: production build
- `npm run start`: run built app
- `npm run lint`: run ESLint

## App Router Structure

### Shared App Shell
- `src/app/layout.js`
  - Loads Geist fonts
  - Imports global styles from `src/app/globals.css`
  - Defines root metadata

- `src/app/globals.css`
  - Imports Tailwind CSS

### Routes
- `src/app/page.js`
  - Root `/`
  - Currently renders an empty `<div>`

- `src/app/login/page.js`
  - Route `/login`
  - Client component
  - Handles login/signup UI
  - Supports role selection:
    - doctor
    - ngo
    - donor
    - waste_worker
    - worker
  - Uses local Supabase client from `src/app/login/supabase.js`
  - Contains redirect logic by role after auth

- `src/app/Doctors/page.js`
  - Route `/Doctors`
  - Doctor dashboard layout
  - Uses shared components for sidebar, profile, NGO cards, and blog cards
  - Shows summary cards and placeholder content

- `src/app/Donate/page.js`
  - Route `/Donate`
  - Placeholder page: "Please donate"

- `src/app/Workers/page.js`
  - Route `/Workers`
  - Placeholder page: "for the workers"

- `src/app/Ngos/page.js`
  - Route `/Ngos`
  - Placeholder page: "For the Ngos"

- `src/app/Blogs/page.js`
  - Route `/Blogs`
  - Placeholder page: "Blogs!!!"

- `src/app/WasteManagement/page.js`
  - Route `/WasteManagement`
  - File exists but is currently empty

## Shared Components
- `src/Components/DoctorSidebar.js`
  - Static doctor sidebar UI
  - Menu labels: Dashboard, NGOs, Blogs, Logout

- `src/Components/DoctorProfileCard.js`
  - Doctor profile header card
  - Hardcoded doctor data and image path `/doctor.jpg`

- `src/Components/StatCard.js`
  - Reusable stat summary card
  - Props: `title`, `value`

- `src/Components/NgoCard.js`
  - NGO summary card
  - Currently hardcoded sample content

- `src/Components/BlogCard.js`
  - Blog summary card
  - Currently hardcoded sample content

## Auth and Data Layer
- `src/app/login/supabase.js`
  - Creates and exports a Supabase client
  - Uses a hardcoded project URL and anon key

## Public Assets
- `public/`
  - Default scaffold SVG assets are still present
  - No doctor image was found during indexing, even though `DoctorProfileCard` references `/doctor.jpg`

## Current Coupling
- `Doctors/page.js` depends on:
  - `DoctorSidebar`
  - `DoctorProfileCard`
  - `NgoCard`
  - `BlogCard`
  - intended `StatCard`

- `login/page.js` depends on:
  - `supabase.js`

## Structural Notes
- `README.md` is still the default template and does not describe this app.
- `src/app/page.js` is effectively unused right now because it renders no content.
- `src/app/WasteManagement/page.js` is empty, so that route is incomplete.
- `src/app/Doctors/page.js` imports `StatCard` from `@/Components/NgoCard`; that looks incorrect. The intended import appears to be `@/Components/StatCard`.
- Login redirect paths appear inconsistent with existing route folders:
  - `/NGO` vs actual `/Ngos`
  - `/Donors` does not exist
  - `/WasteWorkers` does not exist
  - `/Worker` vs actual `/Workers`
- `src/app/login/supabase.js` stores credentials inline instead of using environment variables.

## Suggested Next Cleanup Targets
- Replace placeholder route pages with real content or remove unused routes.
- Fix route naming so login redirects match actual folders.
- Move Supabase config to environment variables.
- Replace hardcoded sample dashboard data with props or fetched data.
- Add a project-specific README.
