import { HighlightCard } from "./HighlightCard";
import type { Highlight } from "../types";

interface Props {
  highlights: Highlight[];
}
export function HighlightGrid({ highlights }: Props) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-bold uppercase tracking-wider text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Highlights
          </h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight, i) => (
          <HighlightCard key={highlight.id} highlight={highlight} index={i} />
        ))}
      </div>
    </div>
  );
}
