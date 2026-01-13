export interface Highlight {
    start: number;
    end: number;
    score: number;
    formatted_start: string;
    formatted_end: string;
  }
export interface HighlightResponse {
    highlights: Highlight[];
  }