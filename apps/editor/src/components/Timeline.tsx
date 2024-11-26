import React, { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { IAnimatable } from '@pulseboard/shared';

interface TimelineProps {
  duration: number;
  currentTime: number;
  animatables: IAnimatable<any, any>[];
  selectedAnimatableId: string | null;
  selectedKeyframeId: string | null;
  onTimeChange: (time: number) => void;
  onKeyframeSelect: (animatableId: string, keyframeId: string | null) => void;
  onAnimatableSelect: (id: string | null) => void;
  onAnimatableRemove: (id: string) => void;
  onAnimatableUpdate: (id: string, updates: Partial<IAnimatable<any, any>>) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  animatables,
  selectedAnimatableId,
  selectedKeyframeId,
  onTimeChange,
  onKeyframeSelect,
  onAnimatableSelect,
  onAnimatableRemove,
  onAnimatableUpdate,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingCursor, setIsDraggingCursor] = useState(false);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
  const [draggedAnimatable, setDraggedAnimatable] = useState<string | null>(null);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragOverTrash, setDragOverTrash] = useState(false);

  const timeToX = (time: number): number => {
    if (!timelineRef.current) return 0;
    return (time / duration) * timelineRef.current.clientWidth;
  };

  const xToTime = (x: number): number => {
    if (!timelineRef.current) return 0;
    return Math.max(0, Math.min(duration, (x / timelineRef.current.clientWidth) * duration));
  };

  const handleAnimatableDragStart = (e: React.DragEvent, animatable: IAnimatable<any, any>) => {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggedAnimatable(animatable.id);
    setDragStartX(e.clientX - rect.left);
    setDragStartTime(animatable.start);
    
    e.dataTransfer.setData('animatable-id', animatable.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAnimatableDragEnd = () => {
    setDraggedAnimatable(null);
    setDragOverTrash(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedAnimatable || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const deltaX = x - dragStartX;
    const deltaTime = xToTime(deltaX);
    
    const animatable = animatables.find(a => a.id === draggedAnimatable);
    if (!animatable) return;

    const newStart = Math.max(0, dragStartTime + deltaTime);
    if (newStart !== animatable.start) {
      onAnimatableUpdate(draggedAnimatable, { start: newStart });
    }
  };

  const handleTrashDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedAnimatable) {
      setDragOverTrash(true);
    }
  };

  const handleTrashDragLeave = () => {
    setDragOverTrash(false);
  };

  const handleTrashDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const animatableId = e.dataTransfer.getData('animatable-id');
    if (animatableId) {
      onAnimatableRemove(animatableId);
    }
    setDragOverTrash(false);
  };
  
  // Handle cursor drag
  const handleCursorMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingCursor(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingCursor || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    onTimeChange((x / rect.width) * duration);
  };

  const handleMouseUp = () => {
    setIsDraggingCursor(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || isDraggingItem) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onTimeChange((x / rect.width) * duration);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);



  // Generate time markers
  const timeMarkers = [];
  const markerInterval = 1; // 1 second intervals
  for (let i = 0; i <= duration / 1000; i += markerInterval) {
    timeMarkers.push(
      <div
        key={i}
        className="absolute h-3 border-l border-gray-400"
        style={{ left: `${(i * 1000 * 100) / duration}%` }}
      >
        <div className="text-xs text-gray-400 mt-3">{i}s</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Ruler */}
      <div className="h-8 relative bg-gray-800 border-b border-gray-700">
        {timeMarkers}
      </div>
  
      {/* Tracks */}
      <div className="flex-1 relative overflow-y-auto">
        <div
          ref={timelineRef}
          className="relative h-full min-h-[200px]"
          onClick={handleTimelineClick}
          onDragOver={handleDragOver}
        >
          {/* Delete zone */}
          <div
            className={`absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded transition-colors ${
              dragOverTrash ? 'bg-red-500' : 'bg-red-500/20'
            } border-2 ${
              dragOverTrash ? 'border-red-300' : 'border-red-500/50'
            }`}
            onDragEnter={handleTrashDragEnter}
            onDragLeave={handleTrashDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleTrashDrop}
          >
            <Trash2 className={`${dragOverTrash ? 'text-white' : 'text-red-500'}`} size={20} />
          </div>
  
          {/* Animatables */}
          {animatables.map((animatable, index) => (
            <div
              key={animatable.id}
              draggable
              onDragStart={(e) => handleAnimatableDragStart(e, animatable)}
              onDragEnd={handleAnimatableDragEnd}
              className={`absolute h-12 rounded cursor-pointer ${
                selectedAnimatableId === animatable.id
                  ? 'bg-blue-500'
                  : 'bg-blue-400'
              } ${draggedAnimatable === animatable.id ? 'opacity-50' : ''}`}
              style={{
                left: `${(animatable.start * 100) / duration}%`,
                width: `${(animatable.duration * 100) / duration}%`,
                top: `${index * 60 + 10}px`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAnimatableSelect(animatable.id);
                onKeyframeSelect(animatable.id, '0');  // Select first keyframe by default
              }}
            >
              <div className="px-2 py-1 text-sm text-white truncate">
                {animatable.id}
              </div>
  
              {/* Keyframes */}
              {animatable.keyframes.map((keyframe, kfIndex) => (
                <div
                  key={kfIndex}
                  className={`absolute w-3 h-3 rounded-full -bottom-1.5 ${
                    selectedKeyframeId === kfIndex.toString() &&
                    selectedAnimatableId === animatable.id
                      ? 'bg-yellow-300'
                      : 'bg-yellow-500'
                  } hover:scale-125 transition-transform`}
                  style={{
                    left: `${(keyframe.timestamp * 100) / animatable.duration}%`,
                    transform: 'translateX(-50%)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onKeyframeSelect(animatable.id, kfIndex.toString());
                  }}
                />
              ))}
            </div>
          ))}
  
          {/* Current time indicator with draggable cursor */}
          <div
            className="absolute top-0 bottom-0 flex items-center cursor-ew-resize group"
            style={{ left: `${(currentTime * 100) / duration}%` }}
            onMouseDown={handleCursorMouseDown}
          >
            {/* Cursor line */}
            <div className="w-0.5 h-full bg-white group-hover:bg-blue-500" />
            
            {/* Cursor handle */}
            <div className="absolute top-0 -translate-x-1/2 w-4 h-4 bg-white rounded-full group-hover:bg-blue-500 group-hover:scale-110 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};