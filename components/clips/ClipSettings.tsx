export default function ClipSettings() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium">Clip Length</label>
        <select className="border rounded-md px-3 py-2 w-full">
          <option>30 seconds</option>
          <option>45 seconds</option>
          <option>60 seconds</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Number of Clips</label>
        <select className="border rounded-md px-3 py-2 w-full">
          <option>3</option>
          <option>5</option>
          <option>10</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Style</label>
        <select className="border rounded-md px-3 py-2 w-full">
          <option>Highlight Moments</option>
          <option>Fast Cuts</option>
          <option>Podcast Style</option>
        </select>
      </div>
    </div>
  );
}
