"use client";

import { useRouter } from "next/navigation";

const upcomingPosts = [
  { platform: "YouTube", time: "Tomorrow, 10:00 AM" },
  { platform: "Instagram", time: "Today, 6:00 PM" },
  { platform: "Twitter", time: "Friday, 9:00 AM" },
];

export default function UpcomingPosts() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/posts")}
      className="
        bg-white rounded-xl border p-3 md:p-4 cursor-pointer
        hover:shadow-md hover:border-slate-300 transition
      "
    >
      <h2 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Upcoming Posts</h2>

      <ul className="space-y-2 md:space-y-3">
        {upcomingPosts.map((post, index) => (
          <li key={index} className="text-xs md:text-sm">
            <span className="font-medium">{post.platform}</span>
            <span className="text-muted-foreground"> — {post.time}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 md:mt-4 text-xs text-muted-foreground">
        View scheduled posts →
      </p>
    </div>
  );
}
