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
  created_at?: string;
  job_id?: number;
}

export interface ClipJob {
  id: number;
  user_id: number;
  source_url: string | null;
  local_video_path: string | null;
  clip_length: number;
  max_clips: number;
  style: string;
  status: string;
  progress: number;
  error: string | null;
  created_at: string;
  clips: GeneratedClip[];
}

// =============================
// Get All Clip Jobs (History)
// =============================

export const getAllClipJobs = async (): Promise<ClipJob[]> => {
  console.log(`[API] Fetching all clip jobs`);

  try {
    const res = await fetch(`${API_URL}/api/clips/jobs/all`, {
      method: "GET",
      credentials: "include",
    });

    console.log(`[API] All jobs response status:`, res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API] All jobs error:`, errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error?.detail || "Failed to fetch clip jobs");
      } catch {
        throw new Error(
          `Failed to fetch clip jobs: ${res.status} ${res.statusText}`,
        );
      }
    }

    const data = await res.json();
    console.log(`[API] Fetched ${data.length} clip jobs`);
    return data;
  } catch (error) {
    console.error(`[API] All jobs network error:`, error);
    throw error;
  }
};

// =============================
// Get Single Clip Job with Clips
// =============================

export const getClipJob = async (jobId: number): Promise<ClipJob> => {
  console.log(`[API] Fetching clip job ${jobId}`);

  try {
    const res = await fetch(`${API_URL}/api/clips/jobs/${jobId}/with-clips`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch clip job: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`[API] Clip job fetch error:`, error);
    throw error;
  }
};

// =============================
// Delete Clip Job
// =============================

export const deleteClipJob = async (jobId: number): Promise<void> => {
  console.log(`[API] Deleting clip job ${jobId}`);

  try {
    const res = await fetch(`${API_URL}/api/clips/jobs/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete clip job: ${errorText}`);
    }
  } catch (error) {
    console.error(`[API] Delete job error:`, error);
    throw error;
  }
};

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

  console.log("[API] Creating clip job with:", {
    hasVideoFile: !!videoFile,
    sourceUrl,
    clipLength,
    maxClips,
    style,
  });

  try {
    const res = await fetch(`${API_URL}/api/clips/jobs`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log("[API] Create job response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[API] Create job error response:", errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error?.detail || "Failed to create clip job");
      } catch {
        throw new Error(
          `Failed to create clip job: ${res.status} ${res.statusText}`,
        );
      }
    }

    const data = await res.json();
    console.log("[API] Create job success:", data);
    return data;
  } catch (error) {
    console.error("[API] Create job network error:", error);
    throw error;
  }
};

// =============================
// Poll Job Status
// =============================

export const getClipJobStatus = async (
  jobId: number,
): Promise<ClipJobStatusResponse> => {
  console.log(`[API] Fetching status for job ${jobId}`);

  try {
    const res = await fetch(`${API_URL}/api/clips/jobs/${jobId}`, {
      method: "GET",
      credentials: "include",
    });

    console.log(`[API] Job ${jobId} status response:`, res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API] Job ${jobId} status error:`, errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error?.detail || "Failed to fetch clip job status");
      } catch {
        throw new Error(
          `Failed to fetch job status: ${res.status} ${res.statusText}`,
        );
      }
    }

    const data = await res.json();
    console.log(`[API] Job ${jobId} status data:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Job ${jobId} status network error:`, error);
    throw error;
  }
};

// =============================
// Fetch Generated Clips
// =============================

export const getGeneratedClips = async (
  jobId: number,
): Promise<GeneratedClip[]> => {
  console.log(`[API] Fetching generated clips for job ${jobId}`);

  try {
    const res = await fetch(`${API_URL}/api/clips/jobs/${jobId}/clips`, {
      method: "GET",
      credentials: "include",
    });

    console.log(`[API] Job ${jobId} clips response status:`, res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API] Job ${jobId} clips error:`, errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error?.detail || "Failed to fetch generated clips");
      } catch {
        throw new Error(
          `Failed to fetch clips: ${res.status} ${res.statusText}`,
        );
      }
    }

    const data = await res.json();
    console.log(`[API] Job ${jobId} clips data:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Job ${jobId} clips network error:`, error);
    throw error;
  }
};
