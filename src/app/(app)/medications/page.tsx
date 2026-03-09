import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medications — MedTrack",
};

export default function MedicationsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage your medication inventory.
          </p>
        </div>
        <div className="h-9 w-36 bg-teal-500 rounded-xl opacity-30" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 animate-pulse"
          >
            <div className="h-4 w-1/2 bg-slate-100 rounded-full" />
            <div className="h-3 w-full bg-slate-50 rounded-full" />
            <div className="h-3 w-3/4 bg-slate-50 rounded-full" />
          </div>
        ))}
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-teal-700">
        <strong className="font-semibold">Tasks 9–11</strong> will build the
        full medication list, add/edit forms, and detail pages.
      </div>
    </div>
  );
}
