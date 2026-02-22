export interface Highlight {
  id: string;
  start: number;
  end: number;
  score: number;
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
