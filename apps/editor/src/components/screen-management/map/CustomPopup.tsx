import React from 'react';
import { MapPin, Signal, Clock, Power } from 'lucide-react';
import { CustomPopupProps } from './types';

const CustomPopup: React.FC<CustomPopupProps> = ({
  screen,
  onToggleStatus,
  onAssignAnimation,
}) => (
  <div className="min-w-[320px]">
    <div className="bg-gray-900 -m-1 p-4 rounded-lg border border-gray-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-2 h-2 rounded-full ${
                screen.status === 'active'
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
            <h3 className="text-sm font-semibold text-gray-100">
              Screen {screen.id}
            </h3>
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

        <div className="grid gap-2">
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
            <MapPin className="h-4 w-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">
                Location
              </span>
              <span className="text-xs text-gray-100">
                {screen.latitude.toFixed(4)}, {screen.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
            <Signal className="h-4 w-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">
                Animation
              </span>
              <span className="text-xs text-gray-100 font-mono">
                {screen.animationId || 'None'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
            <Clock className="h-4 w-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">
                Last Ping
              </span>
              <span className="text-xs text-gray-100">
                {screen.lastPing
                  ? new Date(screen.lastPing).toLocaleString()
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(screen.id);
            }}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-1.5"
          >
            <Power className="h-3 w-3" />
            <span>Toggle Status</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssignAnimation(screen.id);
            }}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 bg-gray-800 border border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300 flex items-center justify-center space-x-1.5"
          >
            <Signal className="h-3 w-3" />
            <span>Assign Animation</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CustomPopup;
