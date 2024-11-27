import React from 'react';
import { MapPin, Signal, Clock, MoreVertical, Power } from 'lucide-react';

const DemoScreenList = () => {
  const mockScreens = [
    {
      id: 'SCR001',
      latitude: 51.5074,
      longitude: -0.1278,
      status: 'active',
      animationId: 'ANIM123',
      lastPing: new Date(),
    },
    {
      id: 'SCR002',
      latitude: 40.7128,
      longitude: -74.006,
      status: 'inactive',
      lastPing: new Date(Date.now() - 86400000),
    },
    {
      id: 'SCR003',
      latitude: 48.8566,
      longitude: 2.3522,
      status: 'active',
      animationId: 'ANIM456',
      lastPing: new Date(),
    },
  ];

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="max-w-5xl mx-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-blue-100 to-gray-200">
              Screen Management
            </h1>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-1" />
          </div>

          <select className="bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700 px-3 py-1 text-sm backdrop-blur-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none">
            <option>All Screens</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="grid gap-3">
          {mockScreens.map((screen) => (
            <div key={screen.id} className="group relative">
              {/* Ambient light effect */}
              <div
                className={`absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl ${
                  screen.status === 'active'
                    ? 'bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50'
                    : 'bg-gradient-to-r from-gray-500/30 via-gray-400/30 to-gray-500/30'
                }`}
              />

              <div className="relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjMDAwIj48L2NpcmNsZT4KPC9zdmc+')]" />

                <div className="relative p-4">
                  <div className="space-y-3">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            screen.status === 'active'
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse'
                              : 'bg-gradient-to-r from-gray-500 to-gray-600'
                          }`}
                        />
                        <h3 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                          Screen {screen.id}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                            screen.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                          }`}
                        >
                          {screen.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button className="relative p-1.5 group/btn overflow-hidden rounded-md transition-all duration-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          <Power className="h-4 w-4 text-gray-400 group-hover/btn:text-blue-400 transition-colors relative z-10" />
                        </button>
                        <button className="relative p-1.5 group/btn overflow-hidden rounded-md transition-all duration-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          <MoreVertical className="h-4 w-4 text-gray-400 group-hover/btn:text-blue-400 transition-colors relative z-10" />
                        </button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700/50 hover:border-gray-600 transition-colors group/card">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <MapPin className="h-4 w-4 text-blue-400 relative z-10" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-medium">
                            Location
                          </span>
                          <span className="text-xs text-gray-100">
                            {screen.latitude.toFixed(4)},{' '}
                            {screen.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700/50 hover:border-gray-600 transition-colors group/card">
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <Signal className="h-4 w-4 text-purple-400 relative z-10" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-medium">
                            Animation
                          </span>
                          <span className="text-xs text-gray-100">
                            {screen.animationId || 'None'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700/50 hover:border-gray-600 transition-colors group/card">
                        <div className="relative">
                          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <Clock className="h-4 w-4 text-amber-400 relative z-10" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-medium">
                            Last Ping
                          </span>
                          <span className="text-xs text-gray-100">
                            {formatDate(screen.lastPing)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoScreenList;
