"use client";

import { useState } from "react";
import ClipGenerator from "../../../../components/clips/ClipGenerator";
import GeneratedClips from "../../../../components/clips/GeneratedClips";
import type { GeneratedClip } from "../../../lib/clips";

export default function ClipsPage() {
  const [clips, setClips] = useState<GeneratedClip[]>([]);

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-semibold">AI Video Clipping</h1>

      <ClipGenerator onClipsGenerated={setClips} />

      {/* Only render if clips exist */}
      {clips.length > 0 && <GeneratedClips clips={clips} />}
    </div>
  );
}
