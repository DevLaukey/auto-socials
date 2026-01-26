"use client";

import { useState } from "react";
import MediaUploader from "../MediaUploader";
import SchedulePicker from "../SchedulePicker";

interface Props {
  platform: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PostMetadataModal({
  platform,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");

  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  // Instagram-only
  const [instagramType, setInstagramType] = useState<"post" | "story" | "reel">(
    "post"
  );
  const [privacy, setPrivacy] = useState<"public" | "private">("public");

  // YouTube-only
  const [youtubePrivacy, setYoutubePrivacy] = useState<
    "public" | "unlisted" | "private"
  >("public");

  const handleSave = () => {
    if (!mediaFile) {
      alert("Please upload media first.");
      return;
    }

    onSave({
      title,
      description,
      hashtags,
      media_file: mediaFile,
      scheduled_time: scheduledDate ? scheduledDate.toISOString() : null,

      instagram_type: platform === "instagram" ? instagramType : undefined,

      privacy_status:
        platform === "youtube"
          ? youtubePrivacy
          : platform === "instagram"
          ? privacy
          : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-semibold capitalize">
            {platform} Post Details
          </h3>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <MediaUploader onUploaded={setMediaFile} />

          <input
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded min-h-[90px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Hashtags"
            className="w-full border p-2 rounded"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />

          {platform === "youtube" && (
            <div>
              <label className="text-sm font-medium block mb-1">Privacy</label>
              <select
                className="w-full border p-2 rounded"
                value={youtubePrivacy}
                onChange={(e) => setYoutubePrivacy(e.target.value as any)}
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>
          )}

          {platform === "instagram" && (
            <div className="border rounded p-3 space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Post Type
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={instagramType}
                  onChange={(e) => setInstagramType(e.target.value as any)}
                >
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Privacy
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          )}

          <SchedulePicker value={scheduledDate} onChange={setScheduledDate} />
        </div>

        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
