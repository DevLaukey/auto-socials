export function normalizePlatform(platform: string) {
  const normalizePlatform = (platform: string) => {
    if (platform === "Twitter") return "Twitter/X";
    if (platform === "X") return "Twitter/X";
    if (platform === "Instagram") return "Instagram";
    if (platform === "YouTube") return "YouTube";
    return "Instagram"; // safe fallback
    };
  return normalizePlatform(platform);
}
