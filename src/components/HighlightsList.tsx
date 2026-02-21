import type { Highlight } from "../types";
import type { RefObject } from "react";

interface Props {
  highlights: Highlight[];
  videoRef: RefObject<HTMLVideoElement | null>;
  onAdjust: (uuid: string, startOffset: number, endOffset: number) => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function HighlightsList({
  highlights,
  videoRef,
  onAdjust,
}: Props) {
  function playClip(start: number, end: number) {
    const video = videoRef && videoRef.current;
    if (!video) return;

    video.currentTime = start;
    video.play();

    const stopAtEnd = () => {
      if (video.currentTime >= end) {
        video.pause();
        video.removeEventListener("timeupdate", stopAtEnd);
      }
    };

    video.addEventListener("timeupdate", stopAtEnd);
  }

  return (
    <ul style={{ marginTop: 20 }}>
      {highlights.map((highlight) => (
        <li
          key={highlight.id}
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: "16px",
          }}
          onClick={() => playClip(highlight.start, highlight.end)}
        >
          <div style={{ display: "flex" }}>
            <button
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                marginRight: "8px",
              }}
              onClick={() => onAdjust(highlight.id, -2, 0)}
            >
              -2 Second Before
            </button>
            <button
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                marginRight: "8px",
              }}
              onClick={() => onAdjust(highlight.id, 0, 2)}
            >
              2 Second After
            </button>
          </div>
          ▶ {formatTime(highlight.start)}→ {formatTime(highlight.end)}
        </li>
      ))}
    </ul>
  );
}
