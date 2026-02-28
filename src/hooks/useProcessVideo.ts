import { useCallback, useState } from "react";
import type { Highlight, HighlightResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function useProcessVideo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processVideo = useCallback(async (key: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await fetch(`${API_BASE}/api/process_video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!result.ok) throw new Error("Processing Failed");
      /*
        Keeping it the same for now, however I may need to update this response either with
        1) Formatted Times
        2) Original Times Incase we add highlight editing
      */
      const data: HighlightResponse = await result.json();

      setHighlights(data.highlights);
      setIsProcessing(false);
      return data.highlights;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Processing failed";
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  }, []);
  const reset = useCallback(() => {
    setIsProcessing(false);
    setHighlights([]);
    setError(null);
  }, []);

  return {
    processVideo,
    isProcessing,
    highlights,
    error,
    reset,
  };
}
