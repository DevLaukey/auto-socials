"use client";

import { useState, useRef, useEffect } from "react";
import VideoInput from "./VideoInput";
import ClipSettings from "./ClipSettings";
import { Button } from "@/components/ui/button";
import {
  createClipJob,
  getClipJobStatus,
  getGeneratedClips,
  GeneratedClip,
} from "../../src/lib/clips";

type Props = {
  onClipsGenerated?: (clips: GeneratedClip[]) => void;
};

export default function ClipGenerator({ onClipsGenerated }: Props) {
  const [video, setVideo] = useState<File | string | null>(null);
  const [clipLength, setClipLength] = useState<number>(30);
  const [numberOfClips, setNumberOfClips] = useState<number>(3);
  const [style, setStyle] = useState<string>("highlight");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Use a ref to track if component is mounted
  const isMounted = useRef(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const jobCompletedRef = useRef<boolean>(false);
  const currentJobId = useRef<number | null>(null);
  const pollCountRef = useRef<number>(0);
  // Add a ref to track if we're already polling
  const isPollingRef = useRef<boolean>(false);

  useEffect(() => {
    console.log("[Frontend] Component mounted");
    isMounted.current = true;

    return () => {
      console.log("[Frontend] Component unmounting, cleaning up");
      isMounted.current = false;
      stopPolling();
    };
  }, []);

  const stopPolling = () => {
    if (pollingRef.current) {
      console.log("[Frontend] Stopping polling");
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      isPollingRef.current = false;
    }
  };

  // Function to handle job completion
  const handleJobCompletion = async (jobId: number) => {
    try {
      console.log(`[Frontend] Job ${jobId} completed, fetching clips...`);
      jobCompletedRef.current = true;
      stopPolling();

      setProgress(100);
      setStatusMessage("Complete!");

      // Fetch the generated clips
      console.log(`[Frontend] Fetching clips for job ${jobId}`);
      const clips = await getGeneratedClips(jobId);
      console.log(`[Frontend] Fetched ${clips.length} clips:`, clips);

      if (isMounted.current) {
        if (onClipsGenerated) {
          console.log("[Frontend] Passing clips to parent component");
          onClipsGenerated(clips);
        }

        // Small delay to show 100% before hiding loading
        setTimeout(() => {
          if (isMounted.current) {
            console.log("[Frontend] Hiding loading state");
            setLoading(false);
            currentJobId.current = null;
            pollCountRef.current = 0;
            isPollingRef.current = false;
          }
        }, 500);
      }
    } catch (err: any) {
      console.error("Error fetching clips:", err);
      if (isMounted.current) {
        setError("Failed to fetch generated clips");
        setLoading(false);
        currentJobId.current = null;
        pollCountRef.current = 0;
        isPollingRef.current = false;
      }
    }
  };

  // Separate function to start polling every 5 seconds
  const startPolling = (jobId: number) => {
    // Don't start if we're already polling
    if (isPollingRef.current) {
      console.log("[Frontend] Already polling, skipping");
      return;
    }

    console.log(
      `[Frontend] Starting polling for job ${jobId} (every 5 seconds)`,
    );

    // Clear any existing polling
    stopPolling();

    // Reset poll count
    pollCountRef.current = 0;
    isPollingRef.current = true;

    // Start polling every 5 seconds
    pollingRef.current = setInterval(async () => {
      // Check if component is still mounted
      if (!isMounted.current) {
        console.log("[Frontend] Component unmounted, stopping poll");
        stopPolling();
        return;
      }

      // Increment poll count
      pollCountRef.current++;

      try {
        console.log(
          `[Frontend] 🔄 Poll #${pollCountRef.current} for job ${jobId}...`,
        );
        const jobStatus = await getClipJobStatus(jobId);
        console.log(
          `[Frontend] 📊 Poll #${pollCountRef.current} - Job ${jobId} status:`,
          jobStatus,
        );

        if (jobCompletedRef.current) {
          console.log(`[Frontend] Job already completed, stopping polling`);
          stopPolling();
          return;
        }

        // Update progress with real value
        if (jobStatus.progress !== undefined) {
          console.log(`[Frontend] 📈 Progress update: ${jobStatus.progress}%`);
          setProgress(jobStatus.progress);

          // Update status message based on progress
          if (jobStatus.progress < 30) {
            setStatusMessage("Analyzing video content...");
          } else if (jobStatus.progress < 60) {
            setStatusMessage("Identifying key moments...");
          } else if (jobStatus.progress < 90) {
            setStatusMessage("Generating clips...");
          } else if (jobStatus.progress < 100) {
            setStatusMessage("Finalizing...");
          } else {
            setStatusMessage("Complete!");
          }
        }

        // Check for completion
        if (jobStatus.status === "completed") {
          console.log(`[Frontend] ✅ Job ${jobId} completed, stopping polling`);
          await handleJobCompletion(jobId);
          return;
        }

        // Check for failure
        if (jobStatus.status === "failed") {
          console.log(`[Frontend] ❌ Job ${jobId} failed`);
          stopPolling();
          throw new Error(jobStatus.error || "Clip generation failed");
        }
      } catch (err: any) {
        console.error(`[Frontend] 💥 Polling error for job ${jobId}:`, err);

        // Only stop polling if component is still mounted
        if (isMounted.current) {
          stopPolling();
          setError(err.message || "Something went wrong");
          setLoading(false);
          setStatusMessage("");
          currentJobId.current = null;
          pollCountRef.current = 0;
          isPollingRef.current = false;
        }
      }
    }, 5000); // 5 seconds
  };

  async function handleGenerate() {
    if (!video) {
      setError("Please provide a video file or URL.");
      return;
    }

    if (clipLength <= 0 || numberOfClips <= 0) {
      setError("Clip length and number of clips must be greater than 0.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      setStatusMessage("Starting clip generation...");
      jobCompletedRef.current = false;
      pollCountRef.current = 0;

      console.log("[Frontend] 🚀 Creating clip job with params:", {
        clipLength,
        numberOfClips,
        style,
        videoType: video instanceof File ? "file" : "url",
      });

      // Create job
      const job = await createClipJob({
        videoFile: video instanceof File ? video : undefined,
        sourceUrl: typeof video === "string" ? video : undefined,
        clipLength,
        maxClips: numberOfClips,
        style,
      });

      console.log("[Frontend] ✅ Job creation response:", job);

      const jobId = job.job_id;
      currentJobId.current = jobId;
      console.log(`[Frontend] 📋 Job created with ID: ${jobId}`);
      setStatusMessage("Job created, processing video...");

      // Check the status immediately
      try {
        console.log(`[Frontend] 🔍 Checking initial status for job ${jobId}`);
        const initialStatus = await getClipJobStatus(jobId);
        console.log(`[Frontend] 📊 Initial status:`, initialStatus);

        // Update progress with initial status
        if (initialStatus.progress !== undefined) {
          console.log(
            `[Frontend] 📈 Setting initial progress to ${initialStatus.progress}%`,
          );
          setProgress(initialStatus.progress);
        }

        if (initialStatus.status === "completed") {
          console.log(`[Frontend] ✅ Job ${jobId} already completed`);
          await handleJobCompletion(jobId);
          return;
        }
      } catch (err) {
        console.error("[Frontend] ❌ Error checking initial status:", err);
      }

      // Start polling every 5 seconds
      console.log(`[Frontend] ⏰ Starting 5-second polling for job ${jobId}`);

      // Small delay to ensure component is stable
      setTimeout(() => {
        if (isMounted.current && !jobCompletedRef.current) {
          startPolling(jobId);
        }
      }, 100);
    } catch (err: any) {
      console.error("[Frontend] 💥 Error creating job:", err);
      stopPolling();

      if (isMounted.current) {
        setError(err.message || "Something went wrong");
        setLoading(false);
        setStatusMessage("");
        currentJobId.current = null;
        pollCountRef.current = 0;
        isPollingRef.current = false;
      }
    }
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6">
      <VideoInput value={video} onChange={setVideo} />

      <ClipSettings
        clipLength={clipLength}
        setClipLength={setClipLength}
        numberOfClips={numberOfClips}
        setNumberOfClips={setNumberOfClips}
        style={style}
        setStyle={setStyle}
      />

      {loading && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{statusMessage}</span>
            <span className="font-medium text-black">{progress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-black h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: progress > 0 ? "0 0 8px rgba(0,0,0,0.3)" : "none",
              }}
            />
          </div>

          <p className="text-xs text-gray-400">
            This may take a minute or two depending on video length
          </p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={!video || loading}
        className="w-full md:w-auto transition-all duration-200 hover:scale-105"
      >
        {loading ? "Generating clips..." : "Generate Clips"}
      </Button>
    </div>
  );
}
