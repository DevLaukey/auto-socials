"use client";

interface SchedulePickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
}

export default function SchedulePicker({
  value,
  onChange,
}: SchedulePickerProps) {
  function toInputValue(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  function fromInputValue(value: string): Date {
    return new Date(value);
  }

  return (
    <section className="bg-white border rounded-lg p-3 w-full space-y-2">
      <h2 className="text-sm font-semibold">Schedule</h2>

      {/* Scroll-safe wrapper*/}
      <div className="overflow-x-auto">
        <input
          type="datetime-local"
          className="border rounded-md px-3 py-2 w-full min-w-[260px]"
          value={value ? toInputValue(value) : ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val ? fromInputValue(val) : null);
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Leave empty to post immediately
      </p>
    </section>
  );
}
