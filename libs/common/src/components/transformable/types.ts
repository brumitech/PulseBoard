export type ResizeDirection = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'middle-right' 
  | 'middle-bottom';

export interface DragState {
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
  startWidth: number;
  startHeight: number;
  offsetX: number;
  offsetY: number;
}

export interface ResizeHandleProps {
  direction: ResizeDirection;
  cursor: string;
  onMouseDown: (e: React.MouseEvent) => void;
}