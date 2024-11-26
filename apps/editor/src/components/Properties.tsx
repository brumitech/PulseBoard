import React from 'react';
import { IAnimatable, Prop } from '@pulseboard/shared';
import { Plus } from 'lucide-react';

interface PropertiesProps {
  selectedAnimatable: IAnimatable<any, any> | undefined;
  selectedKeyframeIndex: number | null;
  onKeyframeUpdate: (
    animatableId: string,
    keyframeIndex: number,
    updates: any
  ) => void;
  onAddKeyframe?: (animatableId: string, timestamp: number) => void;
  currentTime: number;
  onKeyframeSelect: (animatableId: string, keyframeId: string) => void;  // Rename this

}

export const Properties: React.FC<PropertiesProps> = ({
  selectedAnimatable,
  selectedKeyframeIndex,
  onKeyframeUpdate,
  onAddKeyframe,
  currentTime,
  onKeyframeSelect,  // Rename this
}) => {
  console.log('selectKeyframe prop:', onKeyframeSelect); // Add this line

  if (!selectedAnimatable) {
    return (
      <div className="p-4">
        <p className="text-gray-400">Select a widget to edit properties</p>
      </div>
    );
  }

  const getCurrentValue = (key: string): string => {
    if (selectedKeyframeIndex === null) {
      return (selectedAnimatable.props[key] as Prop<any>).value?.toString() || '';
    }
    const keyframe = selectedAnimatable.keyframes[selectedKeyframeIndex];
    return keyframe.props[key]?.toString() || '';
  };

  const handleValueChange = (key: string, value: string | number) => {
    if (selectedKeyframeIndex === null) return;

    // Convert value based on prop type
    let finalValue = value;
    const prop = selectedAnimatable.props[key] as Prop<any>;
    if (prop.type === 'number' && typeof value === 'string') {
      finalValue = parseFloat(value) || 0;
    }

    onKeyframeUpdate(selectedAnimatable.id, selectedKeyframeIndex, {
      props: {
        ...selectedAnimatable.keyframes[selectedKeyframeIndex].props,
        [key]: finalValue
      }
    });
  };

  const handleAddKeyframe = () => {
    if (!onAddKeyframe || !selectedAnimatable) {
      console.warn('Cannot add keyframe: missing callback or selected animatable');
      return;
    }
    
    console.log('Properties handleAddKeyframe called:', {
      id: selectedAnimatable.id,
      time: currentTime
    });
    onAddKeyframe(selectedAnimatable.id, currentTime);
};

  const handleKeyframeClick = (index: number) => {
    if (selectedAnimatable) {
      onKeyframeSelect(selectedAnimatable.id, index.toString());
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <button
          onClick={handleAddKeyframe}
          className="flex items-center gap-1 px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 text-white"
        >
          <Plus size={16} />
          Add Keyframe
        </button>
      </div>

      {/* Widget info */}
      <div className="mb-4">
        <p className="text-sm text-gray-400">Widget ID: {selectedAnimatable.id}</p>
        {selectedKeyframeIndex !== null && (
          <p className="text-sm text-gray-400">
            Keyframe: {selectedKeyframeIndex} at {selectedAnimatable.keyframes[selectedKeyframeIndex].timestamp}ms
          </p>
        )}
      </div>

      {/* Keyframes List */}
      <div className="mb-4 p-2 bg-gray-700 rounded">
        <h3 className="text-sm font-medium mb-2">Keyframes</h3>
        <div className="space-y-1">
          {selectedAnimatable.keyframes.map((keyframe, index) => (
            <div
              key={index}
              onClick={() => handleKeyframeClick(index)}
              className={`flex justify-between items-center p-2 rounded cursor-pointer 
                hover:bg-gray-500 transition-colors
                ${selectedKeyframeIndex === index ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <span className="text-sm">
                {(keyframe.timestamp / 1000).toFixed(2)}s
              </span>
              <span className="text-xs text-gray-300">
                #{index}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Properties */}
      <div className="space-y-4">
        {Object.entries(selectedAnimatable.props).map(([key, prop]) => {
          const typedProp = prop as Prop<any>;
          return (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium">{typedProp.text}</label>
              {typedProp.type === 'number' && (
                <input
                  type="number"
                  value={getCurrentValue(key)}
                  onChange={(e) => handleValueChange(key, e.target.value)}
                  className="w-full bg-gray-700 rounded px-2 py-1"
                />
              )}
              {typedProp.type === 'color' && (
                <input
                  type="color"
                  value={getCurrentValue(key)}
                  onChange={(e) => handleValueChange(key, e.target.value)}
                  className="w-full bg-gray-700 rounded px-2 py-1"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};