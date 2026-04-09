import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HighlightGrid } from "./HighlightGrid";
import { ErrorPage } from "./ErrorPage";
import { RotatingAnimations } from "./RotatingAnimations";
import type { Highlight } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type JobStatus = "queued" | "started" | "finished" | "failed";

export function ResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<JobStatus>("queued");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      navigate("/");
      return;
    }

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Failed to check job status");
        const data = await res.json();

        setStatus(data.status);

        if (data.status === "finished") {
          clearInterval(poll);
          setHighlights(data.result.highlights);
        } else if (data.status === "failed") {
          clearInterval(poll);
          setError(data.error || "Processing failed");
        }
      } catch (err) {
        clearInterval(poll);
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }, 10000);

    // Run immediately on mount too
    fetch(`${API_BASE}/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.status);
        if (data.status === "finished") {
          clearInterval(poll);
          setHighlights(data.result.highlights);
        } else if (data.status === "failed") {
          clearInterval(poll);
          setError(data.error || "Processing failed");
        }
      })
      .catch(() => {});

    return () => clearInterval(poll);
  }, [jobId, navigate]);

  if (error) return <ErrorPage message={error} />;

  if (highlights.length > 0) return <HighlightGrid highlights={highlights} />;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <RotatingAnimations />
        <p className="mt-4 text-sm text-muted-foreground">
          {status === "queued" ? "Your video is queued for processing..." : "Analyzing your footage..."}
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60">
          This page will update automatically. You can also close this tab — check your email (including spam) when it's ready.
        </p>
      </div>
    </main>
  );
}
