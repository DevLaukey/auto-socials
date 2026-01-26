"use client";

import { useState } from "react";
import PostHistory from "@/components/posts/PostHistory";
import CreatePostView from "@/components/posts/views/CreatePostView";
import ScheduleModal from "@/components/posts/modals/ScheduleModal";
import ScheduledPostsModal from "@/components/posts/modals/ScheduledPostsModal";
import { Button } from "@/components/ui/button";

type PostView = "HISTORY" | "CREATE";
type ModalType = "NONE" | "SCHEDULE" | "SCHEDULED";

export default function PostsPage() {
  const [view, setView] = useState<PostView>("HISTORY");
  const [modal, setModal] = useState<ModalType>("NONE");

  return (
    <>
      {/* HEADER ACTION */}
      <div className="flex justify-end mb-6">
        {view === "HISTORY" && (
          <Button onClick={() => setView("CREATE")}>Create Post</Button>
        )}
      </div>

      {/* MAIN VIEW */}
      {view === "HISTORY" && <PostHistory />}

      {view === "CREATE" && (
        <CreatePostView
          onBack={() => setView("HISTORY")}
          onSchedule={() => setModal("SCHEDULE")}
          onViewScheduled={() => setModal("SCHEDULED")}
          onDone={() => setView("HISTORY")}
        />
      )}

      {/* MODALS */}
      {modal === "SCHEDULE" && (
        <ScheduleModal onClose={() => setModal("NONE")} />
      )}

      {modal === "SCHEDULED" && (
        <ScheduledPostsModal onClose={() => setModal("NONE")} />
      )}
    </>
  );
}
