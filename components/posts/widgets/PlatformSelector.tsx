"use client";

type Platform = "instagram" | "youtube" | "twitter";

interface Props {
  onChange: (platform: Platform) => void;
}

const PLATFORMS: Platform[] = ["instagram", "youtube", "twitter"];

export default function PlatformSelector({ onChange }: Props) {
  return (
    <div className="flex gap-3">
      {PLATFORMS.map((platform) => (
        <button
          key={platform}
          onClick={() => onChange(platform)}
          className="px-4 py-2 border rounded capitalize hover:bg-gray-100"
        >
          {platform}
        </button>
      ))}
    </div>
  );
}
