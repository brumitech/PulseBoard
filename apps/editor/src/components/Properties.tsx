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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-blue-100 to-gray-200 mb-6">
          Properties
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-6" />

        <div className="space-y-6">
          {Object.entries(propGroups).map(([groupName, props]) => (
            <div key={groupName} className="group relative">
              <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50" />
              
              <div className="relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm p-4">
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 capitalize mb-4">
                  {groupName}
                </h3>
                
                <div className="space-y-4">
                  {props.map(([key, prop]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-gray-300">{prop.text}</Label>
                      
                      {prop.type === 'color' ? (
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            value={prop.value}
                            onChange={(e) => handlePropChange(key, prop, e.target.value)}
                            className="bg-gray-900/50 text-gray-300 border-gray-700 focus:border-blue-500"
                          />
                          <div
                            className="w-8 h-8 rounded border border-gray-700"
                            style={{ backgroundColor: prop.value }}
                          />
                        </div>
                      ) : (
                        <Input
                          type={prop.type === 'number' ? 'number' : 'text'}
                          value={prop.value}
                          onChange={(e) => handlePropChange(key, prop, e.target.value)}
                          className="bg-gray-900/50 text-gray-300 border-gray-700 focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;