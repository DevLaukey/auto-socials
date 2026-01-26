import PlatformConnectCard from "./PlatformConnectCard";

const platforms = [
  { name: "YouTube", description: "Upload & manage videos" },
  { name: "Instagram", description: "Posts, reels & stories" },
  { name: "Twitter / X", description: "Tweets & threads" },
];

export default function AvailablePlatforms() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Connect New Account</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <PlatformConnectCard key={platform.name} platform={platform} />
        ))}
      </div>
    </div>
  );
}
