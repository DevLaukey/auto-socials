"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Film,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
} from "lucide-react";
import type { ClipJob, GeneratedClip } from "@/src/lib/clips";
import ClipCard from "./ClipCard";
import { formatDistanceToNow } from "date-fns";

interface ClipHistoryItemProps {
  job: ClipJob;
  onDelete: (jobId: number) => void;
  onSendClip: (clip: GeneratedClip) => void;
}

export default function ClipHistoryItem({
  job,
  onDelete,
  onSendClip,
}: ClipHistoryItemProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      case "processing":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "processing") {
      return <Loader2 className="h-3 w-3 animate-spin ml-1" />;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  // Determine if we should show clips
  const showClips = expanded && job.status === "completed";
  const isLoading = expanded && job.status === "processing";
  const noClips =
    expanded && job.clips.length === 0 && job.status === "completed";

  return (
    <div className="border rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <Film className="h-5 w-5 text-gray-400" />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">
                {job.clips.length} clip{job.clips.length !== 1 ? "s" : ""} •{" "}
                {job.clip_length}s each
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(job.status)}`}
              >
                {job.status}
                {getStatusIcon(job.status)}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(job.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.style}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job.id);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="p-4 border-t bg-gray-50">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Generating clips...</p>
              <p className="text-sm">This may take a moment</p>
            </div>
          )}

          {/* No clips state */}
          {noClips && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No clips available</p>
              <p className="text-sm mt-1">
                This job completed but no clips were generated
              </p>
            </div>
          )}

          {/* Clips grid */}
          {showClips && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.clips.map((clip, index) => {
                // Ensure each clip has a unique key - use clip_id if available, otherwise create a fallback
                const uniqueKey =
                  clip.clip_id ||
                  `fallback-${job.id}-${index}-${clip.duration}-${Date.now()}`;

                // Ensure clip has required data structure
                const safeClip: GeneratedClip = {
                  clip_id: clip.clip_id || uniqueKey,
                  video_url: clip.video_url || "",
                  duration: clip.duration || 0,
                  reason: clip.reason || null,
                  created_at: clip.created_at,
                  job_id: clip.job_id,
                };

                return (
                  <ClipCard
                    key={uniqueKey}
                    clip={safeClip}
                    onSendToPosts={() => onSendClip(clip)}
                    showCheckbox={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
