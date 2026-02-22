import { Range } from "react-range";
import type { EditedHighlights } from "../types";
import type { RefObject } from "react";

interface Props {
  highlights: EditedHighlights[];
  videoRef: RefObject<HTMLVideoElement | null>;
  videoDuration: number;
  updateHighlight: (uuid: string, start: number, end: number) => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

const EDIT_WINDOW = 60;

export default function HighlightsList({
  highlights,
  videoRef,
  videoDuration,
  updateHighlight,
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
      {highlights.map((highlight) => {
        const minBound = Math.max(0, highlight.originalStart - EDIT_WINDOW);

        const maxBound = Math.min(
          videoDuration,
          highlight.originalEnd + EDIT_WINDOW
        );
        return (
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
            <div style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  color: "black",
                }}
              >
                <span>{formatTime(minBound)}</span>→{" "}
                <span>{formatTime(maxBound)}</span>
              </div>
              <Range
                step={0.1}
                min={minBound}
                max={maxBound}
                values={[highlight.start, highlight.end]}
                onChange={([start, end]) =>
                  updateHighlight(highlight.id, start, end)
                }
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      height: "6px",
                      background: "#ddd",
                      borderRadius: "3px",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      height: "16px",
                      width: "16px",
                      backgroundColor: "#111",
                      borderRadius: "50%",
                    }}
                  />
                )}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
