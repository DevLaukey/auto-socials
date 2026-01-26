import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface CaptionEditorProps {
  title: string;
  description: string;
  hashtags: string;

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onHashtagsChange: (value: string) => void;
}

export default function CaptionEditor({
  title,
  description,
  hashtags,
  onTitleChange,
  onDescriptionChange,
  onHashtagsChange,
}: CaptionEditorProps) {
  return (
    <section className="bg-white border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">Caption</h2>

      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Title (optional)
        </label>
        <Input
          placeholder="Post title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          rows={4}
          placeholder="Write your description..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      {/* HASHTAGS */}
      <div>
        <label className="block text-sm font-medium mb-1">Hashtags</label>
        <Input
          placeholder="#marketing #startup #launch"
          value={hashtags}
          onChange={(e) => onHashtagsChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Separate hashtags with spaces or commas
        </p>
      </div>
    </section>
  );
}
