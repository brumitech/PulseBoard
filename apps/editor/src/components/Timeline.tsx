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
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              onClick={isPlaying ? onPause : onPlay}
              className={`relative p-2 group/btn overflow-hidden rounded-md transition-all duration-200 ${
                isPlaying 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-gray-800 text-gray-400 hover:text-blue-400'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              {isPlaying ? (
                <Pause className="h-4 w-4 relative z-10" />
              ) : (
                <Play className="h-4 w-4 relative z-10" />
              )}
            </Button>
  
            <Button
              onClick={onStop}
              className="relative p-2 group/btn overflow-hidden rounded-md transition-all duration-200 bg-gray-800 text-gray-400 hover:text-blue-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <Square className="h-4 w-4 relative z-10" />
            </Button>
  
            {onToggleRecording && (
              <Button
                onClick={onToggleRecording}
                className={`relative p-2 group/btn overflow-hidden rounded-md transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-gray-800 text-gray-400 hover:text-red-400'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <CircleDot className="h-4 w-4 relative z-10" />
              </Button>
            )}
          </div>
  
          <div className="text-sm text-gray-400">
            {Math.round(currentTime)}ms / {Math.round(animation?.duration || 0)}ms
          </div>
        </div>
  
        {/* Timeline */}
        <div className="relative">
          <div
            ref={timelineRef}
            className="relative h-[calc(100%-2rem)] border border-gray-700/50 rounded-lg bg-gray-900/50 backdrop-blur-sm overflow-hidden"
            onClick={handleTimelineClick}
          >
            {/* Time ruler */}
            <div className="h-8 border-b border-gray-700/50 relative bg-gray-800/50">
              {Array.from({ length: Math.ceil((animation?.duration || 0) / 1000) * zoom }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-gray-700/30 flex items-center"
                  style={{
                    left: `${(i / zoom) * 100}%`,
                  }}
                >
                  <span className="text-xs text-gray-400 ml-1">
                    {Math.round((i * 1000) / zoom)}ms
                  </span>
                </div>
              ))}
            </div>
  
            {/* Tracks */}
            <div className="flex-1 overflow-y-auto">
              {animation?.animatables.map((animatable) => (
                <div
                  key={animatable.id}
                  className={`group h-12 border-b border-gray-700/50 relative ${
                    animatable.id === selectedAnimatableId 
                      ? 'bg-blue-900/20' 
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  {/* Track label */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {animatable.id}
                  </div>
  
                  {/* Duration bar */}
                  <div
                    className="absolute h-6 top-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded border border-blue-500/30 group-hover:border-blue-400/50 transition-colors"
                    style={{
                      left: timeToPixels(animatable.start),
                      width: timeToPixels(animatable.duration),
                    }}
                  />
  
                  {/* Keyframes */}
                  {animatable.keyframes.map((keyframe, index) => (
                    <div
                      key={index}
                      className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2 top-4 hover:scale-125 transition-transform"
                      style={{
                        left: timeToPixels(keyframe.timestamp),
                      }}
                      onMouseDown={(e) => handleKeyframeMouseDown(e, keyframe)}
                    >
                      <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-sm bg-blue-400" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
  
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-purple-500 z-10"
              style={{
                left: timeToPixels(currentTime),
              }}
            >
              <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full">
                <div className="absolute -inset-1 rounded-full opacity-30 blur-sm bg-blue-400" />
              </div>
            </div>
          </div>
  
          {/* Zoom controls */}
          <div className="absolute right-2 bottom-2 flex space-x-1">
            <Button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
              className="relative p-1.5 group/btn overflow-hidden rounded-md transition-all duration-200 bg-gray-800/80 text-gray-400 hover:text-blue-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <span className="relative z-10 text-sm">-</span>
            </Button>
            <Button
              onClick={() => setZoom(Math.min(4, zoom + 0.5))}
              className="relative p-1.5 group/btn overflow-hidden rounded-md transition-all duration-200 bg-gray-800/80 text-gray-400 hover:text-blue-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <span className="relative z-10 text-sm">+</span>
            </Button>
          </div>
        </div>
      </div>
    );
};

export default TimelinePanel;