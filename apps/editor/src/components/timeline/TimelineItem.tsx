// apps/editor/src/components/TimelineItem.tsx
import React from 'react';
import { TimelineItem as TimelineItemType } from '@pulseboard/shared';

interface TimelineItemProps {
  item: TimelineItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  maxDuration: number; // Used to calculate relative widths
}
export const TimelineItem: React.FC<TimelineItemProps> = ({
    item,
    isSelected,
    onSelect,
    maxDuration
  }) => {
    const widthPercentage = (item.duration / maxDuration) * 100;
  
    return (
      <div 
        className={`
          rounded-lg border-2 transition-all cursor-pointer
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
        `}
        onClick={() => onSelect(item.id)}
      >
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{item.widgetType.toUpperCase()}</span>
              <span className="text-sm text-gray-500">{item.duration}ms</span>
            </div>
            <div className="text-sm text-gray-500">
              {item.keyframes.length} keyframes
            </div>
          </div>
  
          {/* Timeline Bar */}
          <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
            <div 
              className="absolute h-full bg-blue-200"
              style={{ width: `${widthPercentage}%` }}
            />
            
            {/* Keyframe Markers */}
            {item.keyframes.map((keyframe, index) => {
              const position = (keyframe.timestamp / item.duration) * 100;
              return (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${position}%`,
                    top: '50%',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };