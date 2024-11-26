import React, { useRef, useState, useCallback } from 'react';
import { IAnimation, IAnimatable, Keyframe } from '@pulseboard/shared';
import { Play, Pause, Square, RotateCw, CircleDot } from 'lucide-react';
import Button from './common/Button';

interface TimelinePanelProps {
  animation: IAnimation | null;
  currentTime: number;
  isPlaying: boolean;
  isRecording?: boolean;
  onSeek: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onToggleRecording?: () => void;
  selectedAnimatableId: string | null;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({
  animation,
  currentTime,
  isPlaying,
  isRecording,
  onSeek,
  onPlay,
  onPause,
  onStop,
  onToggleRecording,
  selectedAnimatableId,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const timeToPixels = useCallback((time: number) => {
    return (time / (animation?.duration || 1)) * (timelineRef.current?.clientWidth || 0) * zoom;
  }, [animation?.duration, zoom]);

  const pixelsToTime = useCallback((pixels: number) => {
    return (pixels / (timelineRef.current?.clientWidth || 1)) * (animation?.duration || 0) / zoom;
  }, [animation?.duration, zoom]);

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = pixelsToTime(x);
    onSeek(Math.max(0, Math.min(newTime, animation?.duration || 0)));
  }, [animation?.duration, pixelsToTime, onSeek]);

  const handleKeyframeMouseDown = (e: React.MouseEvent, keyframe: Keyframe<any>) => {
    e.stopPropagation();
    // Implement keyframe dragging logic
  };

  return (
    <div className="p-4 space-y-4">
      {/* Controls */}
      <div className="flex space-x-2">
        <Button
          size="icon"
          variant={isPlaying ? "secondary" : "default"}
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          onClick={onStop}
        >
          <Square size={16} />
        </Button>
        
        <Button
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          onClick={onToggleRecording}
        >
          <CircleDot size={16} />
        </Button>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="relative h-40 border rounded bg-gray-50"
        onClick={handleTimelineClick}
      >
        {/* Time ruler */}
        <div className="h-6 border-b relative">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full border-l text-xs"
              style={{
                left: `${(i / 10) * 100}%`,
              }}
            >
              {Math.round((i / 10) * (animation?.duration || 0))}ms
            </div>
          ))}
        </div>

        {/* Animatable tracks */}
        <div className="flex-1 overflow-y-auto">
          {animation?.animatables.map((animatable) => (
            <div
              key={animatable.id}
              className={`h-12 border-b relative ${
                animatable.id === selectedAnimatableId ? 'bg-blue-50' : ''
              }`}
            >
              {/* Animatable duration bar */}
              <div
                className="absolute h-8 top-2 bg-blue-200 rounded"
                style={{
                  left: timeToPixels(animatable.start),
                  width: timeToPixels(animatable.duration),
                }}
              />

              {/* Keyframes */}
              {animatable.keyframes.map((keyframe, index) => (
                <div
                  key={index}
                  className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2 top-4"
                  style={{
                    left: timeToPixels(keyframe.timestamp),
                  }}
                  onMouseDown={(e) => handleKeyframeMouseDown(e, keyframe)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-px bg-red-500"
          style={{
            left: timeToPixels(currentTime),
          }}
        />
      </div>

      {/* Zoom controls */}
      <div className="flex justify-end space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
        >
          -
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.min(4, zoom + 0.5))}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default TimelinePanel;