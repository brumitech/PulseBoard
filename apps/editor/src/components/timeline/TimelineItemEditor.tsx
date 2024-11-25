// apps/editor/src/components/TimelineItemEditor.tsx
import React from 'react';
import {
  TimelineItem,
  TimelineKeyframe,
  ANIMATION_PRESETS,
  PresetId,
  Easing,
} from '@pulseboard/shared';
import { 
    PlusIcon,  
    XMarkIcon as XIcon  
  } from '@heroicons/react/24/solid';
import { ColorPicker } from '../common/ColorPicker';


interface TimelineItemEditorProps {
  item: TimelineItem;
  onUpdate: (updatedItem: TimelineItem) => void;
}

export const TimelineItemEditor: React.FC<TimelineItemEditorProps> = ({
  item,
  onUpdate,
}) => {
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value, 10);
    if (!isNaN(duration)) {
      onUpdate({
        ...item,
        duration,
      });
    }
  };

  const handleApplyPreset = (presetId: PresetId) => {
    const preset = ANIMATION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    onUpdate({
      ...item,
      duration: preset.duration,
      keyframes: preset.keyframes,
    });
  };

  const handleAddKeyframe = () => {
    const lastKeyframe = item.keyframes.at(-1);
    const newKeyframe: TimelineKeyframe = {
      timestamp: Math.min(item.duration, (lastKeyframe?.timestamp ?? 0) + 1000),
      props: {
        x: lastKeyframe?.props.x ?? 50,
        y: lastKeyframe?.props.y ?? 50,
        scale: lastKeyframe?.props.scale ?? 1,
        colorR: lastKeyframe?.props.colorR ?? 100,
        colorG: lastKeyframe?.props.colorG ?? 149,
        colorB: lastKeyframe?.props.colorB ?? 237,
      },
    };

    onUpdate({
      ...item,
      keyframes: [...item.keyframes, newKeyframe].sort(
        (a, b) => a.timestamp - b.timestamp
      ),
    });
  };
  const handleDeleteKeyframe = (index: number) => {
    // Don't allow deleting if only one keyframe remains
    if (item.keyframes.length <= 1) return;

    const newKeyframes = item.keyframes.filter((_, i) => i !== index);
    onUpdate({
      ...item,
      keyframes: newKeyframes,
    });
  };

  const handleKeyframeChange = (
    index: number,
    changes: Partial<TimelineKeyframe>
  ) => {
    const newKeyframes = [...item.keyframes];
    newKeyframes[index] = {
      ...newKeyframes[index],
      ...changes,
    };

    onUpdate({
      ...item,
      keyframes: newKeyframes.sort((a, b) => a.timestamp - b.timestamp),
    });
  };

  return (
    <div className="divide-y">
      {/* Header */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">Edit {item.widgetType.toUpperCase()}</h3>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Duration Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0"
              step="100"
              value={item.duration}
              onChange={handleDurationChange}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500">milliseconds</span>
          </div>
        </div>

        {/* Animation Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Animation Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {ANIMATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Keyframes Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-gray-700">Keyframes</label>
            <button
              onClick={handleAddKeyframe}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Keyframe
            </button>
          </div>

          <div className="space-y-6">
            {item.keyframes.map((keyframe, index) => (
              <div
                key={index}
                className="relative bg-gray-50 rounded-lg border p-4 hover:border-gray-300 transition-colors"
              >
                {/* Keyframe Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-sm text-gray-700">
                    Keyframe {index + 1}
                  </span>
                  {item.keyframes.length > 1 && (
                    <button
                      onClick={() => handleDeleteKeyframe(index)}
                      className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete keyframe"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Keyframe Controls */}
                <div className="space-y-4">
                  {/* Time and Scale */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Time (ms)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={item.duration}
                        value={keyframe.timestamp}
                        onChange={(e) =>
                          handleKeyframeChange(index, {
                            timestamp: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Scale
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={keyframe.props.scale}
                        onChange={(e) =>
                          handleKeyframeChange(index, {
                            props: {
                              ...keyframe.props,
                              scale: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">X</span>
                          <input
                            type="number"
                            value={keyframe.props.x}
                            onChange={(e) =>
                              handleKeyframeChange(index, {
                                props: {
                                  ...keyframe.props,
                                  x: parseInt(e.target.value, 10),
                                },
                              })
                            }
                            className="flex-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Y</span>
                          <input
                            type="number"
                            value={keyframe.props.y}
                            onChange={(e) =>
                              handleKeyframeChange(index, {
                                props: {
                                  ...keyframe.props,
                                  y: parseInt(e.target.value, 10),
                                },
                              })
                            }
                            className="flex-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <ColorPicker
                    label="Color"
                    red={keyframe.props.colorR}
                    green={keyframe.props.colorG}
                    blue={keyframe.props.colorB}
                    onChange={({ red, green, blue }) =>
                      handleKeyframeChange(index, {
                        props: {
                          ...keyframe.props,
                          colorR: red,
                          colorG: green,
                          colorB: blue,
                        },
                      })
                    }
                  />

                  {/* Easing Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Easing
                    </label>
                    <select
                      value={keyframe.easing ?? 'linear'}
                      onChange={(e) =>
                        handleKeyframeChange(index, {
                          easing: e.target.value as keyof typeof Easing,
                        })
                      }
                      className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.keys(Easing).map((easing) => (
                        <option key={easing} value={easing}>
                          {easing}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
