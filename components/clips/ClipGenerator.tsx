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

  const isMounted = useRef(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

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

      // 1️⃣ Create job
      const job = await createClipJob({
        videoFile:
          video && typeof video !== "string" ? (video as File) : undefined,
        sourceUrl: video && typeof video === "string" ? video : undefined,
        clipLength,
        maxClips: numberOfClips,
        style,
      });

      const jobId = job.job_id;

      // 2️⃣ Start polling immediately
      pollingRef.current = setInterval(async () => {
        try {
          const jobStatus = await getClipJobStatus(jobId);

          if (!isMounted.current) return;

          setProgress(jobStatus.progress ?? 0);

          if (jobStatus.status === "completed") {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
            }

            setProgress(100);

            const clips = await getGeneratedClips(jobId);

            if (onClipsGenerated) {
              onClipsGenerated(clips);
            }

            setLoading(false);
          }

          if (jobStatus.status === "failed") {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
            }

            throw new Error(jobStatus.error || "Clip generation failed");
          }
        } catch (err: any) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }

          if (isMounted.current) {
            setError(err.message || "Something went wrong");
            setLoading(false);
          }
        }
      }, 2000);
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.message || "Something went wrong");
        setLoading(false);
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
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Processing... {progress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button onClick={handleGenerate} disabled={!video || loading}>
        {loading ? "Generating clips..." : "Generate Clips"}
      </Button>
    </div>
  );
}
