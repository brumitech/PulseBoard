import React from 'react';
import { Plus } from 'lucide-react';
import { widgetRegistry } from '@pulseboard/widgets';
import { IAnimatable, Prop } from '@pulseboard/shared';

interface WidgetPanelProps {
  onAddWidget: (widget: IAnimatable<any, any>) => void;
}

export const WidgetPanel: React.FC<WidgetPanelProps> = ({ onAddWidget }) => {
  const handleAddWidget = (widgetDef: typeof widgetRegistry[0]) => {
    console.log('Adding widget:', widgetDef);


    // Create new animatable
    const animatable: IAnimatable<any, any> = {
      id: `${widgetDef.id}-${Date.now()}`,
      component: widgetDef.component,
      start: 0,
      componentProps: {},
      duration: widgetDef.defaultDuration,
      props: Object.entries(widgetDef.defaultProps).reduce((acc, [key, value]) => {
        // Ensure we create new Prop instances
        if (value instanceof Prop) {
          acc[key] = new Prop(value.value, value.type, value.text, value.groupTag);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
      keyframes: [
        {
          timestamp: 0,
          props: Object.entries(widgetDef.defaultProps).reduce((acc, [key, value]) => {
            acc[key] = value instanceof Prop ? value.value : value;
            return acc;
          }, {} as Record<string, any>)
        }
      ]
    };
    console.log('Created animatable:', animatable);

    // Call the onAddWidget prop with the new animatable
    onAddWidget(animatable);
  };

  // Add drag start handler
  const handleDragStart = (e: React.DragEvent, widgetDef: typeof widgetRegistry[0]) => {
    e.dataTransfer.setData('widget-id', widgetDef.id);
  };

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Widgets</h2>
      <div className="space-y-2">
        {widgetRegistry.map((widget) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => handleDragStart(e, widget)}
            onClick={() => handleAddWidget(widget)}
            className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
          >
            <div className="flex items-center justify-between">
              <span>{widget.name}</span>
              <Plus size={16} />
            </div>
            <p className="text-sm text-gray-400 mt-1">{widget.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};