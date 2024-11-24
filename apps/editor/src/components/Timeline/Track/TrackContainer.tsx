import React from 'react';
import { Track } from '@/types/track';
import { TrackItem } from './TrackItem';
import { useTimelineStore } from '@/store/timelineStore';
import { useTrackOperations } from '@/hooks/useTrackOperations';
import { pixelsToMilliseconds } from '@/utils/time';

interface TrackContainerProps {
  track: Track;
}

export const TrackContainer: React.FC<TrackContainerProps> = ({ track }) => {
  const zoom = useTimelineStore((state) => state.state.zoom);
  const { handleAddItem, handlePasteItem, hasCopiedItem } = useTrackOperations();

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.detail === 2) { // Double click
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickTime = Math.round(pixelsToMilliseconds(x, zoom));
      handleAddItem(track.id, clickTime);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'v' && hasCopiedItem) {
      const time = Math.round(pixelsToMilliseconds(0, zoom)); // Paste at start or cursor position
      handlePasteItem(track.id, time);
    }
  };

  return (
    <div 
      className="h-16 border-b border-gray-200 relative hover:bg-gray-50 transition-colors"
      onClick={handleTrackClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {track.items.map((item) => (
        <TrackItem
          key={item.id}
          item={item}
          zoom={zoom}
        />
      ))}
    </div>
  );
};