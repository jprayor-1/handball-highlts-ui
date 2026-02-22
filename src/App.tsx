import { useRef, useState } from "react";
import UploadForm from "./components/UploadForm";
import HighlightsList from "./components/HighlightsList";
import type { EditedHighlights } from "./types";

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [highlights, setHighlights] = useState<EditedHighlights[]>([]);

  function updateHighlight(id: string, newStart: number, newEnd: number) {
    setHighlights((prev) =>
      prev.map((highlight) => {
        if (highlight.id !== id) return highlight;

        const clampedStart = Math.max(0, newStart);
        const clampedEnd = Math.max(clampedStart + 0.1, newEnd);

        return {
          ...highlight,
          start: clampedStart,
          end: clampedEnd,
        };
      })
    );
  }

  return (
    <>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(20px, 5vw, 40px) 20px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)" }}>
          Handball Highlight Generator
        </h1>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Upload your game. Instantly detect the best rallies.
        </p>

        <UploadForm
          setHighlights={setHighlights}
          onVideoSelected={(file) => {
            setVideoUrl(URL.createObjectURL(file));
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setVideoDuration(videoRef.current.duration);
              }
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              position: "sticky",
              width: "100%",
              top: 10,
              maxWidth: 800,
              marginBottom: 10,
            }}
          />
        )}

        <div
          style={{
            width: "100%",
            maxWidth: 800,
            overflowY: "auto",
            flex: 1,
            marginTop: 20,
            paddingRight: 8,
          }}
        >
          <HighlightsList
            highlights={highlights}
            videoRef={videoRef}
            videoDuration={videoDuration}
            updateHighlight={updateHighlight}
          />
        </div>
      </div>
    </>
  );
}
