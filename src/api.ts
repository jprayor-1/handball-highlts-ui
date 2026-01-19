const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function presignUpload(file: File) {
  const res = await fetch(`${API_BASE}/api/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      filesize: file.size,
      content_type: file.type,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data; // { key, url }
}

export function uploadToR2(
  file: File,
  url: string,
  onProgress: (pct: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error("Upload failed"));
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export async function startProcessing(key: string) {
  const res = await fetch(`${API_BASE}/api/process_video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data; // { highlights }
}
