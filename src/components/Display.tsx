import { useCallback, useState } from "react";
import { ErrorPage } from "./ErrorPage";
import { VideoUploader } from "./VideoUploader";
import { Button } from "./UI/Button";
import { LoadingPage } from "./LoadingPage";
import { Sparkles } from "lucide-react";
import { HighlightGrid } from "./HighlightGrid";
import { useVideoWorkflow } from "../hooks/useVideoWorkflow";

export function Display() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [email, setEmail] = useState("");

  const { runWorkflow, highlights, error, isProcessing, isUploading, reset } =
    useVideoWorkflow();

  const handleVideoSelect = useCallback((file: File) => {
    setSelectedVideo(file);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedVideo(null);
    reset();
  }, [reset]);

  if (highlights.length > 0) {
    return <HighlightGrid highlights={highlights} />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2
            className="text-5xl font-black uppercase tracking-wider text-foreground sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Turn Your Game
            <br />
            <span className="text-primary">Into Highlights</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Upload your hand ball footage and we{"'"}ll try to find the best
            moments automatically.
          </p>
        </div>
        {isProcessing || isUploading ? (
          <LoadingPage isProcessing={isProcessing} isUploading={isUploading} />
        ) : (
          <>
            <VideoUploader
              onVideoSelect={handleVideoSelect}
              selectedVideo={selectedVideo}
              onClear={handleClear}
            />

            {selectedVideo && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Email for notification{" "}
                    <span className="text-muted-foreground/60">(optional — recommended for large files)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={() => runWorkflow(selectedVideo, email || undefined)}
                    className="gap-2 text-sm font-semibold uppercase tracking-wider"
                  >
                    <Sparkles className="size-4" />
                    Generate Highlights
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* How it works */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Upload",
              desc: "Drop in your full game video from any device or camera.",
            },
            {
              step: "02",
              title: "Analyze",
              desc: "We scans for rallies, aces, trick shots, and clutch moments.",
            },
            {
              step: "03",
              title: "Highlights",
              desc: "Get individually clipped highlights ready to download and share.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <span
                className="text-4xl font-black text-primary/60"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.step}
              </span>
              <h3
                className="mt-1 text-lg font-bold uppercase tracking-wider text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
