"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
  post: any;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ScheduleModal({ post, onClose, onUpdated }: Props) {
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduled_time ? post.scheduled_time.slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/posts/${post.id}/reschedule`, {
        scheduled_time: scheduledAt,
      });
      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold">Reschedule Post</h3>

        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
