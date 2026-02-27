"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, History } from "lucide-react";
import {
  getAllClipJobs,
  deleteClipJob,
  ClipJob,
  GeneratedClip,
} from "@/src/lib/clips";
import ClipHistoryItem from "./ClipHistoryItem";
import { useRouter } from "next/navigation";

interface ClipHistoryProps {
  onSendClip: (clip: GeneratedClip) => void;
  refreshTrigger: number;
}

export default function ClipHistory({
  onSendClip,
  refreshTrigger,
}: ClipHistoryProps) {
  const [jobs, setJobs] = useState<ClipJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllClipJobs();
      const sorted = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setJobs(sorted);
    } catch (err: any) {
      setError(err.message || "Failed to load clip history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const handleDelete = async (jobId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this clip job and all its clips?",
      )
    ) {
      return;
    }

    try {
      await deleteClipJob(jobId);
      await loadHistory();
    } catch (err: any) {
      alert(err.message || "Failed to delete clip job");
    }
  };

  const handleSendClip = (clip: GeneratedClip) => {
    const clipData = {
      id: clip.clip_id,
      mediaPath: clip.video_url,
      duration: clip.duration,
      reason: clip.reason,
      clip_id: clip.clip_id,
      video_url: clip.video_url,
    };

    sessionStorage.setItem("selectedClip", JSON.stringify(clipData));
    router.push("/posts/create?from=clips");
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading clip history...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Clip History</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadHistory}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground">
          <p>No clip history yet</p>
          <p className="text-sm mt-1">
            Generate your first clip to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <ClipHistoryItem
              key={job.id}
              job={job}
              onDelete={handleDelete}
              onSendClip={handleSendClip}
            />
          ))}
        </div>
      )}
    </div>
  );
}