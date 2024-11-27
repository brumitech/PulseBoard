import { CSSProperties } from 'react';
import { DragState, ResizeDirection } from './types';

export const RESIZE_HANDLES = [
  { direction: 'top-left' as const, cursor: 'nwse-resize' },
  { direction: 'top-right' as const, cursor: 'nesw-resize' },
  { direction: 'bottom-left' as const, cursor: 'nesw-resize' },
  { direction: 'bottom-right' as const, cursor: 'nwse-resize' },
  { direction: 'middle-right' as const, cursor: 'ew-resize' },
  { direction: 'middle-bottom' as const, cursor: 'ns-resize' },
];

export function getHandlePosition(direction: ResizeDirection): CSSProperties {
  switch (direction) {
    case 'top-left':
      return { top: 0, left: 0, transform: 'translate(-50%, -50%)' };
    case 'top-right':
      return { top: 0, right: 0, transform: 'translate(50%, -50%)' };
    case 'bottom-left':
      return { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' };
    case 'bottom-right':
      return { bottom: 0, right: 0, transform: 'translate(50%, 50%)' };
    case 'middle-right':
      return { top: '50%', right: 0, transform: 'translate(50%, -50%)' };
    case 'middle-bottom':
      return { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' };
  }
}

export function calculateNewDimensions(
  dragState: DragState,
  deltaX: number,
  deltaY: number,
  direction: ResizeDirection,
  maxWidth: number,
  maxHeight: number
) {
  let newWidth = dragState.startWidth;
  let newHeight = dragState.startHeight;
  let newX = dragState.startPosX;
  let newY = dragState.startPosY;

  const MIN_SIZE = 10;

  switch (direction) {
    case 'bottom-right':
      newWidth = Math.min(maxWidth - newX, dragState.startWidth + deltaX);
      newHeight = Math.min(maxHeight - newY, dragState.startHeight + deltaY);
      break;
    case 'top-right':
      newWidth = Math.min(maxWidth - newX, dragState.startWidth + deltaX);
      newHeight = Math.max(MIN_SIZE, dragState.startHeight - deltaY);
      newY = Math.min(dragState.startPosY + deltaY, dragState.startPosY + dragState.startHeight - MIN_SIZE);
      break;
    case 'bottom-left':
      newWidth = Math.max(MIN_SIZE, dragState.startWidth - deltaX);
      newHeight = Math.min(maxHeight - newY, dragState.startHeight + deltaY);
      newX = Math.min(dragState.startPosX + deltaX, dragState.startPosX + dragState.startWidth - MIN_SIZE);
      break;
    case 'top-left':
      newWidth = Math.max(MIN_SIZE, dragState.startWidth - deltaX);
      newHeight = Math.max(MIN_SIZE, dragState.startHeight - deltaY);
      newX = Math.min(dragState.startPosX + deltaX, dragState.startPosX + dragState.startWidth - MIN_SIZE);
      newY = Math.min(dragState.startPosY + deltaY, dragState.startPosY + dragState.startHeight - MIN_SIZE);
      break;
    case 'middle-right':
      newWidth = Math.min(maxWidth - newX, dragState.startWidth + deltaX);
      break;
    case 'middle-bottom':
      newHeight = Math.min(maxHeight - newY, dragState.startHeight + deltaY);
      break;
  }

  // Ensure dimensions stay within bounds
  newWidth = Math.max(MIN_SIZE, Math.min(newWidth, maxWidth - newX));
  newHeight = Math.max(MIN_SIZE, Math.min(newHeight, maxHeight - newY));
  newX = Math.max(0, Math.min(newX, maxWidth - newWidth));
  newY = Math.max(0, Math.min(newY, maxHeight - newHeight));

  return { newWidth, newHeight, newX, newY };
}