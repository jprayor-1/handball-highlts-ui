export interface Highlight {
  id: string;
  start: number;
  end: number;
  url: string;
}
export interface HighlightResponse {
  highlights: Highlight[];
}

export interface EditedHighlights {
  id: string;
  start: number;
  end: number;
  score: number;
  originalStart: number;
  originalEnd: number;
}

export interface ClippedHighlightsResponse {
  key: string;
  highlihts: string[];
}
