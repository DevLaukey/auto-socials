"use client";

import { useState } from "react";
import VideoInput from "./VideoInput";
import ClipSettings from "./ClipSettings";
import { Button } from "@/components/ui/button";

export default function ClipGenerator() {
  const [video, setVideo] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    // API call placeholder
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <VideoInput value={video} onChange={setVideo} />
      <ClipSettings />

      <Button onClick={handleGenerate} disabled={!video || loading}>
        {loading ? "Generating clips..." : "Generate Clips"}
      </Button>
    </div>
  );
}
