import { useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  console.error("API_BASE_URL is not defined");
}

const MAX_FILE_SIZE = 35 * 1024 * 1024 * 1024; // 35GB
const MULTIPART_THRESHOLD = 5 * 1024 * 1024 * 1024; // 5GB — R2 single PUT limit
const CHUNK_SIZE = 256 * 1024 * 1024; // 256MB per part

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
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("File too large (max 35GB)");
        }

        const key =
          file.size > MULTIPART_THRESHOLD
            ? await uploadMultipart(file, setUploadProgress)
            : await uploadSingle(file, setUploadProgress);

        setIsUploading(false);
        return key;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        setIsUploading(false);
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return { uploadVideo, isUploading, uploadProgress, error, reset };
}

async function uploadSingle(
  file: File,
  setUploadProgress: (p: number) => void,
): Promise<string> {
  const presignRes = await fetch(`${API_BASE}/api/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      filesize: file.size,
      content_type: file.type,
    }),
  });

  if (presignRes.status === 429)
    throw new Error(
      "You've reached the daily limit (3 videos). Try again tomorrow.",
    );
  if (!presignRes.ok) {
    const body = await presignRes.json().catch(() => ({}));
    console.error("Presign failed", presignRes.status, body);
    throw new Error(body?.error ?? `Failed to get upload URL (${presignRes.status})`);
  }

  const { key, url } = await presignRes.json();

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error("Upload failed"));
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });

  return key;
}

async function uploadMultipart(
  file: File,
  setUploadProgress: (p: number) => void,
): Promise<string> {
  // 1. Initiate
  const initiateRes = await fetch(`${API_BASE}/api/uploads/multipart/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      filesize: file.size,
      content_type: file.type,
    }),
  });

  if (initiateRes.status === 429)
    throw new Error(
      "You've reached the daily limit (3 videos). Try again tomorrow.",
    );
  if (!initiateRes.ok) {
    const body = await initiateRes.json().catch(() => ({}));
    console.error("Multipart initiate failed", initiateRes.status, body);
    throw new Error(body?.error ?? `Failed to initiate upload (${initiateRes.status})`);
  }

  const { key, upload_id } = await initiateRes.json();

  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const parts: { PartNumber: number; ETag: string }[] = [];
  let bytesUploaded = 0;

  try {
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const chunk = file.slice(start, start + CHUNK_SIZE);

      // 2. Get presigned URL for this part
      const partPresignRes = await fetch(
        `${API_BASE}/api/uploads/multipart/presign-part`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, upload_id, part_number: partNumber }),
        },
      );
      if (!partPresignRes.ok) throw new Error(`Failed to get URL for part ${partNumber}`);
      const { url } = await partPresignRes.json();

      // 3. Upload chunk, collect ETag
      const etag = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            bytesUploaded += e.loaded;
            setUploadProgress(Math.round((bytesUploaded / file.size) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const etag = xhr.getResponseHeader("ETag") ?? "";
            resolve(etag.replace(/"/g, ""));
          } else {
            reject(new Error(`Part ${partNumber} upload failed`));
          }
        };
        xhr.onerror = () => reject(new Error(`Part ${partNumber} upload failed`));
        xhr.open("PUT", url);
        xhr.send(chunk);
      });

      parts.push({ PartNumber: partNumber, ETag: etag });
      // Reset bytesUploaded to chunk boundary for accuracy
      bytesUploaded = partNumber * CHUNK_SIZE;
      setUploadProgress(Math.round((Math.min(bytesUploaded, file.size) / file.size) * 100));
    }

    // 4. Complete
    const completeRes = await fetch(
      `${API_BASE}/api/uploads/multipart/complete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, upload_id, parts }),
      },
    );
    if (!completeRes.ok) throw new Error("Failed to complete multipart upload");

    return key;
  } catch (err) {
    // Abort the incomplete multipart upload to avoid orphaned parts on R2
    await fetch(`${API_BASE}/api/uploads/multipart/abort`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, upload_id }),
    }).catch(() => {});
    throw err;
  }
}
