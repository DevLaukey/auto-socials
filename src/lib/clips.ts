const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// =============================
// Types
// =============================

export interface CreateClipJobResponse {
  job_id: number;
  status: string;
  progress: number;
}

export interface ClipJobStatusResponse {
  job_id: number;
  status: string;
  progress: number;
  error?: string | null;
}

export interface GeneratedClip {
  clip_id: string;
  video_url: string;
  duration: number;
  reason?: string | null;
}

// =============================
// Create Clip Job
// =============================

export const createClipJob = async ({
  videoFile,
  sourceUrl,
  clipLength = 30,
  maxClips = 3,
  style = "highlight",
}: {
  videoFile?: File;
  sourceUrl?: string;
  clipLength?: number;
  maxClips?: number;
  style?: string;
}): Promise<CreateClipJobResponse> => {
  const formData = new FormData();

  if (videoFile) {
    formData.append("video_file", videoFile);
  }

  if (sourceUrl) {
    formData.append("source_url", sourceUrl);
  }

  formData.append("clip_length", clipLength.toString());
  formData.append("max_clips", maxClips.toString());
  formData.append("style", style);

  const res = await fetch(`${API_URL}/api/clips/jobs`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to create clip job");
  }

  return res.json();
};

// =============================
// Poll Job Status
// =============================

export const getClipJobStatus = async (
  jobId: number,
): Promise<ClipJobStatusResponse> => {
  const res = await fetch(`${API_URL}/api/clips/jobs/${jobId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to fetch clip job status");
  }

  return res.json();
};

// =============================
// Fetch Generated Clips
// =============================

export const getGeneratedClips = async (
  jobId: number,
): Promise<GeneratedClip[]> => {
  const res = await fetch(`${API_URL}/api/clips/jobs/${jobId}/clips`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to fetch generated clips");
  }

  return res.json();
};
