export function HandballStickFigureAnimation() {
  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      {/* Court */}
      <div className="absolute bottom-0 w-full h-1 bg-gray-400" />

      {/* Net */}
      <div className="absolute left-1/2 bottom-0 w-1 h-32 bg-gray-600 transform -translate-x-1/2" />

      {/* Player 1 (left side) */}
      <div className="absolute bottom-8 left-1/4 animate-jump">
        <StickFigure className="text-blue-600" />
      </div>

      {/* Player 2 (right side) */}
      <div className="absolute bottom-8 right-1/4 animate-jump-delayed">
        <StickFigure className="text-red-600" />
      </div>

      {/* Ball */}
      <div className="absolute animate-ball">
        <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg" />
      </div>

      <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium">
        Analyzing your highlights...
      </p>
    </div>
  );
}

function StickFigure({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 40 60"
      className={className}
      fill="currentColor"
    >
      {/* Head */}
      <circle cx="20" cy="10" r="8" />

      {/* Body */}
      <line
        x1="20"
        y1="18"
        x2="20"
        y2="38"
        stroke="currentColor"
        strokeWidth="3"
      />

      {/* Left arm (raised) */}
      <line
        x1="20"
        y1="22"
        x2="8"
        y2="15"
        stroke="currentColor"
        strokeWidth="3"
      />

      {/* Right arm */}
      <line
        x1="20"
        y1="22"
        x2="32"
        y2="28"
        stroke="currentColor"
        strokeWidth="3"
      />

      {/* Left leg */}
      <line
        x1="20"
        y1="38"
        x2="12"
        y2="55"
        stroke="currentColor"
        strokeWidth="3"
      />

      {/* Right leg */}
      <line
        x1="20"
        y1="38"
        x2="28"
        y2="55"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
