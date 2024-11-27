import React from 'react';
import { MapPin, Signal, Clock } from 'lucide-react';
import { ScreenListItemProps } from './types';

const ScreenListItem: React.FC<ScreenListItemProps> = ({
  screen,
  isSelected,
  onSelect,
  formatDate,
}) => (
  <div
    onClick={() => onSelect(screen.id)}
    className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-colors ${
      isSelected ? 'bg-gray-800/50 border-l-2 border-blue-500' : ''
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
            {screen.latitude.toFixed(4)}, {screen.longitude.toFixed(4)}
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
);

export default ScreenListItem;
