import { useState } from "react";
import { Play } from "lucide-react";
import type { Highlight } from "../types";

interface HighlightCardProps {
  highlight: Highlight;
  index: number;
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div className="relative aspect-video w-full bg-black">
      {!hasLoaded ? (
        // Thumbnail UI
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => {
              setHasLoaded(true);
            }}
            className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Play className="ml-1 size-6" />
          </button>
        </div>
      ) : (
        <video
          src={highlight.url}
          className="h-full w-full object-cover"
          controls
          autoPlay
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}
