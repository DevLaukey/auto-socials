"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
  onUploaded: (path: string) => void;
}

export default function MediaUploader({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFileName(file.name);
      onUploaded(res.data.path);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Media upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <div className="w-full border rounded p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <p className="text-sm text-gray-600">
            {uploading ? "Uploading media..." : "Select Media:"}
          </p>
        </div>

        <input
          type="file"
          accept="video/*,image/*"
          disabled={uploading}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </label>

      {/* Selected media display */}
      {fileName && (
        <div className="text-sm text-gray-700">
          <span className="font-medium">Media:</span> {fileName}
        </div>
      )}
    </div>
  );
}
