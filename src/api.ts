const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadVideo(file: File) {
  const formData = new FormData();

  // Safe extension & MIME type
  const ext = file.name.includes('.') ? file.name.split(".").pop() : "mov";
  const mime = file.type || `video/${ext}`;
  const safeFile = new File([file], `upload.${ext}`, { type: mime });
  formData.append("video", safeFile);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = "Upload failed";

    if (contentType && contentType.includes("application/json")) {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } else {
      const text = await response.text();
      errorMessage = text.slice(0, 200);
    }

    throw new Error(errorMessage);
  }

  // Ensure JSON parsing is safe
  try {
    return await response.json();
  } catch {
    return {};
  }
}
