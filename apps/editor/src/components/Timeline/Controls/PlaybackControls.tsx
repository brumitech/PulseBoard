import React from 'react';
import { useTimelineStore } from '@/store/timelineStore';

export const PlaybackControls: React.FC = () => {
  const timeline = useTimelineStore(state => state.timeline);
  const playing = useTimelineStore(state => state.state.playing);
  const currentTime = useTimelineStore(state => state.state.currentTime);
  const setPlaying = useTimelineStore(state => state.setPlaying);
  const setCurrentTime = useTimelineStore(state => state.setCurrentTime);

  React.useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;

      if (playing && timeline) {
        setCurrentTime(prev => {
          const next = prev + deltaTime;
          if (next >= timeline.duration) {
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }

      lastTime = now;
      frameId = requestAnimationFrame(animate);
    };

    if (playing) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [playing, timeline, setCurrentTime, setPlaying]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-gray-800 rounded-lg shadow-lg p-2 z-50">
      <button
        onClick={() => {
          setCurrentTime(0);
          setPlaying(false);
        }}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded"
      >
        ↺
      </button>
      <button
        onClick={() => setPlaying(!playing)}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded"
      >
        {playing ? '⏸' : '▶'}
      </button>
      <div className="text-white px-2 min-w-[60px] text-center">
        {(currentTime / 1000).toFixed(1)}s
      </div>
    </div>
  );
};