import { useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAnimation, IAnimatable } from '@pulseboard/shared';
import { Timeline } from '../components/Timeline';
import { Preview } from '../components/Preview';
import { Properties } from '../components/Properties';
import { WidgetPanel } from '../components/WidgetPanel';

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
    addAnimatable,
    addKeyframe,
  } = useAnimation(6000); // 6 seconds total duration

  useEffect(() => {
    initAnimation();
  }, [initAnimation]);

  const handleAnimatableUpdate = useCallback(
    (id: string, updates: Partial<IAnimatable<any, any>>) => {
      console.log('Updating animatable:', id, updates);
      const animatable = animatables.find((a) => a.id === id);
      if (!animatable) return;

      const updatedAnimatable = {
        ...animatable,
        ...updates,
      };

      // Find and update the animatable in the list
      const index = animatables.findIndex((a) => a.id === id);
      if (index !== -1) {
        const newAnimatables = [...animatables];
        newAnimatables[index] = updatedAnimatable;
        // Update the animation with the new animatables
        initAnimation();
      }
    },
    [animatables, initAnimation]
  );

  const handleKeyframeUpdate = useCallback(
    (animatableId: string, keyframeIndex: number, updates: any) => {
      console.log('Updating keyframe:', { animatableId, keyframeIndex, updates });
      updateKeyframe(animatableId, keyframeIndex, updates);
      // Re-initialize animation to apply changes
      initAnimation();
    },
    [updateKeyframe, initAnimation]
  );

  const handleAddKeyframe = useCallback(
    (animatableId: string, timestamp: number) => {
      console.log('App handleAddKeyframe called with:', { animatableId, timestamp });
      
      // Simply call addKeyframe, all checks and initialization are handled within it
      addKeyframe(animatableId, timestamp);
    },
    [addKeyframe]
);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Top Bar with Controls */}
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Area */}
        <div className="h-1/2 bg-gray-800 border-b border-gray-700 p-4">
          <Preview currentTime={currentTime} animatables={animatables} />
        </div>

        {/* Bottom Section */}
        <div className="h-1/2 flex">
          {/* Widget Panel */}
          <div className="w-64 bg-gray-800 border-r border-gray-700">
            <WidgetPanel onAddWidget={addAnimatable} />
          </div>

          {/* Timeline */}
          <div className="flex-1">
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
              onAnimatableUpdate={handleAnimatableUpdate}
            />
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <Properties
              selectedAnimatable={animatables.find(
                (a) => a.id === selectedAnimatableId
              )}
              selectedKeyframeIndex={
                selectedKeyframeId !== null
                  ? parseInt(selectedKeyframeId)
                  : null
              }
              onKeyframeUpdate={handleKeyframeUpdate}
              onAddKeyframe={handleAddKeyframe}
              currentTime={currentTime}
              onKeyframeSelect={selectKeyframe}  // Update this
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;