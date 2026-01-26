import { Button } from "@/components/ui/button";

export default function ClipCard({
  clip,
}: {
  clip: { title: string; duration: string };
}) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-2">
      <div className="aspect-video bg-black/80 rounded-md" />

      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{clip.title}</p>
          <p className="text-sm text-muted-foreground">{clip.duration}</p>
        </div>

        <Button size="sm">Send to Posts</Button>
      </div>
    </div>
  );
}
