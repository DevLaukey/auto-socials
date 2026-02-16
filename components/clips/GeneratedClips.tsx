import ClipCard from "./ClipCard";
import type { GeneratedClip } from "@/src/lib/clips";

export default function GeneratedClips({ clips }: { clips: GeneratedClip[] }) {
  if (!clips.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clips.map((clip) => (
        <ClipCard key={clip.clip_id} clip={clip} />
      ))}
    </div>
  );
}
