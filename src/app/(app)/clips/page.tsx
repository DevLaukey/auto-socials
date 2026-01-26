import ClipGenerator from "../../../../components/clips/ClipGenerator";
import GeneratedClips from "../../../../components/clips/GeneratedClips";

export default function ClipsPage() {
  return (
    <>
      <div className="space-y-6 max-w-5xl">
        <h1 className="text-2xl font-semibold">AI Video Clipping</h1>
        <ClipGenerator />
        <GeneratedClips />
      </div>
    </>
  );
}
