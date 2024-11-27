import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Play, Pause, Square} from 'lucide-react';
import { useAnimationContext, usePlayerContext, Button } from '@pulseboard/common';

const TimelinePanel: React.FC = () => {
  const { 
    animation, 
    currentTime, 
  } = useAnimationContext();

  const { 
    isPlaying, 
    play, 
    pause, 
    stop, 
    seekTo 
  } = usePlayerContext();

  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const MIN_TIME_DIVISIONS = 10;
  const TIME_SNAP = 500; // Snap points in ms
  const BASE_TIMELINE_WIDTH = 1000; // Base timeline width in pixels
  const LABEL_WIDTH = 160; // Width for labels in pixels

  // Calculate timeline width based on zoom
  const getTimelineWidth = useCallback(() => BASE_TIMELINE_WIDTH * zoom, [zoom]);

  const timeToPixels = useCallback(
    (time: number) => {
      if (!animation?.duration) return 0;
      return (time / animation.duration) * getTimelineWidth();
    },
    [animation?.duration, getTimelineWidth]
  );

  const pixelsToTime = useCallback(
    (pixels: number) => {
      if (!animation?.duration) return 0;
      return (pixels / getTimelineWidth()) * animation.duration;
    },
    [animation?.duration, getTimelineWidth]
  );

  const getRulerMarks = useCallback(() => {
    if (!animation?.duration) return [];
    const baseDivisions = Math.max(
      MIN_TIME_DIVISIONS,
      Math.ceil(animation.duration / TIME_SNAP)
    );
    const step = animation.duration / baseDivisions;

    const marks = [];
    for (let time = 0; time <= animation.duration; time += step) {
      marks.push({ time, position: (time / animation.duration) * 100 });
    }

    return marks;
  }, [animation?.duration]);

  const calculateTimeFromMousePosition = useCallback(
    (clientX: number) => {
      if (!timelineRef.current || !animation?.duration) return 0;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = clientX - rect.left - LABEL_WIDTH + timelineRef.current.scrollLeft;
      return Math.max(0, Math.min(pixelsToTime(x), animation.duration));
    },
    [animation?.duration, pixelsToTime]
  );

  const handleTimelineMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setMouseDownTime(Date.now());
      seekTo(calculateTimeFromMousePosition(e.clientX));
      setIsDragging(true);
      e.preventDefault();
    },
    [calculateTimeFromMousePosition, seekTo]
  );

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent) => {
      if (Date.now() - mouseDownTime < 200) {
        seekTo(calculateTimeFromMousePosition(e.clientX));
        setIsDragging(false);
      }
    },
    [calculateTimeFromMousePosition, seekTo, mouseDownTime]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      seekTo(calculateTimeFromMousePosition(e.clientX));
    },
    [isDragging, calculateTimeFromMousePosition, seekTo]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

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

  const playheadHeight = useCallback(() => {
    const minHeight = 600;
    return animation?.animatables.length
      ? Math.max(minHeight, animation.animatables.length * 48 + 32)
      : minHeight;
  }, [animation?.animatables.length]);

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex-none p-4 space-x-2 flex items-center justify-between border-b border-gray-700/50">
        <div className="flex space-x-2">
          <Button
            onClick={isPlaying ? pause : play}
            className={`p-2 rounded-md ${isPlaying ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button onClick={stop} className="p-2 rounded-md bg-gray-800 text-gray-400">
            <Square className="h-4 w-4" />
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
          className="absolute inset-0 overflow-y-auto overflow-x-auto"
          onMouseDown={handleTimelineMouseDown}
          onScroll={handleScroll}
        >
          {/* Time ruler */}
          <div className="sticky top-0 h-8 bg-gray-800">
            <div className="absolute" style={{ width: `${getTimelineWidth()}px` }}>
              {getRulerMarks().map((mark, index) => (
                <div
                  key={index}
                  className="absolute text-xs"
                  style={{ left: `${mark.position}%` }}
                >
                  {Math.round(mark.time)}ms
                </div>
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div style={{ width: `${getTimelineWidth()}px` }}>
            {animation?.animatables.map((animatable) => (
              <div key={animatable.id} className="group h-12">
                {/* Duration bar */}
                <div style={{ width: `${timeToPixels(animatable.duration)}px` }} />
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bg-blue-500"
            style={{ left: `${LABEL_WIDTH + timeToPixels(currentTime) - scrollLeft}px`, height: `${playheadHeight()}px` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelinePanel;