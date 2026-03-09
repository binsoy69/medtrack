# MedTrack — Development Task Breakdown

**Reference:** [PRD.md](PRD.md) — the single source of truth for all requirements, formulas, and data model.

---

## Target Project Structure

```
medtrack/
├── .env.local                          # Supabase URL, anon key, service role key, Resend API key
├── .env.example                        # Same keys, no values, for documentation
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── middleware.ts                        # Supabase auth session refresh
├── vitest.config.ts
├── supabase/
│   └── migrations/
│       ├── 00001_create_tables.sql
│       ├── 00002_indexes_and_triggers.sql
│       ├── 00003_rls_policies.sql
│       ├── 00004_backfill_function.sql
│       ├── 00005_daily_deduction_function.sql
│       └── 00006_pg_cron_schedule.sql
├── scripts/
│   └── create-user.ts                  # Admin CLI script
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (Server Component)
│   │   ├── page.tsx                    # Redirect to /login
│   │   ├── error.tsx                   # Global error boundary
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx              # Authenticated layout with sidebar/nav
│   │   │   ├── loading.tsx             # Backfill loading state
│   │   │   ├── error.tsx               # App error boundary
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── medications/
│   │   │   │   ├── page.tsx            # Medication list
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── new/page.tsx        # Add medication form
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx        # Medication detail + deduction log
│   │   │   │   │   └── edit/page.tsx   # Edit medication form
│   │   │   ├── schedule/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── email/
│   │           └── daily-digest/route.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # createBrowserClient
│   │   │   ├── server.ts               # createServerClient for Server Components/Actions
│   │   │   ├── middleware.ts            # createServerClient for middleware
│   │   │   └── admin.ts                # createClient with service_role key
│   │   ├── constants.ts                # Unit types, frequencies, days-of-week, defaults
│   │   ├── types/
│   │   │   ├── database.ts             # TypeScript types matching SQL schema
│   │   │   └── actions.ts              # ActionResult<T> type
│   │   ├── validators/
│   │   │   ├── medication.ts           # Zod schema for medication form
│   │   │   └── settings.ts             # Zod schemas for settings forms
│   │   ├── utils/
│   │   │   ├── deduction.ts            # Daily deduction & backfill logic
│   │   │   ├── forecast.ts             # Run-out date calculation
│   │   │   ├── export.ts               # PDF/CSV generation
│   │   │   └── error.ts                # Supabase error handler
│   │   └── email/
│   │       ├── send.ts                 # Resend client wrapper
│   │       └── templates/
│   │           └── low-stock-digest.tsx
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── profiles.ts
│   │   ├── medications.ts
│   │   └── settings.ts
│   ├── stores/
│   │   ├── profile-store.ts
│   │   ├── medication-store.ts
│   │   └── notification-store.ts
│   ├── components/
│   │   ├── ui/                         # Reusable primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form-field.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── profile-selector.tsx
│   │   ├── dashboard/
│   │   │   ├── low-stock-summary.tsx
│   │   │   ├── todays-schedule.tsx
│   │   │   └── medication-quick-list.tsx
│   │   ├── medications/
│   │   │   ├── medication-list.tsx
│   │   │   ├── medication-card.tsx
│   │   │   ├── medication-form.tsx
│   │   │   ├── medication-detail.tsx
│   │   │   ├── quantity-adjuster.tsx
│   │   │   ├── stock-badge.tsx
│   │   │   ├── deduction-log.tsx
│   │   │   ├── forecast-display.tsx
│   │   │   ├── schedule-day-picker.tsx
│   │   │   └── time-picker-list.tsx
│   │   ├── schedule/
│   │   │   ├── weekly-grid.tsx
│   │   │   ├── day-column.tsx
│   │   │   └── schedule-export-buttons.tsx
│   │   └── settings/
│   │       ├── profile-manager.tsx
│   │       ├── change-username-form.tsx
│   │       ├── change-password-form.tsx
│   │       ├── timezone-form.tsx
│   │       └── notification-email-form.tsx
│   └── __tests__/
│       ├── utils/
│       │   ├── deduction.test.ts
│       │   ├── forecast.test.ts
│       │   └── export.test.ts
│       └── actions/
│           └── medications.test.ts
```

---

## Dependency Graph

```
Task 1  (Init project)
  ├─> Task 2  (DB schema)
  │    └─> Task 3  (RLS policies)
  ├─> Task 4  (Supabase clients + middleware)
  │    ├─> Task 5  (Login page + auth actions)
  │    │    └─> Task 7  (App shell + nav + profile store)
  │    │         ├─> Task 8  (Profile CRUD in settings)
  │    │         ├─> Task 9  (Medication list + quantity adjust)
  │    │         │    ├─> Task 10 (Medication add/edit forms)
  │    │         │    │    └─> Task 11 (Medication detail + deduction log)
  │    │         │    ├─> Task 15 (Dashboard)
  │    │         │    └─> Task 16 (Schedule view)
  │    │         │         └─> Task 17 (Schedule export)
  │    └─> Task 6  (Admin CLI)
  ├─> Task 12 (Deduction + forecast utils + tests) — no Supabase runtime dependency
  │    ├─> Task 13 (Backfill flow)
  │    │    └─> Task 15 (Dashboard — needs backfill to run first)
  │    ├─> Task 14 (pg_cron job)
  │    └─> Task 19 (Email digest — needs forecast)
  ├─> Task 18 (Account settings)
  │    └─> Task 19 (Email digest — needs notification_email)
  ├─> Task 20 (Error handling + validation hardening)
  │    └─> Task 21 (Integration tests)
  └─> Task 22 (Responsive + a11y polish) — depends on all UI tasks
```

**Parallelization opportunities:**

- Tasks 2 + 4 can start after Task 1 (in parallel)
- Tasks 5 + 6 can be done in parallel after Task 4
- Task 12 (pure utility functions) can start as early as after Task 2 (only needs TypeScript types)
- Tasks 8 + 9 can be done in parallel after Task 7
- Tasks 15 + 16 can be done in parallel after Task 9

---

## Phase 1: Project Scaffolding and Supabase Setup

### Task 1 — Initialize Next.js Project with Core Dependencies

**Description:**
Create the Next.js project using `create-next-app` with App Router, TypeScript, and Tailwind CSS. Install all project dependencies. Set up the project configuration files and constants.

**What to do (step by step):**

1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"` in the project root
2. Install runtime deps: `npm install @supabase/supabase-js @supabase/ssr zustand react-hook-form @hookform/resolvers zod jspdf resend date-fns`
3. Install dev deps: `npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom`
4. Create `.env.local` with placeholder keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`
5. Create `.env.example` with same keys but no values
6. Create `vitest.config.ts` with React plugin and path aliases
7. Create `src/lib/constants.ts` with:
   - `UNIT_TYPES`: `['pills', 'capsules', 'mL', 'mg', 'patches', 'tablets', 'drops', 'units']`
   - `FREQUENCIES`: `[{ value: 'once_daily', label: 'Once daily', multiplier: 1 }, { value: 'twice_daily', label: 'Twice daily', multiplier: 2 }, { value: 'three_times_daily', label: 'Three times daily', multiplier: 3 }]`
   - `DAYS_OF_WEEK`: `['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']`
   - `DEFAULT_LOW_STOCK_THRESHOLD`: `7`
   - `MAX_PROFILES_PER_USER`: `5`
   - `DEDUCTION_LOG_PAGE_SIZE`: `30`
8. Update `src/app/page.tsx` to redirect to `/login`
9. Add `"test": "vitest"` to package.json scripts

**Files to create/modify:**

- `package.json` (via create-next-app + npm install)
- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `.env.local`
- `.env.example`
- `vitest.config.ts`
- `src/lib/constants.ts`
- `src/app/layout.tsx` (root layout — minimal placeholder)
- `src/app/page.tsx` (redirect to `/login`)

**Depends on:** Nothing (first task)

**Acceptance criteria:**

- [ ] `npm run dev` starts the dev server without errors
- [ ] TypeScript compiles with strict mode enabled
- [ ] Tailwind CSS classes render correctly
- [ ] Path alias `@/` resolves to `src/`
- [ ] `npm run test` runs vitest successfully (even with no tests)
- [ ] `.env.example` documents all 5 required environment variables
- [ ] `constants.ts` exports all enums/constants listed above

**Recommended skills:** `nextjs-best-practices`, `typescript-expert`, `context7-auto-research`

---

### Task 2 — Create Supabase Project and Database Schema

**Description:**
Create a new Supabase project. Initialize the Supabase CLI locally. Write SQL migration files that create the full database schema with all tables, constraints, indexes, and triggers.

**What to do (step by step):**

1. Create a new Supabase project via the Supabase dashboard
2. Run `npx supabase init` in the project root
3. Run `npx supabase link --project-ref <project-id>`
4. Copy the Supabase URL, anon key, and service role key into `.env.local`
5. Create migration `supabase/migrations/00001_create_tables.sql`:
   - `profiles` table: `id UUID PK DEFAULT gen_random_uuid()`, `user_id UUID FK REFERENCES auth.users NOT NULL`, `name TEXT NOT NULL`, `created_at TIMESTAMPTZ DEFAULT now()`
   - `medications` table: `id UUID PK DEFAULT gen_random_uuid()`, `profile_id UUID FK REFERENCES profiles ON DELETE CASCADE`, `name TEXT NOT NULL`, `quantity NUMERIC NOT NULL DEFAULT 0`, `unit_type TEXT NOT NULL`, `dosage_amount NUMERIC NOT NULL`, `dosage_unit TEXT NOT NULL`, `frequency TEXT NOT NULL CHECK (frequency IN ('once_daily', 'twice_daily', 'three_times_daily'))`, `schedule_days TEXT[] NOT NULL`, `schedule_times TEXT[]`, `low_stock_threshold NUMERIC NOT NULL DEFAULT 7`, `last_deduction_date DATE`, `notes TEXT`, `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`
   - `deduction_logs` table: `id UUID PK DEFAULT gen_random_uuid()`, `medication_id UUID FK REFERENCES medications ON DELETE CASCADE`, `deduction_date DATE NOT NULL`, `amount_deducted NUMERIC NOT NULL`, `quantity_after NUMERIC NOT NULL`, `type TEXT NOT NULL CHECK (type IN ('auto', 'auto-backfill', 'manual'))`, `created_at TIMESTAMPTZ DEFAULT now()`
6. Create migration `supabase/migrations/00002_indexes_and_triggers.sql`:
   - Index on `profiles(user_id)`
   - Index on `medications(profile_id)`
   - Index on `deduction_logs(medication_id, deduction_date)`
   - Trigger function to enforce max 5 profiles per `user_id` (raise exception if count >= 5 on INSERT)
   - Trigger function to auto-update `updated_at` on `medications` row changes
7. Create `src/lib/types/database.ts` — manually authored TypeScript types exactly mirroring the SQL schema:
   - `Profile`: `{ id: string; user_id: string; name: string; created_at: string }`
   - `Medication`: all fields matching the SQL columns, with `schedule_days: string[]`, `schedule_times: string[] | null`, `last_deduction_date: string | null`, `notes: string | null`
   - `DeductionLog`: all fields, `type: 'auto' | 'auto-backfill' | 'manual'`
   - `UserMetadata`: `{ username: string; timezone: string; notification_email: string | null }`
8. Run `npx supabase db push` to apply migrations

**Files to create:**

- `supabase/config.toml` (via supabase init)
- `supabase/migrations/00001_create_tables.sql`
- `supabase/migrations/00002_indexes_and_triggers.sql`
- `src/lib/types/database.ts`

**Depends on:** Task 1

**Acceptance criteria:**

- [ ] `supabase db push` applies migrations without error
- [ ] All 3 tables exist with correct columns, types, constraints, and FKs
- [ ] The 5-profile-per-user constraint is enforced at the DB level (trigger raises exception)
- [ ] `updated_at` auto-updates on medication row changes
- [ ] TypeScript types in `database.ts` exactly mirror the SQL schema
- [ ] Indexes exist on `profiles(user_id)`, `medications(profile_id)`, `deduction_logs(medication_id, deduction_date)`

**Recommended skills:** `database-design`, `supabase-automation`, `typescript-expert`, `context7-auto-research`

---

### Task 3 — Configure Row Level Security Policies

**Description:**
Write RLS policies for all three tables so users can only access their own data. Create a helper function to avoid repeating ownership subqueries.

**What to do (step by step):**

1. Create migration `supabase/migrations/00003_rls_policies.sql`:
2. Enable RLS on `profiles`, `medications`, and `deduction_logs`
3. Create helper function `public.is_owner_of_profile(p_profile_id UUID)` returning BOOLEAN — checks `EXISTS (SELECT 1 FROM profiles WHERE id = p_profile_id AND user_id = auth.uid())`
4. `profiles` policies:
   - SELECT: `user_id = auth.uid()`
   - INSERT: `user_id = auth.uid()`
   - UPDATE: `user_id = auth.uid()`
   - DELETE: `user_id = auth.uid()`
5. `medications` policies:
   - SELECT: `is_owner_of_profile(profile_id)`
   - INSERT: `is_owner_of_profile(profile_id)`
   - UPDATE: `is_owner_of_profile(profile_id)`
   - DELETE: `is_owner_of_profile(profile_id)`
6. `deduction_logs` policies:
   - SELECT: `medication_id IN (SELECT id FROM medications WHERE is_owner_of_profile(profile_id))`
   - INSERT: same check (needed for backfill from Server Actions)
   - No UPDATE or DELETE policies (read-only for users)
7. Apply with `npx supabase db push`

**Files to create:**

- `supabase/migrations/00003_rls_policies.sql`

**Depends on:** Task 2

**Acceptance criteria:**

- [ ] RLS is enabled on all 3 tables
- [ ] Authenticated user can only see/modify their own profiles and medications
- [ ] Cross-user data access is blocked even with direct queries
- [ ] Deduction logs are insert-only and select-only (no update/delete)
- [ ] `service_role` key bypasses RLS (for pg_cron and admin CLI)

**Recommended skills:** `database-design`, `supabase-automation`, `context7-auto-research`

---

### Task 4 — Set Up Supabase Client Utilities and Auth Middleware

**Description:**
Create the Supabase client utility files following `@supabase/ssr` patterns, and the Next.js middleware for session refresh and auth redirects.

**What to do (step by step):**

1. Create `src/lib/supabase/client.ts`:
   - Export `createClient()` using `createBrowserClient` from `@supabase/ssr`
   - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Create `src/lib/supabase/server.ts`:
   - Export async `createClient()` using `createServerClient` from `@supabase/ssr`
   - Use `cookies()` from `next/headers` with read-only cookie handlers (`getAll` / `setAll`)
   - For Server Components and Server Actions
3. Create `src/lib/supabase/middleware.ts`:
   - Export `updateSession(request: NextRequest)` using `createServerClient` from `@supabase/ssr`
   - Full `getAll`/`setAll` cookie handlers that read from `request.cookies` and write to both `request.cookies` and `supabaseResponse`
   - Call `supabase.auth.getUser()` to refresh the session
   - Return the response with updated cookies
4. Create `src/lib/supabase/admin.ts`:
   - Export `createAdminClient()` using `createClient` from `@supabase/supabase-js` (NOT `@supabase/ssr`)
   - Uses `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS, server-side only
5. Create `middleware.ts` at project root:
   - Import `updateSession` from `@/lib/supabase/middleware`
   - Run on all routes except static assets, `_next`, and favicon
   - After session refresh, check if user is authenticated:
     - Unauthenticated → redirect to `/login` (unless already on `/login`)
     - Authenticated on `/login` → redirect to `/dashboard`
   - Export `config.matcher` to exclude static files

**Files to create:**

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/admin.ts`
- `middleware.ts`

**Depends on:** Task 1 (dependencies), Task 2 (Supabase project with URL/keys in `.env.local`)

**Acceptance criteria:**

- [ ] Browser client instantiates in Client Components without error
- [ ] Server client instantiates in Server Components/Actions and reads cookies
- [ ] Middleware refreshes sessions on every request
- [ ] Unauthenticated users are redirected to `/login`
- [ ] Authenticated users on `/login` are redirected to `/dashboard`
- [ ] Admin client uses `service_role` key and bypasses RLS
- [ ] No Supabase keys are exposed client-side except `NEXT_PUBLIC_` prefixed ones

**Recommended skills:** `nextjs-supabase-auth`, `nextjs-best-practices`, `typescript-expert`, `context7-auto-research`

---

## Phase 2: Authentication and Account Seeding

### Task 5 — Build Login Page and Auth Server Actions

**Description:**
Build the login page with React Hook Form + Zod validation, auth Server Actions (signIn, signOut), and reusable UI components (Button, Input, Card, FormField).

**What to do (step by step):**

1. Create `src/components/ui/button.tsx`:
   - Reusable button with variants: `primary`, `secondary`, `danger`, `ghost`
   - Sizes: `sm`, `md`, `lg`
   - Loading state (disabled + spinner)
   - Typed props extending `ButtonHTMLAttributes`
2. Create `src/components/ui/input.tsx`:
   - Styled text input with Tailwind
   - Props: extends `InputHTMLAttributes`, adds `error?: string` for border color change
3. Create `src/components/ui/card.tsx`:
   - Simple card wrapper with padding, border, rounded corners, shadow
4. Create `src/components/ui/form-field.tsx`:
   - Wraps label + input + error message with consistent spacing
   - Props: `label`, `error`, `children` (the input)
5. Create `src/actions/auth.ts`:
   - `signIn(formData: { username: string; password: string })`: uses server Supabase client, calls `supabase.auth.signInWithPassword({ email: username + '@medtrack.local', password })`. On success, redirect to `/dashboard`. On failure, return `{ error: 'Invalid username or password' }`
   - `signOut()`: calls `supabase.auth.signOut()`, redirects to `/login`
6. Create `src/app/(auth)/layout.tsx`:
   - Centered layout (flex, items-center, justify-center, min-h-screen)
   - Clean background, renders `{children}`
7. Create `src/app/(auth)/login/page.tsx`:
   - Client Component (`'use client'`)
   - React Hook Form with Zod schema: `username` (required, min 3 chars), `password` (required, min 8 chars)
   - Form fields using the UI components above
   - Calls `signIn` Server Action on submit
   - Shows loading state on button during submission
   - Displays server error message if login fails
   - Responsive: mobile-friendly centered card

**Files to create:**

- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/actions/auth.ts`
- `src/components/ui/form-field.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`

**Depends on:** Task 4

**Acceptance criteria:**

- [ ] Login page renders at `/login` with username and password fields
- [ ] Form validation shows inline errors for empty/short fields before submit
- [ ] Successful login redirects to `/dashboard`
- [ ] Failed login shows "Invalid username or password" error
- [ ] `signOut()` clears session and redirects to `/login`
- [ ] Unauthenticated access to any `(app)` route redirects to `/login`
- [ ] UI is responsive — centered card on all screen sizes

**Recommended skills:** `nextjs-supabase-auth`, `react-best-practices`, `tailwind-patterns`, `react-hook-form`, `context7-auto-research`

---

### Task 6 — Build Admin CLI Script for Account Seeding

**Description:**
Create a Node.js/TypeScript CLI script to seed user accounts via the Supabase Admin API.

**What to do (step by step):**

1. Create `scripts/create-user.ts`:
   - Parse CLI args: `--username` (required), `--password` (required), `--timezone` (required, e.g., `"Asia/Manila"`)
   - Use `process.argv` parsing (simple manual parsing or use `parseArgs` from `node:util`)
   - Import and use `createAdminClient()` from `@/lib/supabase/admin` (you may need to handle path resolution or use a relative import since this is a CLI script — alternatively, inline the admin client creation using `@supabase/supabase-js` with `dotenv`)
   - Call `supabase.auth.admin.createUser({ email: username + '@medtrack.local', password, email_confirm: true, user_metadata: { username, timezone, notification_email: null } })`
   - Insert a default profile: `supabase.from('profiles').insert({ user_id: newUser.id, name: username })`
   - Log success: `"User 'jane' created with default profile"`
   - Log errors: duplicate username, missing args, Supabase errors
   - Show usage help if required args are missing
2. Add to `package.json` scripts: `"create-user": "npx tsx scripts/create-user.ts"`
3. Load environment variables from `.env.local` using `dotenv/config` or inline

**Files to create:**

- `scripts/create-user.ts`
- Update `package.json` (add `create-user` script, add `dotenv` + `tsx` as dev deps if not present)

**Depends on:** Task 2 (database schema), Task 4 (admin client pattern)

**Acceptance criteria:**

- [ ] `npm run create-user -- --username vince --password temp1234 --timezone "Asia/Manila"` creates a user in Supabase Auth + a profile in the profiles table
- [ ] The created user can log in via the login page
- [ ] Duplicate username shows a clear error
- [ ] Missing required arguments shows usage help
- [ ] User's timezone is stored in `raw_user_meta_data`

**Recommended skills:** `typescript-expert`, `supabase-automation`, `context7-auto-research`

---

## Phase 3: App Shell, Profiles, and Navigation

### Task 7 — Build Authenticated App Layout with Navigation and Profile Selector

**Description:**
Build the authenticated app shell with responsive sidebar navigation, profile selector dropdown, and Zustand profile store with localStorage persistence.

**What to do (step by step):**

1. Create `src/stores/profile-store.ts` (Zustand):
   - State: `profiles: Profile[]`, `activeProfileId: string | null`
   - Actions: `setProfiles(profiles)`, `setActiveProfile(id)`, `addProfile(profile)`, `updateProfile(id, name)`, `removeProfile(id)`
   - Persist `activeProfileId` to `localStorage` using Zustand's `persist` middleware
   - On `setProfiles`, if `activeProfileId` is not in the list, default to the first profile
2. Create `src/app/(app)/layout.tsx` (Server Component):
   - Fetch current user via `supabase.auth.getUser()`
   - Fetch user's profiles from `profiles` table
   - Pass `user` and `profiles` data to the client-side `AppShell` component
3. Create `src/components/layout/app-shell.tsx` (Client Component):
   - Initializes Zustand profile store with the profiles data from the server
   - Renders sidebar on desktop, mobile nav on mobile
   - Renders `{children}` in the main content area
4. Create `src/components/layout/sidebar.tsx`:
   - Logo/app name ("MedTrack") at top
   - Nav links: Dashboard (`/dashboard`), Medications (`/medications`), Schedule (`/schedule`), Settings (`/settings`)
   - Active link highlighting
   - Sign-out button at bottom (calls `signOut` Server Action)
5. Create `src/components/layout/mobile-nav.tsx`:
   - Hamburger button in a fixed top bar
   - Slide-out drawer or overlay with same links as sidebar
   - Close on navigation or outside click
6. Create `src/components/layout/profile-selector.tsx`:
   - Dropdown showing all profile names
   - Active profile highlighted with a checkmark
   - Clicking a profile calls `setActiveProfile(id)`
   - Placed prominently in sidebar (above nav links)

**Files to create:**

- `src/app/(app)/layout.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/layout/sidebar.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/components/layout/profile-selector.tsx`
- `src/stores/profile-store.ts`

**Depends on:** Task 5 (auth works), Task 2 (profiles table)

**Acceptance criteria:**

- [ ] Authenticated users see the app shell with sidebar on desktop and hamburger on mobile
- [ ] Profile selector shows all profiles for the current user
- [ ] Switching profiles updates the Zustand store and persists to localStorage
- [ ] Nav links route to `/dashboard`, `/medications`, `/schedule`, `/settings`
- [ ] Active nav link is visually highlighted
- [ ] Sign-out button calls signOut action and redirects to `/login`
- [ ] Layout fetches user and profile data server-side on initial load

**Recommended skills:** `nextjs-best-practices`, `react-best-practices`, `zustand-store-ts`, `tailwind-patterns`, `context7-auto-research`

---

### Task 8 — Build Profile Management (CRUD) in Settings

**Description:**
Build the profile management section of the Settings page with inline rename, add, and delete (with confirmation dialog).

**What to do (step by step):**

1. Create `src/actions/profiles.ts`:
   - `createProfile(name: string)`: check count < 5, insert into `profiles`, return new profile. Call `revalidatePath('/', 'layout')`
   - `renameProfile(profileId: string, newName: string)`: update profile name. Call `revalidatePath`
   - `deleteProfile(profileId: string)`: check it's not the last profile, delete (CASCADE removes medications + logs). Call `revalidatePath`
2. Create `src/components/ui/confirm-dialog.tsx`:
   - Props: `open`, `title`, `message`, `confirmLabel`, `onConfirm`, `onCancel`
   - Modal overlay with cancel and confirm buttons
   - Confirm button uses `danger` variant
   - Close on Escape key and overlay click
3. Create `src/components/settings/profile-manager.tsx` (Client Component):
   - Displays list of profiles with inline rename (editable text field triggered by edit icon/button)
   - Delete button per profile (triggers confirm dialog)
   - "Add Profile" button with a text input that appears on click
   - "Add Profile" button disabled with tooltip when at 5 profiles
   - Last profile's delete button disabled
   - After mutations, update Zustand profile store client-side
4. Create `src/app/(app)/settings/page.tsx` (initial version):
   - Server Component that fetches profiles
   - Renders `ProfileManager` component
   - Placeholder sections for account settings (built in Task 18)

**Files to create:**

- `src/actions/profiles.ts`
- `src/components/ui/confirm-dialog.tsx`
- `src/components/settings/profile-manager.tsx`
- `src/app/(app)/settings/page.tsx`

**Depends on:** Task 7 (app shell, profile store), Task 3 (RLS policies)

**Acceptance criteria:**

- [ ] Users can add a new profile (up to 5 max)
- [ ] "Add Profile" button is disabled at the 5-profile limit
- [ ] Users can rename any profile inline
- [ ] Users can delete a profile (with confirmation dialog) — cascades to medications and logs
- [ ] Last remaining profile cannot be deleted
- [ ] Profile changes immediately reflect in the sidebar profile selector
- [ ] RLS enforces ownership (cannot modify another user's profiles)

**Recommended skills:** `nextjs-best-practices`, `react-best-practices`, `supabase-automation`, `context7-auto-research`

---

## Phase 4: Medication CRUD and Core Business Logic

### Task 9 — Build Medication List View with Quick Quantity Update

**Description:**
Build the medications list page with card grid display and inline "+/-" quantity adjuster.

**What to do (step by step):**

1. Create `src/actions/medications.ts` (initial version):
   - `fetchMedications(profileId: string)`: fetch all medications for a profile, ordered alphabetically
   - `adjustQuantity(medicationId: string, amount: number)`: update medication quantity (add or subtract), insert deduction_log with `type='manual'`, `amount_deducted = -amount` (negative for additions since it's a "deduction" log), `quantity_after = new quantity`. Validate new quantity >= 0
2. Create `src/components/medications/stock-badge.tsx`:
   - Props: `quantity`, `threshold`
   - Shows "Out of Stock" badge (red) when `quantity === 0`
   - Shows "Low Stock" badge (amber) when `quantity > 0 && quantity <= threshold`
   - Shows nothing when stock is adequate
3. Create `src/components/medications/quantity-adjuster.tsx`:
   - Inline "+/-" buttons with a small number input between them
   - Clicking "+" or "-" adjusts by 1 by default
   - Optionally: popover/input to enter a custom amount
   - Calls `adjustQuantity` Server Action on change
   - Shows optimistic UI update (update displayed quantity immediately, revert on error)
4. Create `src/components/medications/medication-card.tsx`:
   - Displays: name, quantity + unit, dosage summary (e.g., "2 pills, twice daily"), stock badge, run-out date placeholder
   - Includes quantity-adjuster component
   - Entire card is clickable → links to `/medications/[id]`
   - The quantity-adjuster click events must stop propagation so they don't navigate
5. Create `src/components/medications/medication-list.tsx`:
   - Renders a responsive grid of medication cards
   - Props: `medications: Medication[]`
   - Shows empty state: "No medications added yet. Add your first medication."
6. Create `src/app/(app)/medications/page.tsx`:
   - Client Component wrapper that reads `activeProfileId` from Zustand store
   - Fetches medications for the active profile (using `useEffect` + Server Action or SWR pattern)
   - Renders `MedicationList` component
   - "Add Medication" button linking to `/medications/new`
7. Create `src/app/(app)/medications/loading.tsx` with skeleton cards

**Files to create:**

- `src/app/(app)/medications/page.tsx`
- `src/app/(app)/medications/loading.tsx`
- `src/components/medications/medication-list.tsx`
- `src/components/medications/medication-card.tsx`
- `src/components/medications/quantity-adjuster.tsx`
- `src/components/medications/stock-badge.tsx`
- `src/actions/medications.ts` (initial version with `fetchMedications`, `adjustQuantity`)

**Depends on:** Task 7 (app shell, profile store), Task 2 (medications table), Task 3 (RLS)

**Acceptance criteria:**

- [ ] Medications page shows all medications for the active profile in a card grid
- [ ] Each card displays name, quantity, unit, dosage summary, and stock status badge
- [ ] Quick quantity adjuster (+/-) allows adding or removing stock inline
- [ ] Manual quantity changes are recorded in `deduction_logs` with `type='manual'`
- [ ] Low stock badge appears when `quantity <= threshold`
- [ ] Out of stock badge appears when `quantity === 0`
- [ ] "Add Medication" button navigates to `/medications/new`
- [ ] Clicking a card navigates to `/medications/[id]`
- [ ] Empty state shown when no medications exist
- [ ] Responsive: single column on mobile, multi-column grid on desktop

**Recommended skills:** `nextjs-best-practices`, `react-best-practices`, `tailwind-patterns`, `supabase-automation`, `context7-auto-research`

---

### Task 10 — Build Medication Add/Edit Forms

**Description:**
Build the shared medication form component (React Hook Form + Zod) and the add/edit pages.

**What to do (step by step):**

1. Create `src/lib/validators/medication.ts` (Zod schema):
   - `medicationSchema = z.object({...})` validating:
     - `name`: `z.string().min(1, 'Medication name is required')`
     - `quantity`: `z.number().min(0, 'Quantity cannot be negative')`
     - `unitType`: `z.enum([...UNIT_TYPES])`
     - `dosageAmount`: `z.number().min(0.1, 'Dosage must be greater than 0')`
     - `dosageUnit`: `z.enum([...UNIT_TYPES])`
     - `frequency`: `z.enum(['once_daily', 'twice_daily', 'three_times_daily'])`
     - `scheduleDays`: `z.array(z.enum([...DAYS_OF_WEEK])).min(1, 'Select at least one day')`
     - `scheduleTimes`: `z.array(z.string()).optional()`
     - `lowStockThreshold`: `z.number().min(0, 'Threshold cannot be negative')`
     - `notes`: `z.string().optional()`
2. Create `src/components/medications/schedule-day-picker.tsx`:
   - Multi-select checkboxes for Mon–Sun
   - Visual pill/chip style for each day
   - Integration with React Hook Form via `Controller`
3. Create `src/components/medications/time-picker-list.tsx`:
   - Dynamic list of time inputs (HTML `<input type="time">`)
   - "Add time" button to add a new slot
   - "Remove" button (×) on each slot
   - Minimum 0 slots (optional field), start with 1 empty slot on create
4. Create `src/components/medications/medication-form.tsx` (Client Component):
   - Props: `mode: 'create' | 'edit'`, `defaultValues?: Medication` (for edit mode)
   - React Hook Form with `zodResolver(medicationSchema)`
   - All fields from the PRD: name (text), quantity (number), unit type (dropdown from UNIT_TYPES), dosage amount (number), dosage unit (dropdown), frequency (dropdown from FREQUENCIES), schedule days (ScheduleDayPicker), times of day (TimePickerList), low stock threshold (number, default 7), notes (textarea)
   - Submit button text: "Add Medication" or "Save Changes"
   - Cancel button linking back to `/medications`
5. Add Server Actions to `src/actions/medications.ts`:
   - `createMedication(profileId: string, data: MedicationFormData)`: insert into `medications` table, set `last_deduction_date` to today, redirect to `/medications`
   - `updateMedication(medicationId: string, data: MedicationFormData)`: update the row, redirect to `/medications/[id]`
6. Create `src/app/(app)/medications/new/page.tsx`:
   - Renders the form in "create" mode
   - Reads `activeProfileId` from client-side store or passes via searchParam
7. Create `src/app/(app)/medications/[id]/edit/page.tsx`:
   - Server Component: fetch the medication by ID
   - Pass medication data to the form in "edit" mode

**Files to create:**

- `src/lib/validators/medication.ts`
- `src/components/medications/medication-form.tsx`
- `src/components/medications/schedule-day-picker.tsx`
- `src/components/medications/time-picker-list.tsx`
- `src/app/(app)/medications/new/page.tsx`
- `src/app/(app)/medications/[id]/edit/page.tsx`
- Update `src/actions/medications.ts` (add `createMedication`, `updateMedication`)

**Depends on:** Task 9 (medications list, actions file), Task 5 (UI components)

**Acceptance criteria:**

- [ ] Add form at `/medications/new` renders all fields with validation
- [ ] Zod validates: name non-empty, quantity >= 0, dosage > 0, at least one schedule day, valid frequency
- [ ] Inline validation errors show on invalid submit
- [ ] Successful create redirects to `/medications` and medication appears in list
- [ ] Edit form at `/medications/[id]/edit` pre-fills all fields
- [ ] Successful edit redirects to `/medications/[id]`
- [ ] Times of day can be added/removed dynamically
- [ ] Low stock threshold defaults to 7 in create mode
- [ ] Form is responsive and usable on mobile

**Recommended skills:** `react-hook-form`, `react-best-practices`, `typescript-expert`, `tailwind-patterns`, `context7-auto-research`

---

### Task 11 — Build Medication Detail Page with Delete and Deduction Log

**Description:**
Build the medication detail page showing all fields, run-out forecast, edit/delete actions, and the paginated deduction log.

**What to do (step by step):**

1. Add Server Actions to `src/actions/medications.ts`:
   - `fetchMedication(id: string)`: fetch single medication by ID (RLS enforces ownership)
   - `deleteMedication(id: string)`: delete with confirmation (CASCADE deletes logs), redirect to `/medications`
   - `fetchDeductionLogs(medicationId: string, page: number)`: fetch logs ordered by `deduction_date DESC, created_at DESC`, limit 30 per page, return `{ logs, hasMore }`
2. Create `src/components/medications/forecast-display.tsx`:
   - Props: `quantity`, `dosageAmount`, `frequency`, `scheduleDays`
   - Calculates and displays run-out date using forecast utility (placeholder — wired to real utility in Task 12)
   - Shows "Runs out: Mar 22" or "~14 days remaining"
   - Shows "Out of Stock" if quantity is 0
   - Amber styling for ≤ 7 scheduled days remaining, red for out of stock
3. Create `src/components/medications/deduction-log.tsx` (Client Component):
   - Fetches logs page by page using `fetchDeductionLogs`
   - Each entry shows: date, type badge (auto=blue, auto-backfill=purple, manual=green), amount (negative=red, positive=green), quantity after
   - "Load more" button when `hasMore` is true
   - Empty state: "No deduction history yet"
4. Create `src/components/medications/medication-detail.tsx`:
   - Displays all medication fields in a clean, readable layout
   - Sections: Info (name, quantity, unit, notes), Dosage (amount, unit, frequency), Schedule (days as chips, times), Stock (threshold, forecast)
   - Low-stock warning banner when `quantity <= threshold`
5. Create `src/app/(app)/medications/[id]/page.tsx`:
   - Server Component: fetch medication by ID
   - Renders: `MedicationDetail`, edit button (→ `/medications/[id]/edit`), delete button (with confirm dialog), `DeductionLog`

**Files to create:**

- `src/app/(app)/medications/[id]/page.tsx`
- `src/components/medications/medication-detail.tsx`
- `src/components/medications/deduction-log.tsx`
- `src/components/medications/forecast-display.tsx`
- Update `src/actions/medications.ts` (add `fetchMedication`, `deleteMedication`, `fetchDeductionLogs`)

**Depends on:** Task 10 (create/edit flow), Task 9 (card links here)

**Acceptance criteria:**

- [ ] Detail page shows all medication fields in a clear layout
- [ ] Run-out date forecast is displayed
- [ ] Edit button navigates to the edit form
- [ ] Delete button shows confirmation dialog; on confirm, deletes and redirects to `/medications`
- [ ] Deduction log shows entries in reverse chronological order
- [ ] Each log entry type has distinct visual styling (color/badge)
- [ ] Pagination loads 30 entries with "Load more" button
- [ ] Empty log state shows "No deduction history yet"
- [ ] Low-stock warning banner displayed when applicable

**Recommended skills:** `nextjs-best-practices`, `react-best-practices`, `tailwind-patterns`, `supabase-automation`, `context7-auto-research`

---

### Task 12 — Implement Deduction Calculation, Backfill Logic, and Forecast Utilities (with Unit Tests)

**Description:**
Implement the core business logic as pure utility functions with comprehensive unit tests. These functions contain zero Supabase calls — they are pure TypeScript.

**What to do (step by step):**

1. Create `src/lib/utils/deduction.ts`:
   - `calculateDailyDeduction(dosageAmount: number, frequency: string): number`
     - Returns `dosageAmount * multiplier` where once_daily=1, twice_daily=2, three_times_daily=3
   - `isScheduledDay(date: Date, scheduleDays: string[]): boolean`
     - Gets the day name (lowercase) from `date` using `date-fns` `format(date, 'EEEE').toLowerCase()`
     - Returns `scheduleDays.includes(dayName)`
   - `calculateBackfillDeductions(medication: { lastDeductionDate: string | null; scheduleDays: string[]; dosageAmount: number; frequency: string; quantity: number }, today: Date): Array<{ date: Date; amountDeducted: number; quantityAfter: number }>`
     - If `lastDeductionDate` is null or >= today, return empty array
     - Iterate from `lastDeductionDate + 1 day` to `today` (inclusive)
     - For each day: if `isScheduledDay(day, scheduleDays)`, deduct `calculateDailyDeduction()`
     - Cap quantity at 0 — once 0, no more deductions
     - Return array of `{ date, amountDeducted, quantityAfter }` entries
2. Create `src/lib/utils/forecast.ts`:
   - `calculateRunOutDate(currentQuantity: number, dosageAmount: number, frequency: string, scheduleDays: string[], fromDate: Date): Date | null`
     - If quantity <= 0, return null
     - Iterate forward from `fromDate`, counting only scheduled days
     - Deduct daily amount each scheduled day
     - Return the date when quantity reaches 0
   - `daysUntilRunOut(currentQuantity: number, dosageAmount: number, frequency: string, scheduleDays: string[], fromDate: Date): number`
     - Calls `calculateRunOutDate` and returns the calendar day difference
     - Returns 0 if already out of stock
3. Create `src/__tests__/utils/deduction.test.ts`:
   - `calculateDailyDeduction(1, 'once_daily')` → 1
   - `calculateDailyDeduction(2, 'twice_daily')` → 4
   - `calculateDailyDeduction(5, 'three_times_daily')` → 15
   - `isScheduledDay` correctly identifies Mon–Sun
   - `isScheduledDay` returns false for unscheduled days
   - Backfill for Mon-Fri med with 3 missed weekdays → 3 entries
   - Backfill skips weekends for weekday-only med
   - Backfill caps at 0 and stops deducting
   - Backfill with lastDeductionDate=today → empty array
   - Backfill with null lastDeductionDate → empty array (or handles gracefully)
4. Create `src/__tests__/utils/forecast.test.ts`:
   - 14 pills at 2/day daily → runs out in 7 calendar days
   - 10 pills at 2/day Mon-Fri → correct date accounting for weekends
   - Quantity 0 → returns null
   - Single-day-per-week schedule → correct extended timeline

**Files to create:**

- `src/lib/utils/deduction.ts`
- `src/lib/utils/forecast.ts`
- `src/__tests__/utils/deduction.test.ts`
- `src/__tests__/utils/forecast.test.ts`

**Depends on:** Task 2 (TypeScript types in `database.ts`)

**Acceptance criteria:**

- [ ] `calculateDailyDeduction(2, 'twice_daily')` returns 4
- [ ] `calculateDailyDeduction(5, 'three_times_daily')` returns 15
- [ ] `isScheduledDay` correctly identifies scheduled vs. unscheduled days
- [ ] Backfill for Mon-Fri med with 3 missed weekdays returns 3 deduction entries
- [ ] Backfill caps quantity at 0 and stops deducting
- [ ] Forecast for 14 pills at 2/day daily returns today + 7 calendar days
- [ ] Forecast for weekday-only med accounts for weekends
- [ ] Out-of-stock medication forecast returns null
- [ ] All tests pass via `npm run test`
- [ ] Functions are pure (no side effects) and fully typed

**Recommended skills:** `typescript-expert`

---

### Task 13 — Implement Login Backfill Flow

**Description:**
Integrate backfill logic into the app loading flow so missed deductions are applied before the user sees inventory data.

**What to do (step by step):**

1. Create migration `supabase/migrations/00004_backfill_function.sql`:
   - Postgres function `perform_backfill(p_medication_id UUID, p_deductions JSONB)`:
     - Accepts medication ID and a JSONB array of `[{ date, amount_deducted, quantity_after }]`
     - In a single transaction: update medication's `quantity` and `last_deduction_date`, insert all deduction_log rows with `type='auto-backfill'`
     - Mark as `SECURITY DEFINER` to ensure it can update regardless of RLS (or ensure the calling user has permissions)
2. Add to `src/actions/medications.ts`:
   - `backfillDeductions(profileId: string)`:
     - Fetch all medications for the profile
     - Get user's timezone from `supabase.auth.getUser()` → `user.user_metadata.timezone`
     - Calculate today's date in user's timezone using `date-fns-tz` or manual conversion
     - For each medication, call `calculateBackfillDeductions(medication, today)`
     - If any deductions needed, call the `perform_backfill` RPC for each medication
     - Skip medications where backfill returns empty array
   - `backfillAllProfiles(userId: string)`:
     - Fetch all profiles for the user
     - Call `backfillDeductions` for each profile
3. Update `src/app/(app)/layout.tsx`:
   - After fetching the user, call `backfillAllProfiles(user.id)` before rendering children
   - Show a loading state during backfill: "Updating your medication inventory..."
4. Create `src/app/(app)/loading.tsx` with the loading message
5. Install `date-fns-tz` if needed for timezone-aware date calculations: `npm install date-fns-tz`
6. Ensure idempotency: if `lastDeductionDate` is already today (in user's timezone), skip

**Files to create:**

- `supabase/migrations/00004_backfill_function.sql`
- Update `src/actions/medications.ts` (add `backfillDeductions`, `backfillAllProfiles`)
- Update `src/app/(app)/layout.tsx` (trigger backfill on load)
- `src/app/(app)/loading.tsx`

**Depends on:** Task 12 (deduction utilities), Task 9 (medications actions)

**Acceptance criteria:**

- [ ] After 3 missed days, backfill creates correct deduction_log entries with historical dates and `type='auto-backfill'`
- [ ] Medication quantities are updated correctly after backfill
- [ ] Medications that would go below 0 are capped at 0
- [ ] `last_deduction_date` is updated to today after backfill
- [ ] Backfill is idempotent (running twice on same day = no duplicate entries)
- [ ] Loading state shown while backfill processes
- [ ] Backfill runs for ALL profiles belonging to the user, not just the active one

**Recommended skills:** `supabase-automation`, `database-design`, `nextjs-best-practices`, `typescript-expert`, `context7-auto-research`

---

## Phase 5: pg_cron Automatic Deductions

### Task 14 — Create pg_cron Daily Deduction Job and Database Function

**Description:**
Create the Postgres function and pg_cron job for automatic daily deductions across all users, respecting each user's timezone.

**What to do (step by step):**

1. Create migration `supabase/migrations/00005_daily_deduction_function.sql`:
   - Function `perform_daily_deductions()` returns void:
     - `SET search_path = public, extensions;`
     - `SECURITY DEFINER` to bypass RLS
     - Query: join `medications` → `profiles` → `auth.users` to get each medication alongside its user's timezone
     - For each medication where:
       - The user's timezone's "today" (`(now() AT TIME ZONE timezone)::date`) has not yet been deducted (`last_deduction_date < today_in_user_tz OR last_deduction_date IS NULL`)
       - Today's day-of-week (in user's timezone) is in the medication's `schedule_days` array
       - `quantity > 0`
     - Calculate `daily_deduction = dosage_amount * CASE frequency WHEN 'once_daily' THEN 1 WHEN 'twice_daily' THEN 2 WHEN 'three_times_daily' THEN 3 END`
     - Update `quantity = GREATEST(quantity - daily_deduction, 0)`, `last_deduction_date = today_in_user_tz`, `updated_at = now()`
     - Insert deduction_log: `type = 'auto'`, `deduction_date = today_in_user_tz`, `amount_deducted = daily_deduction`, `quantity_after = new quantity`
     - Handle edge case: if `quantity < daily_deduction`, deduct only what's available (set to 0)
2. Create migration `supabase/migrations/00006_pg_cron_schedule.sql`:
   - Enable the `pg_cron` extension: `CREATE EXTENSION IF NOT EXISTS pg_cron;`
   - Schedule: `SELECT cron.schedule('daily-med-deductions', '0 * * * *', 'SELECT perform_daily_deductions()');`
   - Runs every hour to cover all timezones
3. Apply with `npx supabase db push`

**Files to create:**

- `supabase/migrations/00005_daily_deduction_function.sql`
- `supabase/migrations/00006_pg_cron_schedule.sql`

**Depends on:** Task 2 (schema), Task 3 (RLS — function uses SECURITY DEFINER to bypass)

**Acceptance criteria:**

- [ ] `perform_daily_deductions()` correctly deducts from medications where today is a scheduled day
- [ ] Medications already deducted today (`last_deduction_date = today`) are skipped
- [ ] Quantities are capped at 0 (never negative)
- [ ] Deduction_log entry with `type='auto'` is created for each deduction
- [ ] pg_cron job is scheduled to run every hour
- [ ] Timezone conversion is correct (Asia/Manila at UTC+8 → midnight = 4 PM UTC)
- [ ] Medications with `quantity = 0` are skipped

**Recommended skills:** `database-design`, `supabase-automation`, `context7-auto-research`

---

## Phase 6: Dashboard

### Task 15 — Build the Dashboard Page

**Description:**
Build the main dashboard page with low stock summary, today's schedule, and full medication list with quick quantity update.

**What to do (step by step):**

1. Create `src/components/dashboard/low-stock-summary.tsx`:
   - Props: `medications: Medication[]`
   - Filter medications at or below their `lowStockThreshold`
   - Sort by soonest run-out date (using forecast utility)
   - Display top 5 most urgent: name, quantity remaining, run-out date
   - Out-of-stock items in red, low stock in amber
   - Show count badge: "3 medications low in stock"
   - Each item links to `/medications/[id]`
   - Empty state: "All medications are well stocked"
2. Create `src/components/dashboard/todays-schedule.tsx`:
   - Props: `medications: Medication[]`, `today: string` (day name)
   - Filter medications where today is in `scheduleDays`
   - Display: name, dosage (amount + unit), times of day
   - Empty state: "No medications scheduled today"
3. Create `src/components/dashboard/medication-quick-list.tsx`:
   - Props: `medications: Medication[]`
   - Compact list with: name, quantity + unit, run-out date, stock badge, quantity adjuster
   - Each row links to detail page
   - Reuses `QuantityAdjuster` and `StockBadge` from Task 9
4. Create `src/app/(app)/dashboard/page.tsx`:
   - Client Component wrapper that reads `activeProfileId` from Zustand
   - Fetches medications for active profile
   - Renders: `LowStockSummary`, `TodaysSchedule`, `MedicationQuickList`
   - Sections arranged vertically: summary at top, today's schedule, then full list
5. Create `src/app/(app)/dashboard/loading.tsx` with skeleton UI

**Files to create:**

- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/dashboard/loading.tsx`
- `src/components/dashboard/low-stock-summary.tsx`
- `src/components/dashboard/todays-schedule.tsx`
- `src/components/dashboard/medication-quick-list.tsx`

**Depends on:** Task 9 (medication list, quantity adjuster, stock badge), Task 12 (forecast utilities), Task 13 (backfill runs before dashboard renders)

**Acceptance criteria:**

- [ ] Dashboard shows low stock summary card with count and top 5 most urgent
- [ ] Out-of-stock in red, low stock in amber
- [ ] Today's schedule section shows only medications scheduled for today
- [ ] Full medication list shows all medications with quantity, forecast, and status
- [ ] Quick quantity adjuster works inline
- [ ] Dashboard responds to profile switching
- [ ] Empty states handled: "All medications are well stocked", "No medications scheduled today", "No medications added yet"
- [ ] Loading skeleton while data loads

**Recommended skills:** `nextjs-best-practices`, `react-best-practices`, `tailwind-patterns`, `context7-auto-research`

---

## Phase 7: Schedule View and Export

### Task 16 — Build Schedule View Page

**Description:**
Build the weekly schedule view showing all medications organized by day of the week.

**What to do (step by step):**

1. Create `src/components/schedule/day-column.tsx`:
   - Props: `dayName: string`, `medications: Array<{ name, dosageAmount, dosageUnit, scheduleTimes }>`, `isToday: boolean`
   - Highlighted background if `isToday`
   - List each medication: name, dosage, times
   - Empty state: "No medications"
2. Create `src/components/schedule/weekly-grid.tsx`:
   - Props: `medications: Medication[]`, `today: string`
   - Creates 7 `DayColumn` components (Mon–Sun)
   - Groups medications by their scheduled days
   - Desktop: 7-column horizontal grid
   - Mobile: stacked vertical layout (each day as an expandable accordion or full-width row)
3. Create `src/components/schedule/schedule-export-buttons.tsx`:
   - Placeholder with "Export PDF" and "Export CSV" buttons (disabled for now)
   - Will be wired in Task 17
4. Create `src/app/(app)/schedule/page.tsx`:
   - Client Component wrapper that reads active profile
   - Fetches medications for the active profile
   - Renders `WeeklyGrid` and `ScheduleExportButtons`
   - Note at bottom: "To edit schedules, go to the medication's detail page"

**Files to create:**

- `src/app/(app)/schedule/page.tsx`
- `src/components/schedule/weekly-grid.tsx`
- `src/components/schedule/day-column.tsx`
- `src/components/schedule/schedule-export-buttons.tsx`

**Depends on:** Task 9 (medications data), Task 7 (profile store)

**Acceptance criteria:**

- [ ] Schedule page shows 7-day weekly grid with medications organized by day
- [ ] Each entry shows medication name, dosage, and times
- [ ] Current day's column is visually highlighted
- [ ] Mobile layout switches to stacked/accordion view
- [ ] Medications with no times show dosage only
- [ ] Empty days show "No medications"
- [ ] Export buttons are visible (non-functional until Task 17)

**Recommended skills:** `react-best-practices`, `tailwind-patterns`, `nextjs-best-practices`, `context7-auto-research`

---

### Task 17 — Implement Schedule Export (PDF and CSV)

**Description:**
Implement client-side export of the medication schedule as PDF and CSV files.

**What to do (step by step):**

1. Create `src/lib/utils/export.ts`:
   - `exportScheduleAsPdf(profileName: string, medications: Medication[]): void`
     - Uses `jsPDF` to create a PDF document
     - Title: "Medication Schedule — [Profile Name]"
     - Subtitle: "Generated on [date]"
     - Table with columns: Medication, Dosage, Unit, Frequency, Schedule Days, Times, Notes
     - Each medication as a row
     - Auto-size columns, handle long text wrapping
     - Trigger browser download: `[ProfileName]-schedule.pdf`
   - `exportScheduleAsCsv(profileName: string, medications: Medication[]): void`
     - Generate CSV string with headers: Medication,Dosage Amount,Dosage Unit,Frequency,Schedule Days,Times,Notes
     - Properly escape fields containing commas, quotes, or newlines (wrap in double quotes, escape internal quotes)
     - Schedule days joined with semicolons (not commas) within the CSV field
     - Times joined with semicolons
     - Trigger browser download using `Blob` + `URL.createObjectURL`: `[ProfileName]-schedule.csv`
   - Per PRD: exports include only schedule data (NOT quantities, thresholds, or forecasts)
2. Update `src/components/schedule/schedule-export-buttons.tsx`:
   - Wire "Export PDF" button to call `exportScheduleAsPdf`
   - Wire "Export CSV" button to call `exportScheduleAsCsv`
   - Pass current profile name and medications from parent
   - Disable buttons if no medications exist (with tooltip)

**Files to create:**

- `src/lib/utils/export.ts`
- Update `src/components/schedule/schedule-export-buttons.tsx`

**Depends on:** Task 16 (schedule page, buttons placed), Task 9 (medication data)

**Acceptance criteria:**

- [ ] "Export PDF" downloads `[ProfileName]-schedule.pdf`
- [ ] PDF contains profile name, date, and readable medication table
- [ ] "Export CSV" downloads `[ProfileName]-schedule.csv`
- [ ] CSV has proper headers, semicolon-joined schedule days/times, escaped commas/quotes
- [ ] Exports include only schedule data (no quantities, thresholds, forecasts)
- [ ] Buttons disabled with tooltip when no medications exist
- [ ] Both exports work on mobile browsers

**Recommended skills:** `typescript-expert`, `react-best-practices`, `context7-auto-research`

---

## Phase 8: Settings and Email Notifications

### Task 18 — Build Account Settings Page (Username, Password, Timezone, Email)

**Description:**
Complete the Settings page with account settings forms for username, password, timezone, and notification email.

**What to do (step by step):**

1. Create `src/lib/validators/settings.ts` (Zod schemas):
   - `usernameSchema`: `z.object({ username: z.string().min(3).max(30) })`
   - `passwordSchema`: `z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8), confirmPassword: z.string().min(8) }).refine(data => data.newPassword === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })`
   - `timezoneSchema`: `z.object({ timezone: z.string().min(1) })`
   - `notificationEmailSchema`: `z.object({ email: z.string().email().optional().or(z.literal('')) })`
2. Create `src/actions/settings.ts`:
   - `updateUsername(newUsername: string)`: use admin client (`createAdminClient`) to call `supabase.auth.admin.updateUserById(userId, { email: newUsername + '@medtrack.local', user_metadata: { username: newUsername } })`. Check uniqueness first by querying existing users
   - `updatePassword(currentPassword: string, newPassword: string)`: verify current password by calling `supabase.auth.signInWithPassword(...)`, then call `supabase.auth.updateUser({ password: newPassword })`
   - `updateTimezone(timezone: string)`: call server client `supabase.auth.updateUser({ data: { timezone } })`
   - `updateNotificationEmail(email: string | null)`: call server client `supabase.auth.updateUser({ data: { notification_email: email || null } })`
3. Create `src/components/settings/change-username-form.tsx`:
   - Shows current username, input for new username
   - React Hook Form + Zod validation
   - Calls `updateUsername` Server Action
   - Success/error feedback
4. Create `src/components/settings/change-password-form.tsx`:
   - Current password, new password, confirm password fields
   - React Hook Form + Zod with password match refinement
   - Calls `updatePassword` Server Action
5. Create `src/components/settings/timezone-form.tsx`:
   - Dropdown of IANA timezones (use `Intl.supportedValuesOf('timeZone')` or a curated list)
   - Current timezone pre-selected
   - Calls `updateTimezone` Server Action
6. Create `src/components/settings/notification-email-form.tsx`:
   - Email input (optional), current value pre-filled if set
   - "Clear" button to remove the email (opt out)
   - Calls `updateNotificationEmail` Server Action
   - Helper text: "You'll receive a daily email when any medication is low in stock"
7. Update `src/app/(app)/settings/page.tsx`:
   - Server Component: fetch user metadata for current values
   - Render all settings sections: Profile Management (from Task 8), Change Username, Change Password, Timezone, Notification Email
   - Each section in a card with clear heading

**Files to create:**

- `src/actions/settings.ts`
- `src/lib/validators/settings.ts`
- `src/components/settings/change-username-form.tsx`
- `src/components/settings/change-password-form.tsx`
- `src/components/settings/timezone-form.tsx`
- `src/components/settings/notification-email-form.tsx`
- Update `src/app/(app)/settings/page.tsx`

**Depends on:** Task 8 (settings page exists with profile management), Task 4 (admin client)

**Acceptance criteria:**

- [ ] Username change updates the login credential (can log in with new username)
- [ ] Username uniqueness is enforced (error if taken)
- [ ] Password change requires correct current password
- [ ] Password validates minimum 8 chars and matching confirmation
- [ ] Timezone dropdown shows IANA timezones and persists selection
- [ ] Notification email can be set, updated, or cleared
- [ ] Each form shows success/error feedback
- [ ] All forms validate with Zod

**Recommended skills:** `react-hook-form`, `supabase-automation`, `nextjs-best-practices`, `react-best-practices`, `context7-auto-research`

---

### Task 19 — Implement Low Stock Email Digest via Resend

**Description:**
Implement the daily low-stock email digest sent via Resend to users who have configured a notification email.

**What to do (step by step):**

1. Create `src/lib/email/send.ts`:
   - Import `Resend` from `resend`
   - Export `resend = new Resend(process.env.RESEND_API_KEY)`
   - Export `sendEmail(to: string, subject: string, html: string)` wrapper
2. Create `src/lib/email/templates/low-stock-digest.tsx`:
   - Function `renderLowStockDigest(data: { username: string; profiles: Array<{ name: string; medications: Array<{ name: string; quantity: number; unit: string; runOutDate: string | null }> }> }): string`
   - Returns HTML string (not React component — plain HTML for email)
   - Template: greeting, then for each profile with low-stock meds: profile name heading, table of medications (name, current quantity, estimated run-out date), app link at bottom
   - Simple, clean email styling (inline CSS for email compatibility)
3. Create `src/app/api/email/daily-digest/route.ts`:
   - POST handler protected by `Authorization: Bearer ${CRON_SECRET}` header check
   - Uses admin Supabase client to fetch all users from `auth.users` where `raw_user_meta_data->>'notification_email'` is not null
   - For each user:
     - Get their timezone and notification email from metadata
     - Fetch all profiles and medications
     - Filter medications at or below their `lowStockThreshold`
     - Calculate run-out dates using forecast utilities
     - If any low-stock medications found across any profile, send digest email
     - If none are low, skip (no email sent)
   - Return `{ sent: number, skipped: number }` response
   - Handle Resend API errors gracefully (log and continue)
4. Add `CRON_SECRET` to `.env.example`

**Files to create:**

- `src/app/api/email/daily-digest/route.ts`
- `src/lib/email/templates/low-stock-digest.tsx`
- `src/lib/email/send.ts`

**Depends on:** Task 12 (forecast utilities), Task 18 (notification_email in user metadata)

**Acceptance criteria:**

- [ ] POST to `/api/email/daily-digest` with correct Authorization header triggers the digest
- [ ] Users with low-stock meds and a notification_email receive an email
- [ ] Users with no low-stock meds receive no email
- [ ] Users with no notification_email are skipped
- [ ] Email includes medications grouped by profile with name, quantity, and run-out date
- [ ] Request without correct Authorization header returns 401
- [ ] Resend API failure doesn't crash the handler
- [ ] Returns count of emails sent/skipped

**Recommended skills:** `nextjs-best-practices`, `api-design-principles`, `typescript-expert`, `context7-auto-research`

---

## Phase 9: Polish, Testing, and Integration

### Task 20 — Add Comprehensive Form Validation and Error Handling

**Description:**
Audit and harden all forms and Server Actions with typed results, server-side validation, toast notifications, and error boundaries.

**What to do (step by step):**

1. Create `src/lib/types/actions.ts`:
   - `type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string }`
2. Create `src/lib/utils/error.ts`:
   - `handleSupabaseError(error: unknown): string` — maps Supabase error codes to user-friendly messages:
     - `23505` (unique violation) → "This name is already taken"
     - `42501` (RLS violation) → "You don't have permission to do that"
     - `PGRST116` (not found) → "Item not found"
     - Default → "Something went wrong. Please try again."
3. Create `src/stores/notification-store.ts` (Zustand):
   - State: `notifications: Array<{ id: string; type: 'success' | 'error'; message: string }>`
   - Actions: `addNotification(type, message)` (auto-generates ID, auto-removes after 5 seconds), `removeNotification(id)`
4. Create `src/components/ui/toast.tsx`:
   - Reads from notification store
   - Renders toast messages in bottom-right corner
   - Green for success, red for error
   - Auto-dismiss after 5 seconds with fade-out
   - `aria-live="polite"` for screen readers
   - Include in root layout so it's always visible
5. Update ALL Server Actions in `src/actions/`:
   - Add server-side Zod validation (parse incoming data with same schemas)
   - Return `ActionResult<T>` typed responses
   - Use `handleSupabaseError` for error mapping
6. Create `src/app/(app)/error.tsx` and `src/app/error.tsx`:
   - Client Components (error boundaries must be Client Components)
   - Show user-friendly error message
   - "Try again" button that calls `reset()`
   - "Go to dashboard" link as fallback

**Files to create:**

- `src/lib/types/actions.ts`
- `src/lib/utils/error.ts`
- `src/stores/notification-store.ts`
- `src/components/ui/toast.tsx`
- `src/app/(app)/error.tsx`
- `src/app/error.tsx`
- Update all files in `src/actions/` (add server-side validation, typed returns)

**Depends on:** All previous tasks (actions and forms exist)

**Acceptance criteria:**

- [ ] All Server Actions validate input with Zod before processing
- [ ] All Server Actions return `ActionResult<T>` typed responses
- [ ] Toast notifications appear for success and error states across all forms
- [ ] Error boundaries catch unexpected errors with recovery UI
- [ ] Supabase errors are mapped to user-friendly messages
- [ ] Server-side validation prevents invalid data even if client validation is bypassed

**Recommended skills:** `typescript-expert`, `react-best-practices`, `api-design-principles`, `context7-auto-research`

---

### Task 21 — Write Integration Tests for Key Business Flows

**Description:**
Write additional unit and integration tests covering edge cases in core business logic and utilities.

**What to do (step by step):**

1. Extend `src/__tests__/utils/deduction.test.ts`:
   - Backfill with no scheduled days between last deduction and today → empty array
   - Medication added today (lastDeductionDate = today) → no backfill
   - Very long gap (30+ days) → correct number of entries
   - Back-fill with quantity that runs out mid-way → entries stop after 0
2. Extend `src/__tests__/utils/forecast.test.ts`:
   - `quantity = 0` → returns null/0
   - `quantity = 0.5` with `dosageAmount = 1` → runs out immediately
   - Medication scheduled every day vs. only Sunday
   - Very large quantity (1000 pills) → correct far-future date
3. Create `src/__tests__/utils/export.test.ts`:
   - CSV escaping: notes with commas → wrapped in quotes
   - CSV escaping: notes with quotes → double-escaped
   - CSV with no medications → headers-only output
   - Schedule days formatted with semicolons
4. Create `src/__tests__/actions/medications.test.ts`:
   - Test `adjustQuantity` logic with mocked Supabase client
   - Test that manual adjustments create correct deduction_log entries
   - Test profile limit enforcement (mock attempting 6th profile)

**Files to create/extend:**

- `src/__tests__/utils/deduction.test.ts` (extend)
- `src/__tests__/utils/forecast.test.ts` (extend)
- `src/__tests__/utils/export.test.ts` (new)
- `src/__tests__/actions/medications.test.ts` (new)

**Depends on:** Task 12 (utility functions), Task 17 (export utilities), Task 20 (typed action results)

**Acceptance criteria:**

- [ ] All edge cases listed above have passing test cases
- [ ] Backfill with 0 applicable days returns empty array
- [ ] Forecast with 0 quantity returns null/0
- [ ] CSV export escapes special characters correctly
- [ ] Test suite runs green with `npm run test`
- [ ] Minimum 80% code coverage on `src/lib/utils/` files

**Recommended skills:** `typescript-expert`

---

### Task 22 — Responsive UI Polish and Accessibility Pass

**Description:**
Final responsive design and accessibility audit across all pages.

**What to do (step by step):**

1. Audit every page at 375px (mobile), 768px (tablet), and 1440px (desktop):
   - Fix layout breaks, overflow, or content clipping
   - Ensure minimum 44×44px tap targets on all buttons and interactive elements
   - Test horizontal scroll — none should exist
2. Accessibility attributes:
   - All interactive elements: proper `aria-label`, `role`, and keyboard navigation
   - Form fields: visible `<label>` elements (not just placeholder text)
   - Modals: `role="dialog"`, `aria-modal="true"`, focus trap, close on Escape
   - Profile selector dropdown: `role="listbox"` or proper combobox pattern
3. Color contrast:
   - Verify WCAG 2.1 AA compliance (4.5:1 for text, 3:1 for UI elements)
   - Low-stock amber and out-of-stock red must have sufficient contrast
   - Ensure badges/indicators are not color-only (add icons or text labels)
4. Screen reader support:
   - `aria-live="polite"` on toast notifications (done in Task 20)
   - Loading states announced: `aria-busy="true"` on loading containers
   - Skip-to-main-content link at top of page
5. Page metadata:
   - Add `metadata` exports to every page for proper `<title>` tags:
     - Login: "Login — MedTrack"
     - Dashboard: "Dashboard — MedTrack"
     - Medications: "Medications — MedTrack"
     - Schedule: "Schedule — MedTrack"
     - Settings: "Settings — MedTrack"
   - Root layout: default metadata with app name and description
6. Test medication form on mobile:
   - Dropdowns, multi-selects, and time pickers must be usable on touch
   - Form should not overflow the viewport

**Files to modify:**

- All page files in `src/app/` (add metadata exports)
- All component files (accessibility attributes as needed)
- `src/app/layout.tsx` (skip-to-main link, global metadata)
- Various components for responsive fixes

**Depends on:** All UI tasks (Tasks 5, 7-11, 15-18)

**Acceptance criteria:**

- [ ] All pages render correctly at 375px, 768px, and 1440px without horizontal scroll
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Escape for modals)
- [ ] Color contrast passes WCAG 2.1 AA
- [ ] Toast notifications announced by screen readers
- [ ] Every page has a descriptive `<title>`
- [ ] Skip-to-main-content link exists and works
- [ ] All form inputs have visible labels
- [ ] Tap targets are at least 44×44px on mobile

**Recommended skills:** `tailwind-patterns`, `react-best-practices`, `accessibility-compliance-accessibility-audit`, `context7-auto-research`

---

## Phase Summary

| Phase                            | Tasks       | Description                                             |
| -------------------------------- | ----------- | ------------------------------------------------------- |
| Phase 1: Project Setup & DB      | Tasks 1–4   | Scaffolding, schema, RLS, Supabase clients              |
| Phase 2: Auth & Seeding          | Tasks 5–6   | Login page, admin CLI                                   |
| Phase 3: App Shell & Profiles    | Tasks 7–8   | Layout, nav, profile CRUD                               |
| Phase 4: Medication CRUD & Logic | Tasks 9–13  | List, forms, detail, deduction/forecast utils, backfill |
| Phase 5: pg_cron                 | Task 14     | Automatic daily deduction                               |
| Phase 6: Dashboard               | Task 15     | Main dashboard page                                     |
| Phase 7: Schedule & Export       | Tasks 16–17 | Weekly view, PDF/CSV export                             |
| Phase 8: Settings & Email        | Tasks 18–19 | Account settings, Resend digest                         |
| Phase 9: Polish & Testing        | Tasks 20–22 | Error handling, tests, a11y                             |

**Total: 22 tasks across 9 phases.**
