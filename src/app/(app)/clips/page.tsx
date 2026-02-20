"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClipGenerator from "../../../../components/clips/ClipGenerator";
import GeneratedClips from "../../../../components/clips/GeneratedClips";
import ClipSelectionBar from "../../../../components/clips/ClipSelectionBar";
import ClipHistory from "../../../../components/clips/ClipHistory";
import type { GeneratedClip } from "../../../lib/clips";
import { getFullVideoUrl } from "../../../lib/api"; // Import the helper
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClipsPage() {
  const router = useRouter();
  const [clips, setClips] = useState<GeneratedClip[]>([]);
  const [selectedClips, setSelectedClips] = useState<Set<string>>(new Set());
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleClipsGenerated = (newClips: GeneratedClip[]) => {
    setClips(newClips);
    setSelectedClips(new Set());
    // Trigger history refresh
    setRefreshHistory((prev) => prev + 1);
  };

  const handleSelectClip = (clipId: string, selected: boolean) => {
    setSelectedClips((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(clipId);
      } else {
        next.delete(clipId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedClips(new Set(clips.map((c) => c.clip_id)));
  };

  const handleClearAll = () => {
    setSelectedClips(new Set());
  };

  // Remove this line:
  // const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const selectedClipObjects = clips
    .filter((c) => selectedClips.has(c.clip_id))
    .map((clip) => ({
      id: clip.clip_id,
      videoUrl: getFullVideoUrl(clip.video_url), // Use the helper
      duration: clip.duration,
      reason: clip.reason,
      clip_id: clip.clip_id,
      video_url: clip.video_url,
    }));

  const handlePostSelected = () => {
    if (selectedClipObjects.length === 0) return;
    sessionStorage.setItem(
      "selectedClips",
      JSON.stringify(selectedClipObjects),
    );
    router.push("/posts/create?from=clips&multiple=true");
  };

  const handleSendSingleClip = (clip: GeneratedClip) => {
    const clipData = {
      id: clip.clip_id,
      videoUrl: getFullVideoUrl(clip.video_url), // Use the helper
      duration: clip.duration,
      reason: clip.reason,
      clip_id: clip.clip_id,
      video_url: clip.video_url,
    };
    sessionStorage.setItem("selectedClip", JSON.stringify(clipData));
    router.push("/posts/create?from=clips");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">AI Video Clipping</h1>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate New Clips</TabsTrigger>
          <TabsTrigger value="history">Clip History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <ClipGenerator onClipsGenerated={handleClipsGenerated} />

          {clips.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated Clips</h2>
                {selectedClips.size > 0 && (
                  <div className="text-sm bg-black text-white px-3 py-1 rounded-full">
                    {selectedClips.size} clip
                    {selectedClips.size !== 1 ? "s" : ""} selected
                  </div>
                )}
              </div>

              <GeneratedClips
                clips={clips}
                selectedClips={selectedClips}
                onSelectClip={handleSelectClip}
                onSendSingleClip={handleSendSingleClip}
                showCheckbox={true}
              />

              <ClipSelectionBar
                selectedCount={selectedClips.size}
                totalCount={clips.length}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
                onPostSelected={handlePostSelected}
                selectedClips={selectedClipObjects}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ClipHistory
            onSendClip={handleSendSingleClip}
            refreshTrigger={refreshHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
