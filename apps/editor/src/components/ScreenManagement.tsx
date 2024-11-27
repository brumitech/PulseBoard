import { useState, useRef } from 'react';
import { RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useScreens } from '@pulseboard/shared';
import { screenApi } from '@pulseboard/shared';
import { ScreenMap } from './ScreenMap';
import {
  Loading,
  ErrorState,
  ScreenListItem,
} from '../components/screen-management/list';
import type { ExtendedScreen } from '../components/screen-management/map/types';
import { MapControllerRef } from '../components/screen-management/map/types';

export default function ScreenManagement() {
  const { screens, loading, error, filterScreens, refreshScreens } =
    useScreens();
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const mapRef = useRef<MapControllerRef>(null);

  const formatDate = (date?: string) =>
    !date ? 'Never' : new Date(date).toLocaleString();

  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
    const screen = screens.find((s) => s.id === screenId);
    if (screen && mapRef.current?.flyTo) {
      mapRef.current.flyTo([screen.latitude, screen.longitude], 16, {
        duration: 2,
        easeLinearity: 0.15,
        animate: true,
        noMoveStart: false,
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await screenApi.toggleStatus(id);
      refreshScreens();
    } catch (err) {
      console.error('Failed to toggle screen status:', err);
    }
  };

  const handleAssignAnimation = async (id: string) => {
    const animationId = prompt('Enter Animation ID:');
    if (!animationId) return;
    try {
      await screenApi.assignAnimation(id, animationId);
      refreshScreens();
    } catch (err) {
      console.error('Failed to assign animation:', err);
    }
  };

  const handleAddScreen = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      await screenApi.createScreen(location);
      refreshScreens();
    } catch (err) {
      console.error('Failed to add screen:', err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refreshScreens} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-blue-100 to-gray-200">
              Screen Management
            </h1>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-1" />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={refreshScreens}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <select
              className="bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700 px-3 py-1 text-sm backdrop-blur-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) =>
                filterScreens(e.target.value as 'all' | 'active' | 'inactive')
              }
            >
              <option value="all">All Screens</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Map Section */}
        <div
          className={`transition-all duration-300 ${
            isListExpanded ? 'w-2/3' : 'w-4/5'
          }`}
        >
          <div className="h-full">
            <ScreenMap
              ref={mapRef}
              screens={screens as ExtendedScreen[]}
              onAddScreen={handleAddScreen}
              onToggleStatus={handleToggleStatus}
              onAssignAnimation={handleAssignAnimation}
              selectedScreenId={selectedScreenId}
              onScreenSelect={handleScreenSelect}
            />
          </div>
        </div>

        {/* List Panel */}
        <div
          className={`transition-all duration-300 ${
            isListExpanded ? 'w-1/3' : 'w-1/5'
          } bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 relative`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsListExpanded(!isListExpanded)}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all group z-10"
          >
            {isListExpanded ? (
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
            )}
          </button>

          {/* Quick Filters */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">
                All Active
              </button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600">
                Needs Attention
              </button>
            </div>
          </div>

          {/* Screen List */}
          <div className="h-[calc(100%-5rem)] overflow-auto">
            <div className="divide-y divide-gray-800">
              {screens.map((screen) => (
                <ScreenListItem
                  key={screen.id}
                  screen={screen as ExtendedScreen}
                  isSelected={selectedScreenId === screen.id}
                  onSelect={handleScreenSelect}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
