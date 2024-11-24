import React from 'react';
import { calculateGridLines } from '@/utils/grid';
import { formatTime } from '@/utils/time';
import { useTimelineStore } from '@/store/timelineStore';

interface TimeGridProps {
  width: number;
  zoom: number;
  gridSize?: number;
}

export const TimeGrid: React.FC<TimeGridProps> = ({ width, zoom, gridSize = 100 }) => {
  const currentTime = useTimelineStore(state => state.state.currentTime);
  const gridLines = calculateGridLines(width, zoom, gridSize);

  return (
    <div className="relative h-8 border-b border-gray-200">
      {gridLines.map(({ position, time }) => (
        <div 
          key={position}
          className="absolute flex flex-col items-center"
          style={{ left: position }}
        >
          <div className="h-4 w-px bg-gray-300" />
          <span className="text-xs text-gray-600 mt-1">
            {formatTime(time)}
          </span>
        </div>
      ))}
      
      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
        style={{ left: (currentTime / 10) * zoom }}
      >
        <div className="w-3 h-3 bg-red-500 transform -translate-x-1/2 rounded-full" />
      </div>
    </div>
  );
};