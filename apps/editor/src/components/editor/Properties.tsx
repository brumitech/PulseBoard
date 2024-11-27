import React, { useMemo } from 'react';
import { Prop } from '@pulseboard/common';
import { useAnimationContext, Label, Input } from '@pulseboard/common';
import { useAnimatableContext } from '@pulseboard/common';

const rgbToHex = (rgbStr: string) => {
  const match = rgbStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return '#000000';
  const [_, r, g, b] = match;
  return '#' + [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, '0')).join('');
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgb(0, 0, 0)';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const PropertiesPanel: React.FC = () => {
  const { currentTime } = useAnimationContext();
  const { selectedAnimatable, updateAnimatable, addKeyframe } = useAnimatableContext();

  const propGroups = useMemo(() => {
    if (!selectedAnimatable) return {};

    const groups: Record<string, Array<[string, Prop<any>]>> = {};
    Object.entries(selectedAnimatable.props).forEach(([key, prop]) => {
      const groupTag = prop.groupTag || 'other';
      if (!groups[groupTag]) {
        groups[groupTag] = [];
      }
      groups[groupTag].push([key, prop]);
    });
    return groups;
  }, [selectedAnimatable]);

  if (!selectedAnimatable) {
    return (
      <div className="p-4 text-gray-400 text-center">
        No widget selected
      </div>
    );
  }

  const handlePropChange = (key: string, prop: Prop<any>, value: string) => {
    let parsedValue: any = value;

    switch (prop.type) {
      case 'number':
        parsedValue = parseFloat(value);
        break;
      case 'color':
        parsedValue = hexToRgb(value);
        break;
    }

    updateAnimatable({
      props: {
        ...selectedAnimatable.props,
        [key]: {
          ...selectedAnimatable.props[key],
          value: parsedValue,
        },
      },
    });
  };

  const handleCreateKeyframe = () => {
    const keyframeProps = Object.entries(selectedAnimatable.props).reduce(
      (acc, [key, prop]) => {
        acc[key] = prop.value;
        return acc;
      },
      {} as Record<string, any>
    );

    addKeyframe(currentTime, keyframeProps);
  };

  return (
    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-700/50">
      <div className="space-y-4">
        {Object.entries(propGroups).map(([groupName, props]) => (
          <div key={groupName} className="space-y-2">
            <h3 className="text-gray-400 font-medium">{groupName}</h3>
            <div className="space-y-2">
              {props.map(([key, prop]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Label className="text-gray-300 w-24">{prop.text}</Label>
                  {prop.type === 'color' ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        type="color"
                        value={rgbToHex(prop.value)}
                        onChange={(e) =>
                          handlePropChange(key, prop, e.target.value)
                        }
                        className="h-8 w-16 p-0 bg-transparent border-0"
                      />
                      <Input
                        type="text"
                        value={prop.value}
                        onChange={(e) =>
                          handlePropChange(key, prop, rgbToHex(e.target.value))
                        }
                        className="flex-1 bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus-visible:ring-offset-gray-800"
                      />
                    </div>
                  ) : (
                    <Input
                      type={prop.type === 'number' ? 'number' : 'text'}
                      value={prop.value}
                      onChange={(e) =>
                        handlePropChange(key, prop, e.target.value)
                      }
                      className="flex-1 bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus-visible:ring-offset-gray-800"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPanel;