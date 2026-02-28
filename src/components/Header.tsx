import { Flame } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1
              className="text-lg font-bold uppercase tracking-wider text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hand Ball Highlights
            </h1>
            <p className="uppercase tracking-widest text-muted-foreground">
              NYC
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <span className="text-lg font-medium text-foreground">Generator</span>
          <span className="text-lg text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
            My Highlights
          </span>
          <span className="text-lg text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
            About
          </span>
        </nav>
      </div>
    </header>
  );
}
