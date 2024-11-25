// apps/editor/src/components/Timeline.tsx
import { useRef } from 'react';
import { IAnimatable, Keyframe } from '@pulseboard/shared';

interface TimelineProps {
  duration: number;
  currentTime: number;
  animatables: IAnimatable<any, any>[];
  selectedAnimatableId: string | null;
  selectedKeyframeId: string | null;
  onTimeChange: (time: number) => void;
  onKeyframeSelect: (animatableId: string, keyframeId: string) => void;
  onAnimatableSelect: (id: string | null) => void;
  onAnimatableRemove: (id: string) => void;
}

const PIXELS_PER_SECOND = 200;
const TIMELINE_HEIGHT = 80;

export function Timeline({
  duration,
  currentTime,
  animatables,
  selectedAnimatableId,
  selectedKeyframeId,
  onTimeChange,
  onKeyframeSelect,
  onAnimatableSelect,
  onAnimatableRemove,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedTime = (x / PIXELS_PER_SECOND) * 1000;
    onTimeChange(Math.max(0, Math.min(clickedTime, duration)));
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Time Ruler */}
      <div 
        className="h-8 bg-gray-800 border-b border-gray-700 relative select-none"
        style={{ width: `${(duration / 1000) * PIXELS_PER_SECOND}px` }}
      >
        {Array.from({ length: Math.ceil(duration / 1000) + 1 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute bottom-0 border-l border-gray-600 h-3 text-xs text-gray-400"
            style={{ left: `${i * PIXELS_PER_SECOND}px` }}
          >
            {i}s
          </div>
        ))}
      </div>

      {/* Tracks */}
      <div 
        ref={timelineRef}
        className="flex-1 relative overflow-hidden"
        onClick={handleTimelineClick}
        style={{ width: `${(duration / 1000) * PIXELS_PER_SECOND}px` }}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
          style={{ left: `${(currentTime / duration) * ((duration / 1000) * PIXELS_PER_SECOND)}px` }}
        />

        {/* Animatable Tracks */}
        {animatables.map((animatable) => (
          <div 
            key={animatable.id}
            className={`
              h-[${TIMELINE_HEIGHT}px] relative group border-b border-gray-700
              ${selectedAnimatableId === animatable.id ? 'bg-gray-700' : 'bg-gray-800'}
              hover:bg-gray-700
            `}
            onClick={() => onAnimatableSelect(animatable.id)}
          >
            {/* Track Header */}
            <div className="absolute left-0 top-0 bottom-0 w-60 bg-gray-800 border-r border-gray-700 flex items-center px-4 justify-between z-10">
              <span className="font-medium text-gray-200">{animatable.id}</span>
              <button 
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnimatableRemove(animatable.id);
                }}
              >
                ×
              </button>
            </div>

            {/* Track Content */}
            <div className="ml-60 h-full relative">
              {/* Keyframes */}
              {animatable.keyframes.map((keyframe: Keyframe<any>, index) => (
                <button
                  key={index}
                  className={`
                    absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full 
                    transition-transform hover:scale-125
                    ${selectedKeyframeId === index.toString() ? 'ring-2 ring-white' : ''}
                    bg-blue-500 hover:bg-blue-400
                  `}
                  style={{ 
                    left: `${(keyframe.timestamp / duration) * 100}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onKeyframeSelect(animatable.id, index.toString());
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}