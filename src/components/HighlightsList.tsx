import type { Highlight } from "../types";
import type { RefObject } from "react";

interface Props {
  highlights: Highlight[];
  videoRef: RefObject<HTMLVideoElement | null>;
  onAdjust: (uuid: string, startOffset: number, endOffset: number) => void
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function HighlightsList({ highlights, videoRef, onAdjust }: Props) {
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
      {highlights.map((h) => (
        <li
          key={h.id}
          style={{ cursor: "pointer", marginBottom: 8 }}
          onClick={() => playClip(h.start, h.end)}
        >
          <div style={{display: "flex"}}>
            <button onClick={() => onAdjust(h.id, -2, 0)}>-2 Second Before</button>
            <button onClick={() => onAdjust(h.id, 0, 2)}>2 Second After</button>
          </div>
          
          ▶ {formatTime(h.start)}→ {formatTime(h.end)}
        </li>
      ))}
    </ul>
  );
}
