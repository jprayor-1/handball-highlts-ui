import { useState } from "react";
import { presignUpload, uploadToR2, startProcessing } from "../api";
import type { Highlight } from "../types";

interface Props {
  onResult: (highlights: Highlight[]) => void;
  onVideoSelected: (file: File) => void;
}

export default function UploadForm({ onResult, onVideoSelected }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // 1️⃣ Presign
      const { url, key } = await presignUpload(file);

      // 2️⃣ Upload directly to R2
      await uploadToR2(file, url, setProgress);

      // 3️⃣ Tell backend to process video
      const result = await startProcessing(key);

      onResult(result.highlights);
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
          const selected = e.target.files?.[0];
          if (selected) {
            setFile(selected);
            onVideoSelected(selected);
          }
        }}
      />

      <button disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload Video"}
      </button>

      {loading && <p>Upload: {progress}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
