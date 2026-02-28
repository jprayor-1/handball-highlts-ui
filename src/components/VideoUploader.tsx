import { useCallback, useState } from "react";
import { Upload, Film, X } from "lucide-react";
import { Button } from "./UI/Button";

interface Props {
  onVideoSelect: (file: File) => void;
  selectedVideo: File | null;
  onClear: () => void;
}

export function VideoUploader({
  onVideoSelect,
  selectedVideo,
  onClear,
}: Props) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        onVideoSelect(file);
      }
    },
    [onVideoSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onVideoSelect(file);
      }
    },
    [onVideoSelect]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";

    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";

    return (bytes / 1024).toFixed(1) + "KB";
  };

  if (selectedVideo) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Film className="size-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedVideo.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedVideo.size)}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="icon"
            onClick={onClear}
            aria-label="Remove video"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 transition-colors ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-muted-foreground/50"
      }`}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
        <Upload className="size-7 text-muted-foreground" />
      </div>
      <p className="mt-4 text-center text-base font-medium text-foreground">
        Drop your game footage here
      </p>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        MP4, MOV, or WebM up to 1GB
      </p>
      <label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          className="sr-only"
        />
        <span className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Film className="size-4" />
          Choose Video
        </span>
      </label>
    </div>
  );
}
