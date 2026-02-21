import { useRef, useState } from "react";
import UploadForm from "./components/UploadForm";
import HighlightsList from "./components/HighlightsList";
import type { Highlight } from "./types";

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  function adjustHighlightTime(
    uuid: string,
    startOffset: number,
    endOffset: number
  ) {
    setHighlights((prev) =>
      prev.map((highlight) => {
        if (highlight.id != uuid) return highlight;

        const newStart = Math.max(0, highlight.start + startOffset);
        const newEnd = highlight.end + endOffset;

        const validateEnd = Math.max(newStart + 1, newEnd);

        return {
          ...highlight,
          start: newStart,
          end: validateEnd,
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
          onResult={setHighlights}
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
            onAdjust={adjustHighlightTime}
          />
        </div>
      </div>
    </>
  );
}
