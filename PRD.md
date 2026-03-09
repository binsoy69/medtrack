# Product Requirements Document (PRD)
## MedTrack — Personal Medication Inventory Web App

**Version:** 1.4  
**Date:** March 8, 2026  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary
MedTrack is a responsive web application for personal and family medication inventory management. Users can track medication quantities, dosages, and schedules across multiple family profiles. The app automatically deducts daily medication quantities based on each medication's schedule, back-fills missed deductions when the user logs back in, forecasts the estimated run-out date per medication, and alerts users via in-app indicators and optional daily email digests when stock runs low.

### 1.2 Problem Statement
Individuals and caregivers managing medications for multiple family members often lose track of remaining quantities, dosages, and schedules — leading to missed doses or last-minute pharmacy runs. Manually updating stock every day is tedious and error-prone. There is no simple, unified web tool that automatically keeps inventory current and proactively warns caregivers before a medication runs out.

### 1.3 Goals
- Automatically deduct medication quantities daily based on each medication's defined schedule and dosage, in the user's local timezone.
- Back-fill deductions for any days missed since the user last accessed the app.
- Forecast the estimated date each medication will run out of stock.
- Alert users when a medication falls below its individually configured low-stock threshold.
- Allow users to export medication schedules for reference outside the app.
- Be simple enough for non-technical users to use daily on any device via a browser.

### 1.4 Non-Goals (v1.0)
- Native mobile app (iOS/Android) — web browser only.
- Offline support — requires an active internet connection.
- Self-registration — access is by seeded accounts only.
- Medication dose reminders or push notifications.
- Prescription refill tracking or pharmacy integration.
- Barcode/QR scanning for medication entry.
- Medical advice, drug interaction checks, or clinical features.
- "As needed" / PRN medication support — all medications are assumed to be taken on a fixed daily schedule.

---

## 2. Target Users

### Primary Persona — The Home Caregiver
- An individual managing medications for themselves and/or family members (e.g. children, elderly parents).
- Needs a quick, reliable way to check stock levels, dosages, schedules, and how many days remain before a medication runs out.
- Accesses the app from a desktop browser at home or a mobile browser on the go.
- Not necessarily tech-savvy; values simplicity and clarity.

---

## 3. Platform & Device Support

| Platform        | Support Level | Notes                                      |
|-----------------|---------------|--------------------------------------------|
| Desktop browser | Full support  | Primary layout optimized for wide screens  |
| Mobile browser  | Full support  | Responsive, touch-friendly UI              |
| Tablet browser  | Full support  | Adaptive layout between mobile and desktop |
| Native iOS app  | Not in scope  | Web browser only                           |
| Native Android  | Not in scope  | Web browser only                           |

The app is a **web-only** product. No native mobile app will be built. The web UI must be fully usable on mobile and tablet screen sizes via a responsive layout.

---

## 4. Features & Requirements

### 4.1 User Accounts & Profiles

#### Authentication
- Access is restricted to **pre-seeded accounts only** — there is no public registration.
- Users log in with a **username and password**.
- No email address is required for authentication.
- Users can **change their username and password** from account settings.
- A **default profile** (named after the username) is automatically seeded alongside each account.
- Session persistence via secure JWT tokens.

#### Account Seeding
- Accounts are created via a **simple admin CLI script** (e.g. `npm run create-user -- --username jane --password temp1234 --timezone Asia/Manila`).
- Each seeded account comes with a default profile and a temporary password the user should change on first login.
- No web-based admin UI is required in v1.0.

#### Family Profiles
- One account can manage up to **5 profiles** (e.g. "Mom", "Dad", "Jake").
- Each profile has its own independent medication inventory.
- Users can **add**, **rename**, and **delete** profiles.
- The default profile can be renamed but not deleted if it is the only remaining profile.
- The "Add Profile" action is disabled once the account reaches the 5-profile limit.

---

### 4.2 Medication Inventory

#### Medication Entry (Manual Form)
Each medication entry includes:

| Field               | Type                | Required | Notes                                            |
|---------------------|---------------------|----------|--------------------------------------------------|
| Medication Name     | Text                | Yes      | e.g. "Amoxicillin 500mg"                         |
| Current Quantity    | Number              | Yes      | Stock on hand at time of entry or last update    |
| Unit Type           | Dropdown            | Yes      | Pills, capsules, mL, mg, patches, etc.           |
| Dosage Amount       | Number              | Yes      | Amount taken per dose (e.g. 1, 2, 5)             |
| Dosage Unit         | Dropdown            | Yes      | Matches unit type (e.g. pills, mL)               |
| Frequency           | Dropdown            | Yes      | Once daily, twice daily, three times daily       |
| Schedule Days       | Multi-select        | Yes      | Days of the week the medication is taken         |
| Time(s) of Day      | Time picker (multi) | No       | e.g. 8:00 AM, 8:00 PM                            |
| Low Stock Threshold | Number              | Yes      | Per-medication; alert triggers at or below this  |
| Notes               | Text                | No       | Free-form (e.g. "take with food")                |

#### Inventory Actions
- **Add** a new medication to a profile.
- **Edit** any field of an existing medication entry.
- **Delete** a medication entry (with confirmation prompt).
- **Manually update quantity** via a dedicated "+/-" inline control — for cases such as restocking after a pharmacy pickup. Manual updates are logged separately.
- **View all medications** in a profile as a list/card view, sorted alphabetically by default.

---

### 4.3 Automatic Daily Deduction

- Each day, the app automatically deducts the appropriate quantity from each medication based on its **dosage amount × frequency × scheduled days**.
- Deductions are calculated in the **user's configured timezone** to ensure midnight rollover happens at the correct local time.
- Deduction runs once per day via a **scheduled background job** (Supabase pg_cron).
- Deduction only occurs on the days specified in the medication's schedule (e.g. a medication scheduled Mon–Fri is not deducted on weekends).
- If a medication's quantity reaches **0**, it is flagged as **Out of Stock** and no further deduction occurs.
- Manual quantity updates (e.g. after a refill) override the current quantity and deduction resumes from the new value.

#### Daily Deduction Formula
```
Daily Deduction = Dosage Amount × Times Per Day (derived from Frequency)

Examples:
  - 1 pill,  once daily       → deduct 1  per scheduled day
  - 2 pills, twice daily      → deduct 4  per scheduled day
  - 5 mL,   three times daily → deduct 15 mL per scheduled day
```

#### Back-fill for Missed Days
- When a user logs in, the system checks the **last deduction date** for each medication against today's date (in the user's timezone).
- If one or more scheduled days have passed without a deduction, the system automatically **back-fills all missing deductions** in chronological order before displaying inventory data.
- Back-fill respects the medication's scheduled days — only days the medication was supposed to be taken are counted and deducted.
- Each back-filled deduction is recorded individually in the Deduction Log with the correct historical date and a `'auto-backfill'` type label.
- If back-filling would reduce quantity below 0, the quantity is capped at 0 and the medication is flagged as Out of Stock from the date stock was exhausted.

**Example:**
```
User away for 3 days (Mon, Tue, Wed). Medication scheduled Mon–Fri, 2 pills/day.
On login (Thursday):
  → Back-fill Mon: deduct 2 pills (logged: Monday's date, auto-backfill)
  → Back-fill Tue: deduct 2 pills (logged: Tuesday's date, auto-backfill)
  → Back-fill Wed: deduct 2 pills (logged: Wednesday's date, auto-backfill)
  → Today's deduction (Thu) runs as normal via cron
```

---

### 4.4 Deduction Log (User-Visible)

- Every medication has a **Deduction Log** accessible from its detail view.
- The log provides a full, chronological history of all quantity changes for that medication.
- Users can see exactly how their stock has been consumed over time.

#### Log Entry Fields

| Field            | Description                                                          |
|------------------|----------------------------------------------------------------------|
| Date             | The calendar date the deduction or change occurred (user's timezone) |
| Type             | `Auto deduction`, `Auto back-fill`, or `Manual update`               |
| Amount           | Quantity deducted or added (negative for deductions, positive for restocks) |
| Quantity After   | Remaining stock after this entry                                     |

#### Log Display Rules
- Entries are shown in **reverse chronological order** (most recent first).
- Manual updates (restocks) are visually distinct from automatic deductions (e.g. different color or icon).
- Back-fill entries are grouped or labeled clearly so the user understands why multiple past dates appear at once.
- The log is **read-only** — users cannot edit or delete log entries.
- Pagination or infinite scroll is used if the log exceeds 30 entries.

---

### 4.5 Stock Forecast (Run-Out Date)

- Each medication displays an **estimated run-out date** — the projected date the stock will reach 0, based on current quantity and daily deduction rate.
- The forecast is recalculated in real time whenever the quantity or schedule changes.
- The forecast accounts for **scheduled days only**.

#### Forecast Formula
```
Remaining Scheduled Days = Current Quantity ÷ Daily Deduction Amount
Run-Out Date             = Today + Remaining Scheduled Days
                           (counting only days the medication is scheduled)
```

#### Forecast Display

| Location              | Display                                                                |
|-----------------------|------------------------------------------------------------------------|
| Medication list/cards | "Runs out: Mar 22" or "~14 days remaining"                             |
| Medication detail     | Full forecast date with breakdown (e.g. "14 days at 2 pills/day")     |
| Dashboard             | Soonest run-out highlighted per profile, sorted by urgency             |

- Medications with **≤ 7 scheduled days remaining** are visually flagged (amber warning).
- Medications that are **Out of Stock** are flagged in red.

---

### 4.6 Medication Schedule View

- A dedicated **Schedule** page or tab shows all medications for the selected profile, organized by day of the week.
- Each entry displays: medication name, dosage amount + unit, and time(s) of day.
- The schedule is **read-only** — changes are made by editing the medication entry.
- The **current day is highlighted** for quick reference.

---

### 4.7 Schedule Export

Users can export the medication schedule for a selected profile to take or share outside the app.

#### Export Formats

| Format | Notes                                                               |
|--------|---------------------------------------------------------------------|
| PDF    | Printable weekly schedule, formatted with profile name and date     |
| CSV    | Tabular data: Medication, Dosage, Unit, Days, Times, Notes          |

#### Export Scope
- Export is **per profile**.
- Includes: medication name, dosage, unit, frequency, schedule days, times of day, and notes.
- Stock quantity, thresholds, and run-out forecasts are **excluded** from the export (schedule-only).
- Export is triggered from a button on the Schedule page.

---

### 4.8 Low Stock Alerts

- Each medication has its own **individual low stock threshold**, set during entry or editing.
- Default threshold is pre-filled as **7** when adding a new medication (editable).
- An alert is triggered when a medication's quantity falls at or below its threshold — whether from automatic deduction, back-fill, or a manual update.

#### In-App Alert Display

| Location               | Behavior                                                              |
|------------------------|-----------------------------------------------------------------------|
| Dashboard summary      | Count of medications currently low in stock, highlighted prominently  |
| Medication list/cards  | Low-stock items flagged with a visual indicator (e.g. red badge/icon) |
| Medication detail/edit | Inline warning when quantity is at or below threshold                 |

- Alerts auto-resolve visually when quantity is updated above the threshold.

#### Email Notifications (Optional — Daily Digest)
- Users can configure a **notification email address** in Settings — entirely separate from login credentials.
- Once set, a **daily digest email** is sent each morning (in the user's timezone) summarizing all medications across all profiles that are currently at or below their threshold.
- The digest includes each low-stock medication's **estimated run-out date**.
- Digest emails are only sent on days where at least one medication is low in stock — no email is sent if all medications are sufficiently stocked.
- Email is delivered via **Resend** (free tier: 3,000 emails/month).
- Users can **opt out** at any time by clearing the notification email in Settings.

---

### 4.9 Dashboard

The main screen provides an at-a-glance summary:
- **Profile selector** — switch between family profiles (up to 5).
- **Low stock & run-out summary** — medications currently below threshold or running out soon, sorted by urgency (soonest run-out first).
- **Today's schedule** — snapshot of medications scheduled for today in the active profile.
- **Full medication list** — all medications with current quantity, dosage, run-out forecast, and low-stock indicator.
- **Quick quantity update** — "+/-" control accessible directly from the list without navigating away.

---

### 4.10 Account Settings

| Setting             | Description                                                           |
|---------------------|-----------------------------------------------------------------------|
| Change username     | Update display/login username                                         |
| Change password     | Requires current password confirmation                                |
| Timezone            | User's local timezone; used for deduction scheduling and back-fill    |
| Notification email  | Optional email for low-stock daily digest; can be cleared at any time |
| Manage profiles     | Add (up to 5), rename, or delete family profiles                      |

---

## 5. Suggested Future Features (v1.1+)

| Feature                       | Description                                                             |
|-------------------------------|-------------------------------------------------------------------------|
| Medication dose reminders     | In-app or push notifications at scheduled medication times              |
| Expiry date tracking          | Track and alert on approaching expiry dates                             |
| Barcode/QR scanning           | Scan packaging to auto-fill medication name and dosage                  |
| CSV medication import         | Bulk-import medications from a CSV file                                 |
| Dark mode                     | System-aware dark/light theme                                           |
| Shared account access         | Invite another user (e.g. spouse) to co-manage an account              |
| Admin web UI                  | Browser-based interface for creating and managing seeded accounts       |
| Missed dose tracking          | Manually mark a dose as skipped; adjust deduction accordingly           |
| Forecast graph                | Visual chart showing projected stock levels over time per medication    |

---

## 6. Recommended Tech Stack

### 6.1 Frontend
| Layer      | Technology              | Rationale                                               |
|------------|-------------------------|---------------------------------------------------------|
| Framework  | **Next.js** (React)     | File-based routing, SSR, large ecosystem                |
| Styling    | **Tailwind CSS**        | Rapid responsive UI; mobile-friendly by default         |
| State Mgmt | **Zustand**             | Lightweight, minimal boilerplate                        |
| Forms      | **React Hook Form**     | Clean form management with validation                   |
| PDF Export | **jsPDF** / **react-pdf** | Client-side PDF generation for schedule export        |

### 6.2 Backend & Infrastructure
| Layer         | Technology              | Rationale                                                              |
|---------------|-------------------------|------------------------------------------------------------------------|
| Backend/Auth  | **Supabase**            | Managed Postgres + auth + REST API + pg_cron; minimal DevOps           |
| Cron Jobs     | **Supabase pg_cron**    | Scheduled daily deduction job; runs per-user timezone offsets          |
| Email         | **Resend**              | Simple API, Next.js-native, 3,000 free emails/month                   |
| Hosting       | **Vercel**              | Zero-config Next.js deployment; fast global CDN                        |
| Admin CLI     | **Node.js script**      | `npm run create-user` to seed accounts with timezone via Supabase API  |

> **No offline storage layer needed.** All data reads and writes go directly to Supabase over HTTPS. The app requires an active internet connection.

---

## 7. Data Model (High-Level)

```
User
  └── id, username, passwordHash, timezone, notificationEmail (nullable), createdAt

Profile
  └── id, userId (FK), name, createdAt
  └── Constraint: max 5 profiles per userId

Medication
  └── id, profileId (FK), name, quantity, unitType,
      dosageAmount, dosageUnit, frequency,
      scheduleDays (array), scheduleTimes (array),
      lowStockThreshold, lastDeductionDate, notes,
      createdAt, updatedAt

DeductionLog
  └── id, medicationId (FK), deductionDate, amountDeducted, quantityAfter,
      type (enum: 'auto' | 'auto-backfill' | 'manual'), createdAt
```

---

## 8. Non-Functional Requirements

| Category          | Requirement                                                                          |
|-------------------|--------------------------------------------------------------------------------------|
| Performance       | Initial page load < 2s on a standard broadband connection                            |
| Availability      | 99.9% uptime target (leveraging Supabase + Vercel SLAs)                              |
| Security          | Passwords hashed (bcrypt); all traffic over HTTPS; JWT session tokens; notification email never used for login |
| Privacy           | No medication data shared with third parties; notification email optional and deletable |
| Accessibility     | WCAG 2.1 AA compliance; sufficient color contrast for low-stock and forecast indicators |
| Scalability       | Supports up to 5 profiles and 200 medications per account in v1.0                    |
| Responsiveness    | Fully usable on screen widths from 375px (mobile) to 1440px+ (desktop)              |
| Cron Reliability  | Daily deduction job must complete within 5 minutes of midnight in the user's timezone; failures are logged and retried |
| Back-fill Timing  | Back-fill must complete before the user sees inventory data on login; a loading state is shown during processing |

---

## 9. Success Metrics

| Metric                             | Target (3 months post-launch) |
|------------------------------------|-------------------------------|
| Daily Active Users (DAU)           | > 60% of registered users     |
| Avg. medications tracked / profile | ≥ 5                           |
| Low-stock alert visibility rate    | > 80% of triggered alerts seen within 24h |
| Schedule export usage              | > 30% of active users         |
| Deduction log views per session    | > 20% of sessions include a log view |
| User retention (Day 30)            | > 40%                         |

---

*Document version 1.4 — all open questions resolved. Ready for development kickoff review.*
