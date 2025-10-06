// types/viewer.ts
export interface RendererProps {
  response: string;
  index: number;
}

export type ViewMode = "pretty" | "raw" | "json";
