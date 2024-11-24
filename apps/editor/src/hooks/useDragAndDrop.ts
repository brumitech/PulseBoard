import React, { useState, useCallback } from 'react';
import { TimelineItem } from '@/types/item';
import { useTimelineStore } from '@/store/timelineStore';
import { snapToGrid, pixelsToMilliseconds } from '@/utils/time';

interface DragState {
  isDragging: boolean;
  startX: number;
  originalStartTime: number;
  itemId: string;
}

export const useDragAndDrop = (item: TimelineItem) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const updateItem = useTimelineStore((state) => state.updateItem);
  const options = useTimelineStore((state) => state.options);
  const zoom = useTimelineStore((state) => state.state.zoom);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    setDragState({
      isDragging: true,
      startX: e.clientX,
      originalStartTime: item.startTime,
      itemId: item.id
    });
  }, [item]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragState) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaTime = pixelsToMilliseconds(deltaX, zoom);
    let newStartTime = dragState.originalStartTime + deltaTime;

    if (options.snapToGrid) {
      newStartTime = snapToGrid(newStartTime, options.gridSize);
    }

    newStartTime = Math.max(0, newStartTime);
    updateItem(dragState.itemId, { startTime: newStartTime });
  }, [dragState, zoom, options, updateItem]);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, []);

  React.useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragState, handleDragMove, handleDragEnd]);

  return {
    isDragging: !!dragState,
    handleDragStart
  };
};