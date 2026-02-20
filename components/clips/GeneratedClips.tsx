import ClipCard from "./ClipCard";
import type { GeneratedClip } from "@/src/lib/clips";

export default function GeneratedClips({
  clips,
  selectedClips = new Set(),
  onSelectClip,
  onSendSingleClip,
  showCheckbox = false,
}: {
  clips: GeneratedClip[];
  selectedClips?: Set<string>;
  onSelectClip?: (clipId: string, selected: boolean) => void;
  onSendSingleClip?: (clip: GeneratedClip) => void;
  showCheckbox?: boolean;
}) {
  if (!clips.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clips.map((clip) => (
        <ClipCard
          key={clip.clip_id}
          clip={clip}
          selected={selectedClips.has(clip.clip_id)}
          onSelect={(selected) => onSelectClip?.(clip.clip_id, selected)}
          onSendToPosts={() => onSendSingleClip?.(clip)}
          showCheckbox={showCheckbox}
        />
      ))}
    </div>
  );
}
