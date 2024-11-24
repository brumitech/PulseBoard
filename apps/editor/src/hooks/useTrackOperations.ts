import { useCallback, useState } from 'react';
import { useTimelineStore } from '@/store/timelineStore';
import { TimelineItem } from '@/types/item';

export const useTrackOperations = () => {
  const [copiedItem, setCopiedItem] = useState<TimelineItem | null>(null);
  const addItem = useTimelineStore(state => state.addItem);
  const removeItem = useTimelineStore(state => state.removeItem);

  const handleAddItem = useCallback((trackId: string, startTime: number) => {
    const newItem = {
      id: crypto.randomUUID(), // Using browser's UUID generator
      startTime,
      duration: 2000, // Default 2 seconds
      trackId,
      type: 'Widget 1',
      config: {},
      position: {
        x: 0,
        y: 0
      }
    };

    addItem(newItem);
  }, [addItem]);

  const handleDeleteItem = useCallback((itemId: string) => {
    removeItem(itemId);
  }, [removeItem]);

  const handleCopyItem = useCallback((item: TimelineItem) => {
    setCopiedItem(item);
  }, []);

  const handlePasteItem = useCallback((trackId: string, startTime: number) => {
    if (copiedItem) {
      const newItem = {
        ...copiedItem,
        id: crypto.randomUUID(),
        trackId,
        startTime,
      };
      addItem(newItem);
    }
  }, [copiedItem, addItem]);

  return {
    handleAddItem,
    handleDeleteItem,
    handleCopyItem,
    handlePasteItem,
    hasCopiedItem: !!copiedItem
  };
};