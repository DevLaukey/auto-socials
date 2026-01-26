"use client";

import { useState } from "react";
import PlatformSelector from "./PlatformSelector";
import MediaUploader from "./MediaUploader";
import CaptionEditor from "./CaptionEditor";
import SchedulePicker from "./SchedulePicker";
import { Button } from "@/components/ui/button";

export default function CreatePostForm() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [schedule, setSchedule] = useState<string | null>(null);

  function handleSubmit() {
    console.log({ platform, media, caption, schedule });
  }

  return (
    <div className="space-y-6 bg-white border rounded-xl p-6">
      <PlatformSelector value={platform} onChange={setPlatform} />
      <MediaUploader value={media} onChange={setMedia} />
      <CaptionEditor value={caption} onChange={setCaption} />
      <SchedulePicker value={schedule} onChange={setSchedule} />

      <Button
        className="w-full"
        disabled={!platform || !media}
        onClick={handleSubmit}
      >
        Schedule Post
      </Button>
    </div>
  );
}
