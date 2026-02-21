export interface Highlight {
    id: string;
    start: number;
    end: number;
    score: number;
  }
export interface HighlightResponse {
    highlights: Highlight[];
  }