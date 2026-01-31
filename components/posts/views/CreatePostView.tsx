"use client";

import { useEffect, useState } from "react";
import { useAccountsStore } from "@/src/store/accountsStore";
import PlatformSelector from "../widgets/PlatformSelector";
import PostMetadataModal from "../modals/PostMetadataModal";
import PlatformAccounts from "../widgets/PlatformAccounts";
import { createPost } from "@/src/lib/posts";
import api from "@/lib/api";

type Platform = "instagram" | "youtube" | "twitter";

export default function CreatePostView() {
  const { accounts, loadAccounts } = useAccountsStore();

  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (accounts.length === 0) {
      loadAccounts();
    }
  }, [accounts.length, loadAccounts]);

  const handlePlatformChange = (platform: Platform) => {
    setActivePlatform(platform);
    setShowModal(true);
  };

  const handleSaveMetadata = (data: any) => {
    if (!activePlatform) return;

    if (!data.media_file) {
      alert("Please upload media before saving the post.");
      return;
    }

    setMetadata((prev) => ({
      ...prev,
      [activePlatform]: data,
    }));

    setSelectedAccountIds([]);
    setSelectedGroupIds([]);
    setShowModal(false);
  };

  const handleExecute = async () => {
    if (!activePlatform) return;

    if (selectedAccountIds.length === 0 && selectedGroupIds.length === 0) {
      alert("Select at least one account or group.");
      return;
    }

    const data = metadata[activePlatform];
    if (!data?.media_file) {
      alert("No media uploaded.");
      return;
    }

    try {
      setExecuting(true);

      if (activePlatform === "youtube") {
        for (const accountId of selectedAccountIds) {
          const res = await api.get(`/auth/youtube/status/${accountId}`);
          const { authenticated, auth_url } = res.data;

          if (!authenticated && auth_url) {
            // Redirect to Google OAuth, return back here after auth
            const next = encodeURIComponent(window.location.href);
            window.location.href = `${auth_url}?next=${next}`;
            return;
          }
        }
      }

      // =====================================================
      // CREATE POST PAYLOAD
      // =====================================================
      const payload: any = {
        account_ids: selectedAccountIds,
        group_ids: selectedGroupIds,
        media_file: data.media_file,
        title: data.title || "",
        description: data.description || "",
        hashtags: data.hashtags || "",
        scheduled_time: data.scheduled_time,
        privacy_status: data.privacy_status || "public",
      };

      if (activePlatform === "instagram") {
        payload.post_type =
          data.instagram_type === "post" ? "feed" : data.instagram_type;
      }

      await createPost(payload);

      setMetadata({});
      setActivePlatform(null);
      setSelectedAccountIds([]);
      setSelectedGroupIds([]);

      alert("Post created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Post</h2>
        <p className="text-sm text-muted-foreground">
          Choose a platform, add media and details, then select accounts or
          groups.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-8 min-h-[140px]">
        <PlatformSelector onChange={handlePlatformChange} />
      </div>

      {!activePlatform && (
        <div className="border border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
          Select a platform above to start creating a post.
        </div>
      )}

      {activePlatform && showModal && (
        <PostMetadataModal
          platform={activePlatform}
          onClose={() => setShowModal(false)}
          onSave={handleSaveMetadata}
        />
      )}

      {activePlatform && metadata[activePlatform] && (
        <div className="rounded-lg border bg-background p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Post Summary</h3>
            <span className="text-xs px-2 py-1 rounded bg-muted capitalize">
              {activePlatform}
            </span>
          </div>

          <PlatformAccounts
            platform={activePlatform}
            selectedAccountIds={selectedAccountIds}
            selectedGroupIds={selectedGroupIds}
            onAccountsChange={setSelectedAccountIds}
            onGroupsChange={setSelectedGroupIds}
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleExecute}
              disabled={executing}
              className="px-5 py-2 rounded bg-black text-white text-sm disabled:opacity-50"
            >
              {executing ? "Executing..." : "Execute"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
