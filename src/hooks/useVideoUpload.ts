import { useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  console.error("API_BASE_URL is not defined");
}

export function useVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const presignUrl = await fetch(`${API_BASE}/api/uploads/presign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            filesize: file.size,
            content_type: file.type,
          }),
        });

        if (!presignUrl.ok) throw new Error("Failed to get upload URL");

        const presignData = await presignUrl.json();

        // Step 2: Upload to R2
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error("Upload failed"));
          };

          xhr.onerror = () => reject(new Error("Upload failed"));

          xhr.open("PUT", presignData.url);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        setIsUploading(false);
        return presignData.key; // Return the key for next step
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        setIsUploading(false);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadVideo,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
}
