import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { GeneratedClip } from "@/src/lib/clips";
import { getFullVideoUrl } from "@/src/lib/api";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ClipCard({
  clip,
  selected = false,
  onSelect,
  onSendToPosts,
  showCheckbox = false,
}: {
  clip: GeneratedClip;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onSendToPosts?: () => void;
  showCheckbox?: boolean;
}) {
  // Use the centralized helper
  const videoUrl = clip.video_url ? getFullVideoUrl(clip.video_url) : "";

  return (
    <div
      className={`border rounded-xl p-4 bg-white space-y-3 transition-all ${
        selected ? "ring-2 ring-black" : ""
      }`}
    >
      {showCheckbox && (
        <div className="flex items-center gap-2 pb-2 border-b">
          <Checkbox
            id={`select-${clip.clip_id}`}
            checked={selected}
            onCheckedChange={onSelect}
          />
          <label
            htmlFor={`select-${clip.clip_id}`}
            className="text-sm font-medium cursor-pointer"
          >
            Select this clip
          </label>
        </div>
      )}

      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="aspect-video rounded-md w-full bg-black"
        />
      ) : (
        <div className="aspect-video rounded-md w-full bg-gray-100 flex items-center justify-center text-gray-400">
          Video unavailable
        </div>
      )}

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

        <Button size="sm" onClick={onSendToPosts}>
          Send to Posts
        </Button>
      </div>
    </div>
  );
}
