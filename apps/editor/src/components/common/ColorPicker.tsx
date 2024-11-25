// apps/editor/src/components/ColorPicker.tsx
import React from 'react';

interface ColorPickerProps {
  label: string;
  red: number;
  green: number;
  blue: number;
  onChange: (color: { red: number; green: number; blue: number }) => void;
}
// apps/editor/src/components/ColorPicker.tsx
export const ColorPicker: React.FC<ColorPickerProps> = ({
    label,
    red,
    green,
    blue,
    onChange,
  }) => {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-4">
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Red</label>
              <input
                type="number"
                min="0"
                max="255"
                value={red}
                onChange={(e) => 
                  onChange({ red: parseInt(e.target.value), green, blue })
                }
                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Green</label>
              <input
                type="number"
                min="0"
                max="255"
                value={green}
                onChange={(e) => 
                  onChange({ red, green: parseInt(e.target.value), blue })
                }
                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Blue</label>
              <input
                type="number"
                min="0"
                max="255"
                value={blue}
                onChange={(e) => 
                  onChange({ red, green, blue: parseInt(e.target.value) })
                }
                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-md shadow-sm"
            style={{ backgroundColor: `rgb(${red},${green},${blue})` }}
          />
        </div>
      </div>
    );
  };