const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadVideo(file: File) {
  // Optional but smart: guardrail for serverless limits
  if (file.size > 200 * 1024 * 1024) {
    throw new Error("Video is too large");
  }

  const formData = new FormData();

  // Derive a safe extension
  const originalExt = file.name.split(".").pop()?.toLowerCase();
  const ext =
    originalExt && /^[a-z0-9]+$/.test(originalExt)
      ? originalExt
      : "mp4";

  // Always use a generated ASCII filename (iOS-safe)
  const safeFilename = `upload-${Date.now()}.${ext}`;

  // IMPORTANT: pass filename here — do NOT trust file.name
  formData.append("video", file, safeFilename);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = "Upload failed";

    if (contentType?.includes("application/json")) {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } else {
      errorMessage = (await response.text()).slice(0, 200);
    }

    throw new Error(errorMessage);
  }

  // Safe JSON parsing
  try {
    return await response.json();
  } catch {
    return {};
  }
}
