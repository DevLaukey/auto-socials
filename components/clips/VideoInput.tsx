import { useRef, useState } from "react";

export default function VideoInput({
  value,
  onChange,
}: {
  value: File | string | null;
  onChange: (value: File | string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    setUrlInput("");
    onChange(file);

    // Reset input so selecting same file again works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    if (url.trim().length > 0) {
      onChange(url);
    } else {
      onChange(null);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUrlInput("");
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Video Source</label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
      />

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all
          ${
            value
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-black bg-gray-50 hover:bg-gray-100"
          }`}
      >
        {!value && (
          <>
            <p className="text-sm font-medium">Click to upload video</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI</p>
          </>
        )}

        {value && (
          <div className="flex items-center justify-between">
            <span className="truncate font-medium text-sm">
              {value instanceof File ? value.name : value}
            </span>

            <button
              type="button"
              onClick={clearSelection}
              className="text-red-500 hover:underline text-sm ml-4"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground">OR</div>

      {/* URL Input */}
      <input
        type="url"
        placeholder="Paste YouTube or video URL"
        value={urlInput}
        onChange={(e) => handleUrlChange(e.target.value)}
        className="border rounded-md px-3 py-2 w-full"
      />
    </div>
  );
}
