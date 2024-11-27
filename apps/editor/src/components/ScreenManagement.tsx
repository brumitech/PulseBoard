import React, { useState, useRef } from 'react';
import {
  MapPin,
  Signal,
  Clock,
  Loader2,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useScreens } from '@pulseboard/shared';
import { screenApi } from '@pulseboard/shared';
import { ScreenMap } from './ScreenMap';

export default function ScreenManagement() {
  const { screens, loading, error, filterScreens, refreshScreens } =
    useScreens();
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const mapRef = useRef(null);

  const formatDate = (date) =>
    !date ? 'Never' : new Date(date).toLocaleString();

  const handleScreenSelect = (screenId) => {
    setSelectedScreenId(screenId);
    const screen = screens.find((s) => s.id === screenId);
    if (screen && mapRef.current?.flyTo) {
      mapRef.current.flyTo([screen.latitude, screen.longitude], 16, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await screenApi.toggleStatus(id);
      refreshScreens();
    } catch (err) {
      console.error('Failed to toggle screen status:', err);
    }
  };

  const handleAssignAnimation = async (id) => {
    const animationId = prompt('Enter Animation ID:');
    if (!animationId) return;
    try {
      await screenApi.assignAnimation(id, animationId);
      refreshScreens();
    } catch (err) {
      console.error('Failed to assign animation:', err);
    }
  };

  const handleAddScreen = async (location) => {
    try {
      await screenApi.createScreen(location);
      refreshScreens();
    } catch (err) {
      console.error('Failed to add screen:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading screens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <div className="p-3 bg-red-500/10 rounded-full">
            <RefreshCw className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-red-400">Error loading screens: {error.message}</p>
          <button
            onClick={refreshScreens}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
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
              onChange={(e) => filterScreens(e.target.value)}
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
              screens={screens}
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
                <div
                  key={screen.id}
                  onClick={() => handleScreenSelect(screen.id)}
                  className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                    selectedScreenId === screen.id
                      ? 'bg-gray-800/50 border-l-2 border-blue-500'
                      : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            screen.status === 'active'
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-gray-600'
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-200">
                          Screen {screen.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            screen.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}
                        >
                          {screen.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-gray-400">
                          {screen.latitude.toFixed(4)},{' '}
                          {screen.longitude.toFixed(4)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Signal className="h-3 w-3 text-purple-400" />
                        <span className="text-xs text-gray-400">
                          {screen.animationId || 'No animation'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span className="text-xs text-gray-400">
                          {formatDate(screen.lastPing)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
