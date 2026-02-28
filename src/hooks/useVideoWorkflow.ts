import { useState, useCallback } from "react";
import { useVideoUpload } from "./useVideoUpload";
import { useProcessVideo } from "./useProcessVideo";

export function useVideoWorkflow() {
  const upload = useVideoUpload();
  const process = useProcessVideo();

  const [currentStep, setCurrentStep] = useState<
    "idle" | "uploading" | "processing" | "complete"
  >("idle");

  const runWorkflow = useCallback(
    async (file: File) => {
      // Step 1, Upload
      setCurrentStep("uploading");

      const key = await upload.uploadVideo(file);
      if (!key) {
        setCurrentStep("idle");
        return null;
      }

      // Step 2, Process Video
      setCurrentStep("processing");
      const highlights = await process.processVideo(key);

      if (highlights) {
        setCurrentStep("complete");
      } else {
        setCurrentStep("idle");
      }

      return highlights;
    },
    [upload, process]
  );

  const reset = useCallback(() => {
    upload.reset();
    process.reset();
    setCurrentStep("idle");
  }, [upload, process]);

  return {
    runWorkflow,
    currentStep,
    uploadProgress: upload.uploadProgress,
    isUploading: upload.isUploading,
    isProcessing: process.isProcessing,
    error: upload.error || process.error,
    reset,
  };
}
