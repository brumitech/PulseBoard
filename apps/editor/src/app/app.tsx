// apps/editor/src/app/app.tsx
import { useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { Timeline } from '../components/Timeline';
import { Properties } from '../components/Properties';
import { useAnimation } from '@pulseboard/shared';
import { Mockup } from '../components/mockup';

export function App() {
  const {
    currentTime,
    isPlaying,
    duration,
    animatables,
    selectedAnimatableId,
    selectedKeyframeId,
    initAnimation,
    play,
    pause,
    stop,
    setTime,
    selectAnimatable,
    selectKeyframe,
    removeAnimatable,
    updateKeyframe,
  } = useAnimation(6000); // 6 seconds default duration

  useEffect(() => {
    initAnimation();
  }, [initAnimation]);

  const handleKeyframeUpdate = (updates: Partial<any>) => {
    if (!selectedAnimatableId || selectedKeyframeId === null) return;
    updateKeyframe(selectedAnimatableId, parseInt(selectedKeyframeId), updates);
  };

  const handleKeyframeTimeChange = (time: number) => {
    if (!selectedAnimatableId || selectedKeyframeId === null) return;
    updateKeyframe(selectedAnimatableId, parseInt(selectedKeyframeId), {
      timestamp: time,
    });
  };

  const selectedAnimatable = animatables.find(
    (a) => a.id === selectedAnimatableId
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Top Bar */}
      <div className="h-14 bg-gray-800 flex items-center px-4 justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded hover:bg-gray-700"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="p-2 rounded hover:bg-gray-700" onClick={stop}>
            <RotateCcw size={20} />
          </button>
          <div className="font-mono text-sm">
            {(currentTime / 1000).toFixed(2)}s / {(duration / 1000).toFixed(2)}s
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2">
            <Plus size={16} />
            Add Widget
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Preview */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4">
          <h2 className="font-semibold mb-4">Preview</h2>
          {/* Add preview component here */}
        </div>

        {/* Center - Timeline */}
        <div className="flex-1 overflow-auto">
          <Timeline
            duration={duration}
            currentTime={currentTime}
            animatables={animatables}
            selectedAnimatableId={selectedAnimatableId}
            selectedKeyframeId={selectedKeyframeId}
            onTimeChange={setTime}
            onKeyframeSelect={selectKeyframe}
            onAnimatableSelect={selectAnimatable}
            onAnimatableRemove={removeAnimatable}
          />
        </div>

        {/* Right Sidebar - Properties */}
        <Properties
          selectedAnimatable={selectedAnimatable}
          selectedKeyframeIndex={
            selectedKeyframeId !== null ? parseInt(selectedKeyframeId) : null
          }
          onKeyframeUpdate={handleKeyframeUpdate}
          onKeyframeTimeChange={handleKeyframeTimeChange}
        />
      </div>
    </div>
  );
}

export default App;
