// apps/editor/src/components/PreviewPanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animation, TimelineItem, lerp, IAnimatable } from '@pulseboard/shared';
// apps/editor/src/components/PreviewPanel.tsx
import { 
    PlayIcon, 
    PauseIcon, 
    ArrowPathIcon as RefreshIcon 
  } from '@heroicons/react/24/solid';

interface PreviewPanelProps {
  items: TimelineItem[];
}

interface AnimatableComponent {
  x: number;
  y: number;
  scale: number;
  colorR: number;
  colorG: number;
  colorB: number;
}

const WidgetComponent: React.FC<AnimatableComponent & { type: string }> = ({
  x,
  y,
  scale,
  colorR,
  colorG,
  colorB,
  type,
}) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transform: `scale(${scale})`,
      backgroundColor: `rgb(${colorR},${colorG},${colorB})`,
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    }}
  >
    {type}
  </div>
);

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ items }) => {
  const [, forceUpdate] = useState(0);
  const animationRef = useRef<Animation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handlePlay = () => {
    if (animationRef.current) {
      animationRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (animationRef.current) {
      animationRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current.setT(0);
      setIsPlaying(false);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * totalDuration;

    if (animationRef.current) {
      animationRef.current.setT(Math.max(0, Math.min(time, totalDuration)));
    }
  };

  const handleScrubStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleScrub(e);
  };

  const handleScrubMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleScrub(e);
    }
  };

  const handleScrubEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleScrubEnd);
    return () => {
      document.removeEventListener('mouseup', handleScrubEnd);
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;

    // Convert TimelineItems to IAnimatable format
    const animatables: IAnimatable<AnimatableComponent & { type: string }>[] =
      items.map((item) => ({
        id: item.id,
        component: WidgetComponent,
        start: 0,
        duration: item.duration,
        keyframes: item.keyframes,
        props: {
          x: 50,
          y: 50,
          scale: 1,
          colorR: 100,
          colorG: 149,
          colorB: 237,
          type: item.widgetType.toUpperCase(),
        },
      }));

    // Calculate total duration
    const totalDuration = Math.max(...items.map((item) => item.duration));

    // Initialize animation
    animationRef.current = new Animation(
      'preview',
      totalDuration,
      animatables,
      lerp
    );

    // Override setT to trigger React updates
    const originalSetT = animationRef.current.setT.bind(animationRef.current);
    animationRef.current.setT = (t: number) => {
      originalSetT(t);
      setCurrentTime(t);
      forceUpdate((prev) => prev + 1);

      if (t >= totalDuration) {
        setIsPlaying(false);
      }
    };

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [items]);
  const totalDuration = Math.max(...items.map((item) => item.duration), 1);
  const progress = (currentTime / totalDuration) * 100;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Preview Header */}
      <div className="bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <div className="space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium inline-flex items-center"
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 mr-1" />
                  Play
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div
            ref={progressBarRef}
            className="h-2 bg-gray-700 rounded-full cursor-pointer relative"
            onMouseDown={handleScrubStart}
            onMouseMove={handleScrubMove}
          >
            <div
              className="absolute h-full bg-blue-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute h-4 w-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform"
              style={{ left: `${progress}%`, top: '50%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{(currentTime / 1000).toFixed(1)}s</span>
            <span>{(totalDuration / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="relative bg-gray-800" style={{ height: '300px' }}>
        {items.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Add widgets to see preview
          </div>
        ) : (
          animationRef.current?.animatables.map((animatable) => {
            const Component = animatable.component;
            return <Component key={animatable.id} {...animatable.props} />;
          })
        )}
      </div>
    </div>
  );
};
