import { useRef, useState } from "react";
import UploadForm from "./components/UploadForm";
import HighlightsList from "./components/HighlightsList";
import type { Highlight } from "./types";

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Handball Highlight Generator</h1>

      <UploadForm
        onResult={setHighlights}
        onVideoSelected={(file) => {
          setVideoUrl(URL.createObjectURL(file));
        }}
      />

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          width={600}
          style={{ marginTop: 20 }}
        />
      )}

      <HighlightsList
        highlights={highlights}
        videoRef={videoRef}
      />
    </div>
  );
}
