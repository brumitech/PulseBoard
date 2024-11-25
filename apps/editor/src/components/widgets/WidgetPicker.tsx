// apps/editor/src/components/WidgetPicker.tsx
import React from 'react';

export type WidgetType = 'aqi' | 'temperature';

interface WidgetOption {
  type: WidgetType;
  label: string;
}

const WIDGET_OPTIONS: WidgetOption[] = [
  { type: 'aqi', label: 'Air Quality' },
  { type: 'temperature', label: 'Temperature' }
];

interface WidgetPickerProps {
  onAdd: (type: WidgetType) => void;
  onRemove: (type: WidgetType) => void;
  activeWidgets: WidgetType[]; // To know which widgets are already added
}

// apps/editor/src/components/WidgetPicker.tsx
export const WidgetPicker: React.FC<WidgetPickerProps> = ({
    onAdd,
    onRemove,
    activeWidgets
  }) => {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Available Widgets</h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {WIDGET_OPTIONS.map((widget) => {
              const isActive = activeWidgets.includes(widget.type);
              
              return (
                <div 
                  key={widget.type} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{widget.label}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => onAdd(widget.type)}
                      className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
                      disabled={isActive}
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(widget.type)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 transition-colors"
                      disabled={!isActive}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };