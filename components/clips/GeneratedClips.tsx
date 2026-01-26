import ClipCard from "./ClipCard";

const mockClips = [
  { id: 1, title: "Clip 1", duration: "0:45" },
  { id: 2, title: "Clip 2", duration: "1:00" },
];

export default function GeneratedClips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockClips.map((clip) => (
        <ClipCard key={clip.id} clip={clip} />
      ))}
    </div>
  );
}
