import { useState } from "react";
import { Play, Download, Flame } from "lucide-react";
import type { Highlight } from "../types";

interface HighlightCardProps {
  highlight: Highlight;
  index: number;
}

export function HighlightCard({ highlight, index }: HighlightCardProps) {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl">
      {/* Video Area */}
      <div className="relative aspect-video w-full bg-black">
        {!hasLoaded ? (
          <>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setHasLoaded(true)}
                className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 hover:bg-white/30"
              >
                <Play className="ml-1 size-7" />
              </button>
            </div>

            {/* Clip Number */}
            <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold tracking-wider text-white">
              #{String(index + 1).padStart(2, "0")}
            </div>
          </>
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

      {/* Card Info Section */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-orange-400">
            <Flame className="size-3" />
          </div>

          <a
            href={highlight.url}
            download={`handball-highlight-${index + 1}.mp4`}
            className="flex items-center gap-1 rounded-md bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
          >
            <Download className="size-3" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
``;
