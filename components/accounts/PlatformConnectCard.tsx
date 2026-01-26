import { Button } from "@/components/ui/button";

export default function PlatformConnectCard({
  platform,
}: {
  platform: {
    name: string;
    description: string;
  };
}) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <p className="font-medium">{platform.name}</p>
      <p className="text-sm text-muted-foreground">{platform.description}</p>

      <Button className="w-full">Connect {platform.name}</Button>
    </div>
  );
}
