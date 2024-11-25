// apps/editor/src/components/Properties.tsx
import { IAnimatable, Prop } from '@pulseboard/shared';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PropertiesProps {
  selectedAnimatable: IAnimatable<any, any> | null;
  selectedKeyframeIndex: number | null;
  onKeyframeUpdate: (updates: Partial<any>) => void;
  onKeyframeTimeChange: (time: number) => void;
}

export function Properties({
  selectedAnimatable,
  selectedKeyframeIndex,
  onKeyframeUpdate,
  onKeyframeTimeChange,
}: PropertiesProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  if (!selectedAnimatable) {
    return (
      <div className="w-72 bg-gray-800 border-l border-gray-700 p-4">
        <div className="text-gray-400">
          Select an animatable or keyframe to view properties
        </div>
      </div>
    );
  }

  const selectedKeyframe = selectedKeyframeIndex !== null 
    ? selectedAnimatable.keyframes[selectedKeyframeIndex]
    : null;

  // Group props by their groupTag
  const groupedProps = Object.entries(selectedAnimatable.props).reduce((groups, [key, prop]) => {
    const groupTag = (prop as Prop<any>).groupTag || 'Other';
    if (!groups[groupTag]) {
      groups[groupTag] = [];
    }
    groups[groupTag].push([key, prop]);
    return groups;
  }, {} as Record<string, [string, Prop<any>][]>);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const renderPropInput = (key: string, prop: Prop<any>, value: any) => {
    switch (prop.type) {
      case 'number':
        return (
          <input
            type="number"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
            value={value}
            onChange={(e) => {
              onKeyframeUpdate({
                props: {
                  ...selectedKeyframe?.props,
                  [key]: parseFloat(e.target.value)
                }
              });
            }}
          />
        );

      case 'color':
        return (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              className="w-12 h-8 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
              value={value}
              onChange={(e) => {
                onKeyframeUpdate({
                  props: {
                    ...selectedKeyframe?.props,
                    [key]: e.target.value
                  }
                });
              }}
            />
            <input
              type="text"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
              value={value}
              onChange={(e) => {
                onKeyframeUpdate({
                  props: {
                    ...selectedKeyframe?.props,
                    [key]: e.target.value
                  }
                });
              }}
            />
          </div>
        );

      case 'string':
        return (
          <input
            type="text"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
            value={value}
            onChange={(e) => {
              onKeyframeUpdate({
                props: {
                  ...selectedKeyframe?.props,
                  [key]: e.target.value
                }
              });
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-72 bg-gray-800 border-l border-gray-700 p-4 text-gray-200 overflow-y-auto">
      <h2 className="font-semibold mb-4">Properties</h2>

      {selectedKeyframe ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Keyframe Time</label>
            <input
              type="number"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
              value={(selectedKeyframe.timestamp / 1000).toFixed(3)}
              onChange={(e) => {
                const newTime = Math.max(0, parseFloat(e.target.value) * 1000);
                onKeyframeTimeChange(newTime);
              }}
            />
          </div>

          {Object.entries(groupedProps).map(([group, props]) => (
            <div key={group} className="border border-gray-700 rounded-md overflow-hidden">
              <button
                className="w-full px-4 py-2 bg-gray-700 flex items-center justify-between"
                onClick={() => toggleGroup(group)}
              >
                <span className="font-medium text-sm">{group}</span>
                {expandedGroups[group] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              
              {expandedGroups[group] && (
                <div className="p-4 space-y-4">
                  {props.map(([key, prop]) => {
                    const value = selectedKeyframe.props[key] ?? prop.value;
                    return (
                      <div key={key} className="space-y-2">
                        <label className="text-sm text-gray-400">{prop.text}</label>
                        {renderPropInput(key, prop, value)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400">
          Select a keyframe to edit its properties
        </div>
      )}
    </div>
  );
}