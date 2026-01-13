import type { Highlight } from "../types";
import type { RefObject } from "react";

interface Props {
  highlights: Highlight[];
  videoRef: RefObject<HTMLVideoElement>;
}



export default function HighlightsList({ highlights, videoRef }: Props) {
    function playClip(start: number, end: number) {
        const video = videoRef.current;
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
      {highlights.map((h, idx) => (
        <li
          key={idx}
          style={{ cursor: "pointer", marginBottom: 8 }}
          onClick={() => playClip(h.start, h.end)}
        >
          ▶ {h.formatted_start} → {h.formatted_end} (score {h.score})
        </li>
      ))}
    </ul>
  );
}
