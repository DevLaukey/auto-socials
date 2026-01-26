"use client";

import { useState } from "react";
import PostHistory from "@/components/posts/PostHistory";
import CreatePostView from "@/components/posts/views/CreatePostView";
import { Button } from "@/components/ui/button";

type PostView = "HISTORY" | "CREATE";

export default function PostsPage() {
  const [view, setView] = useState<PostView>("HISTORY");

  return (
    <>
      {/* HEADER ACTION */}
      <div className="flex justify-end mb-6">
        {view === "HISTORY" ? (
          <Button onClick={() => setView("CREATE")}>Create Post</Button>
        ) : (
          <Button variant="outline" onClick={() => setView("HISTORY")}>
            ← Back to History
          </Button>
        )}
      </div>

      {/* MAIN VIEW */}
      {view === "HISTORY" && <PostHistory />}

      {view === "CREATE" && <CreatePostView />}
    </>
  );
}
