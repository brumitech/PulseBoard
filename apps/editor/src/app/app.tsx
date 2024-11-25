import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Plus, X } from 'lucide-react';
import { Timeline } from '../components/Timeline';
import { Properties } from '../components/Properties';
import { useAnimation, IAnimatable, Prop } from '@pulseboard/shared';
import { widgetRegistry } from '@pulseboard/widgets';

export function App() {
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
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
    addAnimatable
  } = useAnimation(6000);

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
      timestamp: time
    });
  };

  const handleAddWidget = (widgetDef: typeof widgetRegistry[0]) => {
    const animatable: IAnimatable<any, any> = {
      id: `${widgetDef.id}-${Date.now()}`,
      component: widgetDef.component,
      start: 0,
      componentProps: {},
      duration: widgetDef.defaultDuration,
      props: Object.entries(widgetDef.defaultProps).reduce((acc, [key, value]) => {
        if (typeof value === 'number') {
          acc[key] = Prop.number(value, key, 'transform');
        } else if (typeof value === 'string') {
          if (value.startsWith('rgb')) {
            acc[key] = Prop.color(value, key, 'appearance');
          } else {
            acc[key] = Prop.string(value, key);
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
      keyframes: [
        {
          timestamp: 0,
          props: Object.entries(widgetDef.defaultProps).reduce((acc, [key, value]) => {
            acc[key] = value instanceof Prop ? value.value : value;
            return acc;
          }, {} as Record<string, any>)
        }
      ]
    };

    addAnimatable(animatable);
    setIsWidgetPanelOpen(false);
  };

  const selectedAnimatable = animatables.find(a => a.id === selectedAnimatableId);

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
          <button 
            className="p-2 rounded hover:bg-gray-700"
            onClick={stop}
          >
            <RotateCcw size={20} />
          </button>
          <div className="font-mono text-sm">
            {(currentTime / 1000).toFixed(2)}s / {(duration / 1000).toFixed(2)}s
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2"
            onClick={() => setIsWidgetPanelOpen(true)}
          >
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
          selectedKeyframeIndex={selectedKeyframeId !== null ? parseInt(selectedKeyframeId) : null}
          onKeyframeUpdate={handleKeyframeUpdate}
          onKeyframeTimeChange={handleKeyframeTimeChange}
        />

        {/* Widget Panel Modal */}
        {isWidgetPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-[600px] max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Add Widget</h2>
                <button 
                  className="p-2 hover:bg-gray-700 rounded-full"
                  onClick={() => setIsWidgetPanelOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {widgetRegistry.map(widget => (
                    <div
                      key={widget.id}
                      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleAddWidget(widget)}
                    >
                      <h3 className="font-medium mb-2">{widget.name}</h3>
                      <p className="text-sm text-gray-400">{widget.description}</p>
                      <span className="inline-block mt-2 text-xs bg-gray-800 px-2 py-1 rounded">
                        {widget.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;