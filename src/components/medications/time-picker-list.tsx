"use client";

interface TimePickerListProps {
  value: string[];
  onChange: (times: string[]) => void;
}

export function TimePickerList({ value, onChange }: TimePickerListProps) {
  const addSlot = () => {
    onChange([...value, ""]);
  };

  const removeSlot = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, newTime: string) => {
    const updated = [...value];
    updated[index] = newTime;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {value.map((time, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => updateSlot(index, e.target.value)}
            className="flex h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          />
          <button
            type="button"
            onClick={() => removeSlot(index)}
            className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove time"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSlot}
        className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add time
      </button>
    </div>
  );
}
