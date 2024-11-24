import React from 'react';
import { formatTime } from '@/utils/time';

interface TimeMarkerProps {
  time: number;
  position: number;
}

export const TimeMarker: React.FC<TimeMarkerProps> = ({ time, position }) => {
  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ left: position }}
    >
      <div className="h-4 w-px bg-gray-300" />
      <span className="text-xs text-gray-600 mt-1">
        {formatTime(time)}
      </span>
    </div>
  );
};