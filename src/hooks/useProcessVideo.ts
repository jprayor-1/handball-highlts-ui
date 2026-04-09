import { useCallback, useState, useRef } from "react";
import type { Highlight } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getPollingConfig(_fileSizeBytes: number) {
  // Email notification handles the case where the user closes the tab.
  // Poll every 10s for up to 30 minutes — enough for any video size.
  return { interval: 10000, maxAttempts: 180 };
}

export function useProcessVideo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const processVideo = useCallback(
    async (
      key: string,
      fileSizeBytes: number,
      game_type?: string,
      email?: string,
    ) => {
      setIsProcessing(true);
      setError(null);
      cancelledRef.current = false;

      const { interval, maxAttempts } = getPollingConfig(fileSizeBytes);

      try {
        // Step 1: Enqueue the job, get job_id back instantly
        const res = await fetch(`${API_BASE}/api/process_video`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, ...(game_type ? { game_type } : {}), ...(email ? { email } : {}) }),
        });
        if (res.status === 429)
          throw new Error(
            "You've reached the daily limit (3 videos). Try again tomorrow.",
          );
        if (!res.ok) throw new Error("Failed to queue processing job");

        const { job_id } = await res.json();
        setJobId(job_id);

        // Step 2: Poll until finished or failed
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((resolve) => setTimeout(resolve, interval));

          if (cancelledRef.current) return null;

          const statusRes = await fetch(`${API_BASE}/api/jobs/${job_id}`);
          if (!statusRes.ok) throw new Error("Failed to check job status");
          const data = await statusRes.json();
          if (data.status === "finished") {
            const result: Highlight[] = data.result.highlights;
            setHighlights(result);
            setIsProcessing(false);
            return result;
          } else if (data.status === "failed") {
            throw new Error(data.error || "Processing failed");
          }
          // status is "queued" or "started" — keep polling
        }

        throw new Error(
          `Processing timed out after ${Math.round((interval * maxAttempts) / 60000)} minutes`,
        );
      } catch (err) {
        console.error("processVideo caught error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Processing failed";
        if (!cancelledRef.current) {
          setError(errorMessage);
          setIsProcessing(false);
        }
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    cancelledRef.current = true;
    setIsProcessing(false);
    setHighlights([]);
    setError(null);
    setJobId(null);
  }, []);

  return {
    processVideo,
    isProcessing,
    highlights,
    jobId,
    error,
    reset,
  };
}
