import React from 'react';
import { IAnimatable, Prop } from '@pulseboard/shared';
import Button from './common/Button';
import Input from './common/Input';
import Label from './common/Label';

interface PropertiesPanelProps {
  animatable: IAnimatable<any, any>;
  currentTime: number;
  onCreateKeyframe: (props: Record<string, any>) => void;
  onUpdateProp: (key: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  animatable,
  currentTime,
  onCreateKeyframe,
  onUpdateProp,
}) => {
  const propGroups = React.useMemo(() => {
    const groups: Record<string, Array<[string, Prop<any>]>> = {};
    
    Object.entries(animatable.props).forEach(([key, prop]) => {
      const groupTag = prop.groupTag || 'other';
      if (!groups[groupTag]) {
        groups[groupTag] = [];
      }
      groups[groupTag].push([key, prop]);
    });
    
    return groups;
  }, [animatable.props]);

  const handlePropChange = (key: string, prop: Prop<any>, value: string) => {
    let parsedValue: any = value;
    
    switch (prop.type) {
      case 'number':
        parsedValue = parseFloat(value);
        break;
      case 'color':
        // Validate color format
        if (!/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value)) {
          return;
        }
        break;
    }
    
    onUpdateProp(key, parsedValue);
  };

  const handleCreateKeyframe = () => {
    const keyframeProps = Object.entries(animatable.props).reduce(
      (acc, [key, prop]) => {
        acc[key] = prop.value;
        return acc;
      },
      {} as Record<string, any>
    );
    
    onCreateKeyframe(keyframeProps);
  };

  return (
    <div className="space-y-6">
      {Object.entries(propGroups).map(([groupName, props]) => (
        <div key={groupName} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{groupName}</h3>
          
          {props.map(([key, prop]) => (
            <div key={key} className="space-y-2">
              <Label>{prop.text}</Label>
              
              {prop.type === 'color' ? (
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={prop.value}
                    onChange={(e) => handlePropChange(key, prop, e.target.value)}
                  />
                  <div
                    className="w-8 h-8 border rounded"
                    style={{ backgroundColor: prop.value }}
                  />
                </div>
              ) : (
                <Input
                  type={prop.type === 'number' ? 'number' : 'text'}
                  value={prop.value}
                  onChange={(e) => handlePropChange(key, prop, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      
    </div>
  );
};

export default PropertiesPanel;