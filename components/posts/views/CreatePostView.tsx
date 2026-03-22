"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccountsStore } from "@/src/store/accountsStore";
import PlatformSelector from "../widgets/PlatformSelector";
import PostMetadataModal from "../modals/PostMetadataModal";
import PlatformAccounts from "../widgets/PlatformAccounts";
import AIEngagementSettings from "../widgets/AIEngagementSettings";
import TwitterThreadBuilder from "../widgets/TwitterThreadBuilder";
import {
  createPost,
  createPostWithEngagement,
  type CreatePostResponse,
  type CreatePostWithEngagementResponse,
} from "@/src/lib/posts";
import api from "@/lib/api";
import { useAuthStore } from "@/src/store/authStore";

type Platform = "instagram" | "youtube" | "twitter";

// Type guard to check if result has engagement_jobs
function hasEngagementJobs(
  result: any,
): result is CreatePostWithEngagementResponse {
  return result && typeof result === "object" && "engagement_jobs" in result;
}

export default function CreatePostView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accounts, loadAccounts, checkTwitterAuth } = useAccountsStore();
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

  // AI Engagement settings
  const [engagementSettings, setEngagementSettings] = useState({
    ai_comments_enabled: false,
    ai_comments_count: 3,
    ai_comments_style: "casual" as const,
    ai_comments_delay_minutes: 10,
    ai_comments_spread: true,
    ai_dms_enabled: false,
    ai_dms_target_users: [] as string[],
    ai_dms_message_style: "friendly" as const,
    ai_dms_delay_minutes: 5,
  });

  // Twitter/X thread builder
  const [isThread, setIsThread] = useState(false);
  const [threadTweets, setThreadTweets] = useState<string[]>([""]);

  // Store clip data in state
  const [pendingClip, setPendingClip] = useState<any>(null);
  const [pendingClips, setPendingClips] = useState<any[]>([]);
  const [currentClipIndex, setCurrentClipIndex] = useState<number>(0);

  // Check for clip data from AI Clips page
  useEffect(() => {
    const fromClips = searchParams.get("from") === "clips";
    const multiple = searchParams.get("multiple") === "true";

    if (fromClips) {
      if (multiple) {
        // Handle multiple clips
        const storedClips = sessionStorage.getItem("selectedClips");
        if (storedClips) {
          const clips = JSON.parse(storedClips);
          setPendingClips(clips);
          setCurrentClipIndex(0);
          setMessage({
            type: "info",
            text: `${clips.length} clips ready to post. Select a platform to post the first clip.`,
          });
        }
      } else {
        // Handle single clip
        const storedClip = sessionStorage.getItem("selectedClip");
        if (storedClip) {
          const clip = JSON.parse(storedClip);
          setPendingClip(clip);
          setMessage({
            type: "info",
            text: "Clip ready to post. Select a platform to continue.",
          });
        }
      }

      // Clean up URL
      router.replace("/posts/create");
    }
  }, [searchParams, router]);

  // Check if user has an active subscription
  const hasActiveSubscription = user?.subscription?.is_active === true;

  useEffect(() => {
    if (accounts.length === 0) {
      loadAccounts();
    }
  }, [accounts.length, loadAccounts]);

  // Check Twitter auth when platform changes to twitter
  useEffect(() => {
    if (activePlatform === "twitter" && selectedAccountIds.length > 0) {
      selectedAccountIds.forEach((accountId) => {
        checkTwitterAuth(accountId);
      });
    }
  }, [activePlatform, selectedAccountIds, checkTwitterAuth]);

  const handlePlatformChange = (platform: Platform) => {
    setActivePlatform(platform);
    setShowModal(true);
    setMessage(null);

    // Reset Twitter-specific state
    if (platform !== "twitter") {
      setIsThread(false);
      setThreadTweets([""]);
    }
  };

  const handleSaveMetadata = (data: any) => {
    if (!activePlatform) return;

    // Handle multiple clips
    if (pendingClips.length > 0) {
      const currentClip = pendingClips[currentClipIndex];
      data.media_file = currentClip.videoUrl;
      data.clip_source = true;
      data.clip_data = currentClip;
      data.clip_index = currentClipIndex;
      data.total_clips = pendingClips.length;
    }
    // Handle single clip
    else if (pendingClip) {
      data.media_file = pendingClip.videoUrl;
      data.clip_source = true;
      data.clip_data = pendingClip;
    }

    setMetadata((prev) => ({
      ...prev,
      [activePlatform]: data,
    }));

    setSelectedAccountIds([]);
    setSelectedGroupIds([]);
    setShowModal(false);
  };

  const handlePostAnotherClip = () => {
    // Move to next clip
    if (currentClipIndex < pendingClips.length - 1) {
      setCurrentClipIndex(currentClipIndex + 1);
      setMetadata({}); // Clear metadata for next clip
      setSelectedAccountIds([]);
      setSelectedGroupIds([]);
      setMessage({
        type: "info",
        text: `Posting clip ${currentClipIndex + 2} of ${pendingClips.length}. Select a platform to continue.`,
      });
    } else {
      // All clips posted
      setPendingClips([]);
      setCurrentClipIndex(0);
      setPendingClip(null);
      sessionStorage.removeItem("selectedClips");
      sessionStorage.removeItem("pendingClip");
      setMessage({
        type: "success",
        text: "All clips have been posted successfully!",
      });
    }
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
    if (!data?.media_file && activePlatform !== "twitter") {
      setMessage({ type: "error", text: "No media uploaded." });
      return;
    }

    // Validate Twitter thread
    if (activePlatform === "twitter" && isThread) {
      const validTweets = threadTweets.filter((t) => t.trim().length > 0);
      if (validTweets.length < 2) {
        setMessage({
          type: "error",
          text: "A thread must contain at least 2 tweets.",
        });
        return;
      }
    }

    setMessage(null);

    try {
      setExecuting(true);

      // Check YouTube authentication
      if (activePlatform === "youtube") {
        for (const accountId of selectedAccountIds) {
          const res = await api.get(`/auth/youtube/status/${accountId}`);
          const { authenticated, auth_url } = res.data;

          if (!authenticated && auth_url) {
            const next = encodeURIComponent(window.location.href);
            window.location.href = `${auth_url}?next=${next}`;
            return;
          }
        }
      }

      // Check Twitter authentication
      if (activePlatform === "twitter") {
        for (const accountId of selectedAccountIds) {
          const isAuthenticated = await checkTwitterAuth(accountId);
          if (!isAuthenticated) {
            setMessage({
              type: "error",
              text: "Twitter account not authenticated. Please connect Twitter first.",
            });
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
        media_file: data?.media_file || "",
        title: data?.title || "",
        description: data?.description || "",
        hashtags: data?.hashtags || "",
        scheduled_time: data?.scheduled_time,
        privacy_status: data?.privacy_status || "public",

        // AI Engagement settings
        ...engagementSettings,

        // Twitter/X specific
        ...(activePlatform === "twitter" && {
          is_thread: isThread,
          thread_tweets: isThread
            ? threadTweets.filter((t) => t.trim())
            : undefined,
          reply_to_tweet_id: data?.reply_to_tweet_id,
          quote_tweet_id: data?.quote_tweet_id,
        }),
      };

      if (activePlatform === "instagram") {
        payload.post_type =
          data?.instagram_type === "post" ? "feed" : data?.instagram_type;
      }

      // =====================================================
      // SUBSCRIPTION CHECK
      // =====================================================
      if (!hasActiveSubscription) {
        router.push("/subscription");
        return;
      }

      // Use createPostWithEngagement if any AI engagement is enabled
      let result: CreatePostResponse | CreatePostWithEngagementResponse;
      if (
        engagementSettings.ai_comments_enabled ||
        engagementSettings.ai_dms_enabled
      ) {
        result = await createPostWithEngagement(payload);
      } else {
        result = await createPost(payload);
      }

      // Clear current platform metadata
      setMetadata((prev) => {
        const newMetadata = { ...prev };
        delete newMetadata[activePlatform];
        return newMetadata;
      });

      setActivePlatform(null);
      setSelectedAccountIds([]);
      setSelectedGroupIds([]);

      // Reset engagement settings
      setEngagementSettings({
        ai_comments_enabled: false,
        ai_comments_count: 3,
        ai_comments_style: "casual",
        ai_comments_delay_minutes: 10,
        ai_comments_spread: true,
        ai_dms_enabled: false,
        ai_dms_target_users: [],
        ai_dms_message_style: "friendly",
        ai_dms_delay_minutes: 5,
      });

      // Handle multiple clips progression
      if (pendingClips.length > 0) {
        const currentClipNum = currentClipIndex + 1;

        // Build success message with engagement info
        let successText = `Clip ${currentClipNum} of ${pendingClips.length} posted successfully!`;

        // Check if result has engagement_jobs (only true for createPostWithEngagement)
        if (hasEngagementJobs(result)) {
          const commentCount = result.engagement_jobs.comments?.length || 0;
          const dmCount = result.engagement_jobs.dms?.length || 0;
          if (commentCount > 0 || dmCount > 0) {
            successText += ` (${commentCount} comments, ${dmCount} DMs scheduled)`;
          }
        }

        setMessage({ type: "success", text: successText });

        // Ask if user wants to post another clip
        setTimeout(() => {
          if (currentClipIndex < pendingClips.length - 1) {
            if (
              confirm(
                `Clip ${currentClipNum} posted! Do you want to post the next clip?`,
              )
            ) {
              handlePostAnotherClip();
            } else {
              // User chose not to continue
              setPendingClips([]);
              setCurrentClipIndex(0);
              sessionStorage.removeItem("selectedClips");
              setMessage({
                type: "success",
                text: `${currentClipNum} clip${currentClipNum > 1 ? "s" : ""} posted successfully!`,
              });
            }
          } else {
            // All clips posted
            setPendingClips([]);
            setCurrentClipIndex(0);
            sessionStorage.removeItem("selectedClips");
            setMessage({
              type: "success",
              text: "All clips have been posted successfully!",
            });
          }
        }, 500);
      } else {
        // Single clip case
        let successText = data?.clip_source
          ? "Clip posted successfully!"
          : "Post created successfully!";

        // Check if result has engagement_jobs (only true for createPostWithEngagement)
        if (hasEngagementJobs(result)) {
          const commentCount = result.engagement_jobs.comments?.length || 0;
          const dmCount = result.engagement_jobs.dms?.length || 0;
          if (commentCount > 0 || dmCount > 0) {
            successText += ` (${commentCount} comments, ${dmCount} DMs scheduled)`;
          }
        }

        setMessage({ type: "success", text: successText });

        // Clear single clip data
        setPendingClip(null);
        sessionStorage.removeItem("pendingClip");
      }
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

  const handleCancelMultiple = () => {
    if (pendingClips.length > 0) {
      if (confirm("Cancel posting the remaining clips?")) {
        setPendingClips([]);
        setCurrentClipIndex(0);
        sessionStorage.removeItem("selectedClips");
        setMessage(null);
      }
    }
  };

  const handleEngagementChange = (settings: any) => {
    setEngagementSettings((prev) => ({ ...prev, ...settings }));
  };

  const handleTargetUsersChange = (users: string) => {
    const userList = users
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    setEngagementSettings((prev) => ({
      ...prev,
      ai_dms_target_users: userList,
    }));
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

      {/* Multiple clips progress indicator */}
      {pendingClips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-700">
                Posting clip {currentClipIndex + 1} of {pendingClips.length}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {pendingClips.length - (currentClipIndex + 1)} clips remaining
              </p>
            </div>
            <button
              onClick={handleCancelMultiple}
              className="px-3 py-1 text-sm bg-white border border-blue-300 rounded hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
          <div className="w-full bg-blue-200 h-1.5 rounded-full mt-3">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{
                width: `${((currentClipIndex + 1) / pendingClips.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

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
          initialMediaFile={
            pendingClips.length > 0
              ? pendingClips[currentClipIndex]?.videoUrl
              : pendingClip?.videoUrl
          }
          isClipSource={!!(pendingClip || pendingClips.length > 0)}
          clipNumber={
            pendingClips.length > 0 ? currentClipIndex + 1 : undefined
          }
          totalClips={pendingClips.length > 0 ? pendingClips.length : undefined}
          onThreadChange={
            activePlatform === "twitter"
              ? (thread) => {
                  setIsThread(thread.enabled);
                  setThreadTweets(thread.tweets);
                }
              : undefined
          }
        />
      )}

      {activePlatform && metadata[activePlatform] && (
        <div className="rounded-lg border bg-background p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Post Summary</h3>
            <span className="text-xs px-2 py-1 rounded bg-muted capitalize">
              {activePlatform}
              {pendingClips.length > 0 && (
                <span className="ml-2 text-blue-600">
                  ({currentClipIndex + 1}/{pendingClips.length})
                </span>
              )}
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
                <span className="text-green-600">
                  {metadata[activePlatform].clip_source
                    ? `Clip ${
                        metadata[activePlatform].clip_index !== undefined
                          ? metadata[activePlatform].clip_index + 1
                          : ""
                      } ready`
                    : "Uploaded"}
                </span>
              </div>
            )}

            {/* Twitter/X thread indicator */}
            {activePlatform === "twitter" && isThread && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Thread:</span>{" "}
                <span className="text-blue-600">
                  {threadTweets.filter((t) => t.trim()).length} tweets
                </span>
              </div>
            )}
          </div>

          {/* Platform Accounts Selection */}
          <PlatformAccounts
            platform={activePlatform}
            selectedAccountIds={selectedAccountIds}
            selectedGroupIds={selectedGroupIds}
            onAccountsChange={setSelectedAccountIds}
            onGroupsChange={setSelectedGroupIds}
          />

          {/* AI Engagement Settings */}
          <AIEngagementSettings
            settings={engagementSettings}
            onSettingsChange={handleEngagementChange}
            onTargetUsersChange={handleTargetUsersChange}
            disabled={executing}
          />

          {/* Execute Button */}
          <div className="flex justify-end gap-3 pt-2">
            {pendingClips.length > 0 &&
              currentClipIndex < pendingClips.length - 1 && (
                <button
                  onClick={handlePostAnotherClip}
                  className="px-5 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50"
                >
                  Skip for Now
                </button>
              )}
            <button
              onClick={handleExecute}
              disabled={executing}
              className="px-5 py-2 rounded bg-black text-white text-sm disabled:opacity-50"
            >
              {executing
                ? "Processing..."
                : hasActiveSubscription
                  ? metadata[activePlatform]?.clipSource
                    ? pendingClips.length > 0
                      ? `Post Clip ${currentClipIndex + 1} of ${pendingClips.length}`
                      : "Post Clip"
                    : engagementSettings.ai_comments_enabled ||
                        engagementSettings.ai_dms_enabled
                      ? "Create with AI Engagement"
                      : "Execute"
                  : "Subscribe to Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
