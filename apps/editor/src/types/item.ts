export interface TimelineItem {
  id: string;
  startTime: number; // in milliseconds
  duration: number; // in milliseconds
  trackId: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
}

export type TimelineItemDragState = {
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  originalStartTime: number;
};

// Add this new interface for item operations
export interface ItemOperations {
  add: (trackId: string, time: number) => void;
  delete: (itemId: string) => void;
  copy: (itemId: string) => void;
  paste: (trackId: string, time: number) => void;
}