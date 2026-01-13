import { useState } from "react";
import { uploadVideo } from "../api";
import type { Highlight } from "../types";

interface Props {
    onResult: (highlights: Highlight[]) => void;
    onVideoSelected: (file: File) => void;
  }

export default function UploadForm({ onResult, onVideoSelected }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const data = await uploadVideo(file);
      onResult(data.highlights);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
                setFile(file);
                onVideoSelected(file);
            }
        }}
        />
      <button disabled={!file || loading}>
        {loading ? "Processing..." : "Upload Video"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
