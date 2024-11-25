import { useState } from 'react';
import { WidgetDefinition } from '@pulseboard/shared';
import { Search, Plus } from 'lucide-react';

interface WidgetPanelProps {
  availableWidgets: WidgetDefinition[];
  onAddWidget: (widget: WidgetDefinition) => void;
}

export function WidgetPanel({ availableWidgets, onAddWidget }: WidgetPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWidgets = availableWidgets.filter(widget =>
    widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    widget.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search widgets..."
            className="w-full bg-gray-700 text-gray-200 pl-10 pr-4 py-2 rounded-md 
                     border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Available Widgets</h2>
        <div className="space-y-2">
          {filteredWidgets.map(widget => (
            <div
              key={widget.id}
              className="group bg-gray-700 rounded-lg p-3 hover:bg-gray-600 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-200">{widget.name}</h3>
                  <p className="text-xs text-gray-400">{widget.description}</p>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 
                           hover:bg-gray-500 rounded-md"
                  onClick={() => onAddWidget(widget)}
                >
                  <Plus size={16} className="text-gray-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}