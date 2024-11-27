import { useEffect } from 'react';
import { useAnimationContext, widgetRegistry, Animation } from '@pulseboard/common';
import Player from '../components/editor/Preview';
import PropertiesPanel from '../components/editor/Properties';
import TimelinePanel from '../components/editor/Timeline';
import WidgetList from '../components/editor/WidgetList';

const Editor = () => {
  const { setAnimation } = useAnimationContext();

  useEffect(() => {
    const newAnimation = new Animation('default-animation', 10000, []); 
    setAnimation(newAnimation);
  }, [setAnimation]);

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="relative h-full flex flex-col px-4">
        <div className="flex-none py-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-blue-100 to-gray-200">
            Animation Editor
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-1" />
        </div>

        <div className="flex-1 flex space-x-4 min-h-0">
          {/* Widgets Panel */}
          <div className="w-1/5 flex flex-col group">
            <div className="flex-1 relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 mb-4">
                    Widgets
                  </h2>
                  <WidgetList />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 flex flex-col group">
            <div className="flex-1 relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
              <div className="p-4 h-full flex flex-col">
                <h2 className="flex-none text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 mb-4">
                  Preview
                </h2>
                <div className="flex-1 preview-container relative bg-gray-900/50 rounded-lg border border-gray-700/50 min-h-0">
                  <Player />
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-1/4 flex flex-col group">
            <div className="flex-1 relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 mb-4">
                    Properties
                  </h2>
                  <PropertiesPanel />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Panel */}
        <div className="flex-none h-96 mt-4 group">
          <div className="h-full relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm">
            <TimelinePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;