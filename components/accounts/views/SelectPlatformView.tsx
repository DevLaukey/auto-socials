import { Button } from "@/components/ui/button";
import { SocialAccount } from "@/lib/types";

const platforms: SocialAccount["platform"][] = [
  "YouTube",
  "Instagram",
  "Twitter/X",
];

export default function SelectPlatformView({
  onSelect,
  onBack,
}: {
  onSelect: (platform: SocialAccount["platform"]) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack}>
        ← Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="border rounded-xl p-6 text-left hover:bg-slate-50"
          >
            <h3 className="font-semibold">{p}</h3>
            <p className="text-sm text-muted-foreground">
              Connect a {p} account
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
