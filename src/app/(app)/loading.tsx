export default function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200" />
        <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin absolute inset-0" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          Updating your medication inventory...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Applying any missed deductions
        </p>
      </div>
    </div>
  );
}
