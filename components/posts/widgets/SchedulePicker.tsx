"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SchedulePicker({
  onSelect,
}: {
  onSelect: (date: Date) => void;
}) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  function incrementHour() {
    setHour((h) => (h + 1) % 24);
  }

  function decrementHour() {
    setHour((h) => (h + 23) % 24);
  }

  function incrementMinute() {
    setMinute((m) => (m + 5) % 60);
  }

  function decrementMinute() {
    setMinute((m) => (m + 55) % 60);
  }

  function schedule() {
    const date = new Date();
    date.setHours(hour, minute);
    onSelect(date);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Button size="sm" onClick={incrementHour}>
          ▲
        </Button>
        <div>{hour.toString().padStart(2, "0")}</div>
        <Button size="sm" onClick={decrementHour}>
          ▼
        </Button>
      </div>

      <div className="text-center">
        <Button size="sm" onClick={incrementMinute}>
          ▲
        </Button>
        <div>{minute.toString().padStart(2, "0")}</div>
        <Button size="sm" onClick={decrementMinute}>
          ▼
        </Button>
      </div>

      <Button onClick={schedule}>Schedule</Button>
    </div>
  );
}
