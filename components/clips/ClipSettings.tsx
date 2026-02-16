type Props = {
  clipLength: number;
  setClipLength: (value: number) => void;
  numberOfClips: number;
  setNumberOfClips: (value: number) => void;
  style?: string;
  setStyle?: (value: string) => void;
};

export default function ClipSettings({
  clipLength,
  setClipLength,
  numberOfClips,
  setNumberOfClips,
  style = "highlight",
  setStyle,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Clip Length */}
      <div>
        <label className="text-sm font-medium">Clip Length (seconds)</label>
        <input
          type="number"
          min={5}
          value={clipLength}
          onChange={(e) => setClipLength(Number(e.target.value))}
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Number of Clips */}
      <div>
        <label className="text-sm font-medium">Number of Clips</label>
        <input
          type="number"
          min={1}
          value={numberOfClips}
          onChange={(e) => setNumberOfClips(Number(e.target.value))}
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Style */}
      <div>
        <label className="text-sm font-medium">Style</label>
        <select
          value={style}
          onChange={(e) => setStyle?.(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        >
          <option value="highlight">Highlight Moments</option>
          <option value="fast">Fast Cuts</option>
          <option value="podcast">Podcast Style</option>
        </select>
      </div>
    </div>
  );
}
