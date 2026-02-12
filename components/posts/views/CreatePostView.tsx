"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountsStore } from "@/src/store/accountsStore";
import PlatformSelector from "../widgets/PlatformSelector";
import PostMetadataModal from "../modals/PostMetadataModal";
import PlatformAccounts from "../widgets/PlatformAccounts";
import { createPost } from "@/src/lib/posts";
import api from "@/lib/api";
import { useAuthStore } from "@/src/store/authStore";

type Platform = "instagram" | "youtube" | "twitter";

export default function CreatePostView() {
  const router = useRouter();
  const { accounts, loadAccounts } = useAccountsStore();
  const { user } = useAuthStore();

  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [executing, setExecuting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Check if user has an active subscription
  const hasActiveSubscription = user?.subscription?.is_active === true;

  useEffect(() => {
    if (accounts.length === 0) {
      loadAccounts();
    }
  }, [accounts.length, loadAccounts]);

  const handlePlatformChange = (platform: Platform) => {
    setActivePlatform(platform);
    setShowModal(true);
    setMessage(null);
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
      setMessage({
        type: "error",
        text: "Select at least one account or group.",
      });
      return;
    }

    const data = metadata[activePlatform];
    if (!data?.media_file) {
      setMessage({ type: "error", text: "No media uploaded." });
      return;
    }

    setMessage(null);

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

      // =====================================================
      // SUBSCRIPTION CHECK: Redirect if no active subscription
      // =====================================================
      if (!hasActiveSubscription) {
        // Redirect to subscription page
        router.push("/subscription");
        return;
      }

      // User has subscription - create post directly
      await createPost(payload);

      setMetadata({});
      setActivePlatform(null);
      setSelectedAccountIds([]);
      setSelectedGroupIds([]);

      setMessage({ type: "success", text: "Post created successfully!" });
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to create post.",
      });
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

      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : message.type === "info"
                ? "bg-blue-50 border border-blue-200 text-blue-700"
                : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Subscription status notice */}
      {!hasActiveSubscription && (
        <div className="rounded-md px-4 py-3 text-sm bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-between gap-4">
          <span>
            You don&apos;t have an active subscription. Subscribe to create
            posts.
          </span>

          <button
            onClick={() => router.push("/subscription")}
            className="px-4 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700"
          >
            View Subscription Plans
          </button>
        </div>
      )}

      {!activePlatform && !message && (
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

          <div className="grid grid-cols-2 gap-4 text-sm">
            {metadata[activePlatform].title && (
              <div>
                <span className="text-muted-foreground">Title:</span>{" "}
                <span className="font-medium">
                  {metadata[activePlatform].title}
                </span>
              </div>
            )}
            {metadata[activePlatform].description && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Description:</span>{" "}
                <span>{metadata[activePlatform].description}</span>
              </div>
            )}
            {metadata[activePlatform].hashtags && (
              <div>
                <span className="text-muted-foreground">Hashtags:</span>{" "}
                <span>{metadata[activePlatform].hashtags}</span>
              </div>
            )}
            {metadata[activePlatform].scheduled_time && (
              <div>
                <span className="text-muted-foreground">Scheduled:</span>{" "}
                <span>
                  {new Date(
                    metadata[activePlatform].scheduled_time,
                  ).toLocaleString()}
                </span>
              </div>
            )}
            {metadata[activePlatform].privacy_status && (
              <div>
                <span className="text-muted-foreground">Privacy:</span>{" "}
                <span className="capitalize">
                  {metadata[activePlatform].privacy_status}
                </span>
              </div>
            )}
            {metadata[activePlatform].instagram_type && (
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                <span className="capitalize">
                  {metadata[activePlatform].instagram_type}
                </span>
              </div>
            )}
            {metadata[activePlatform].media_file && (
              <div>
                <span className="text-muted-foreground">Media:</span>{" "}
                <span className="text-green-600">Uploaded</span>
              </div>
            )}
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
              {executing
                ? "Processing..."
                : hasActiveSubscription
                  ? "Execute"
                  : "Subscribe to Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
