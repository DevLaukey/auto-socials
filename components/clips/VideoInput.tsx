export default function VideoInput({
  value,
  onChange,
}: {
  value: File | string | null;
  onChange: (value: File | string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Video Source</label>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onChange(e.target.files[0]);
          }
        }}
      />

      <div className="my-2 text-sm text-muted-foreground">OR</div>

      <input
        type="url"
        placeholder="Paste YouTube URL"
        className="border rounded-md px-3 py-2 w-full"
        onBlur={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
      />

      {value && (
        <p className="text-sm mt-1 text-muted-foreground">Source selected</p>
      )}
    </div>
  );
}
