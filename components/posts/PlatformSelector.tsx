const platforms = ["YouTube", "Instagram", "Twitter"];

export default function PlatformSelector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Platform</label>
      <div className="flex gap-3">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => onChange(platform)}
            className={`px-4 py-2 rounded-lg border text-sm ${
              value === platform ? "bg-black text-white" : "bg-white"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}
