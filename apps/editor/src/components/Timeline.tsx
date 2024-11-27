import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const MIN_TIME_DIVISIONS = 10;
  const TIME_SNAP = 500; // 500ms snap points
  const BASE_TIMELINE_WIDTH = 1000; // Base width in pixels
  const LABEL_WIDTH = 160; // Fixed width for labels in pixels

  // Calculate total timeline width based on zoom
  const getTimelineWidth = useCallback(() => {
    return BASE_TIMELINE_WIDTH * zoom;
  }, [zoom]);

  // Improved time to pixels conversion
  const timeToPixels = useCallback(
    (time: number) => {
      if (!animation?.duration) return 0;
      const timelineWidth = getTimelineWidth();
      return (time / animation.duration) * timelineWidth;
    },
    [animation?.duration, getTimelineWidth]
  );

  // Improved pixels to time conversion
  const pixelsToTime = useCallback(
    (pixels: number) => {
      if (!animation?.duration) return 0;
      const timelineWidth = getTimelineWidth();
      return (pixels / timelineWidth) * animation.duration;
    },
    [animation?.duration, getTimelineWidth]
  );

  // Improved ruler marks calculation
  const getRulerMarks = useCallback(() => {
    if (!animation?.duration) return [];

    // Calculate base number of divisions
    const baseDivisions = Math.max(
      MIN_TIME_DIVISIONS,
      Math.ceil(animation.duration / TIME_SNAP)
    );

    // Calculate step size
    const step = animation.duration / baseDivisions;
    
    // Generate marks based on zoom
    const marks: Array<{ time: number; position: number }> = [];
    let currentTime = 0;

    while (currentTime <= animation.duration) {
      marks.push({
        time: currentTime,
        position: (currentTime / animation.duration) * 100
      });
      currentTime += step;
    }

    return marks;
  }, [animation?.duration]);

  // Calculate time from mouse position
  const calculateTimeFromMousePosition = useCallback(
    (clientX: number) => {
      if (!timelineRef.current || !animation?.duration) return 0;

      const rect = timelineRef.current.getBoundingClientRect();
      const scrollOffset = timelineRef.current.scrollLeft;
      
      // Calculate x position relative to timeline
      const x = Math.max(0, clientX - rect.left - LABEL_WIDTH + scrollOffset);
      
      // Convert to time using pixelsToTime
      const time = pixelsToTime(x);
      
      return Math.max(0, Math.min(time, animation.duration));
    },
    [animation?.duration, pixelsToTime]
  );

  // Mouse event handlers
  const handleTimelineMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      
      setMouseDownTime(Date.now());
      const newTime = calculateTimeFromMousePosition(e.clientX);
      onSeek(newTime);
      setIsDragging(true);
      e.preventDefault();
    },
    [calculateTimeFromMousePosition, onSeek]
  );

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent) => {
      if (Date.now() - mouseDownTime < 200) {
        const newTime = calculateTimeFromMousePosition(e.clientX);
        onSeek(newTime);
        setIsDragging(false);
      }
    },
    [calculateTimeFromMousePosition, onSeek, mouseDownTime]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newTime = calculateTimeFromMousePosition(e.clientX);
      onSeek(newTime);
    },
    [isDragging, calculateTimeFromMousePosition, onSeek]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  // Mouse event effect
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.classList.add('select-none');
    } else {
      document.body.classList.remove('select-none');
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('select-none');
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Playhead height calculation
  const playheadHeight = useCallback(() => {
    const minHeight = 600;
    if (!animation?.animatables.length) return minHeight;
    return Math.max(minHeight, animation.animatables.length * 48 + 32);
  }, [animation?.animatables.length]);

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex-none p-4 space-x-2 flex items-center justify-between border-b border-gray-700/50">
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

          <Button
            onClick={onToggleRecording}
            className={`relative p-2 group/btn overflow-hidden rounded-md transition-all duration-200 ${
              isRecording
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-800 text-gray-400 hover:text-red-400'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <CircleDot
              className={`h-4 w-4 relative z-10 ${
                isRecording ? 'animate-pulse' : ''
              }`}
            />
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          {Math.round(currentTime)}ms / {Math.round(animation?.duration || 0)}ms
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        <div
          ref={timelineRef}
          className="absolute inset-0 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50"
          onMouseDown={handleTimelineMouseDown}
          onScroll={handleScroll}
        >
          {/* Time ruler */}
          <div className="sticky top-0 h-8 bg-gray-800/50 z-10 border-b border-gray-700/50">
            <div className="sticky left-0 min-w-[120px] max-w-[200px] w-40 h-full bg-gray-800/50 border-r border-gray-700/50" />

            <div
              className="absolute inset-y-0 left-40 right-0"
              style={{ width: `${getTimelineWidth()}px` }}
            >
              {getRulerMarks().map((mark, i) => (
                <React.Fragment key={i}>
                  {/* Main time mark */}
                  <div
                    className="absolute top-0 h-full border-l border-gray-700/30 flex items-center"
                    style={{ left: `${mark.position}%` }}
                  >
                    <span className="text-xs text-gray-400 ml-1">
                      {Math.round(mark.time)}ms
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div className="relative" style={{ width: `${getTimelineWidth()}px` }}>
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
                <div className="sticky left-0 bg-gray-800/50 min-w-[120px] max-w-[200px] w-40 h-full border-r border-gray-700/50 flex items-center px-2">
                  <span className="text-sm text-gray-400 truncate">
                    {animatable.id}
                  </span>
                </div>

                {/* Duration bar */}
                <div
                  className="absolute h-6 top-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded border border-blue-500/30 group-hover:border-blue-400/50 transition-colors"
                  style={{
                    left: `${LABEL_WIDTH}px`,
                    width: `${timeToPixels(animatable.duration)}px`,
                  }}
                />

                {/* Keyframes */}
                {animatable.keyframes.map((keyframe, index) => (
                  <div
                    key={index}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2 top-4 hover:scale-125 transition-transform"
                    style={{
                      left: `${LABEL_WIDTH + timeToPixels(keyframe.timestamp)}px`,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      // Implement keyframe dragging logic
                    }}
                  >
                    <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-sm bg-blue-400" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className={`fixed top-0 w-px bg-gradient-to-b from-blue-500 to-purple-500 z-20 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              left: `${LABEL_WIDTH + timeToPixels(currentTime) - scrollLeft}px`,
              height: `${playheadHeight()}px`,
            }}
          >
            <div className="absolute -top-1 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-grab active:cursor-grabbing">
              <div className="absolute -inset-1 rounded-full opacity-30 blur-sm bg-blue-400" />
            </div>
            <div className="absolute inset-0 w-px bg-blue-400 opacity-0 hover:opacity-50 transition-opacity" />
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