import { Button } from "@/components/ui/button";
import type { GeneratedClip } from "@/src/lib/clips";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ClipCard({ clip }: { clip: GeneratedClip }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Ensure no double slashes
  const videoUrl = clip.video_url.startsWith("http")
    ? clip.video_url
    : `${API_BASE}${clip.video_url}`;

  return (
    <div className="border rounded-xl p-4 bg-white space-y-3">
      <video
        src={videoUrl}
        controls
        className="aspect-video rounded-md w-full bg-black"
      />

      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Clip</p>
          <p className="text-sm text-muted-foreground">
            {formatDuration(clip.duration)}
          </p>

          {clip.reason && (
            <p className="text-xs text-muted-foreground mt-1">{clip.reason}</p>
          )}
        </div>

        <Button size="sm">Send to Posts</Button>
      </div>
    </div>
  );
}
