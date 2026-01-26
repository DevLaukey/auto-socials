"use client";

import { useState } from "react";
import PlatformSelector from "./PlatformSelector";
import MediaUploader from "./MediaUploader";
import CaptionEditor from "./CaptionEditor";
import SchedulePicker from "./SchedulePicker";
import { Button } from "@/components/ui/button";

export default function CreatePostForm() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [mediaPath, setMediaPath] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [schedule, setSchedule] = useState<Date | null>(null);

  function handleSubmit() {
    console.log({ platform, mediaPath, title, description, hashtags, schedule });
  }

  return (
    <div className="space-y-6 bg-white border rounded-xl p-6">
      <PlatformSelector value={platform} onChange={setPlatform} />
      <MediaUploader onUploaded={setMediaPath} />
      <CaptionEditor
        title={title}
        description={description}
        hashtags={hashtags}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onHashtagsChange={setHashtags}
      />
      <SchedulePicker value={schedule} onChange={setSchedule} />

      <Button
        className="w-full"
        disabled={!platform || !mediaPath}
        onClick={handleSubmit}
      >
        Schedule Post
      </Button>
    </div>
  );
}
