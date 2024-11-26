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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-blue-100 to-gray-200 mb-6">
          Widgets
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-6" />

        <div className="space-y-3">
          {widgetRegistry.map((widget) => (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, widget)}
              onClick={() => handleAddWidget(widget)}
              className="group relative"
            >
              <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50" />
              
              <div className="relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 font-semibold">
                    {widget.name}
                  </span>
                  <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-sm text-gray-400 mt-2">{widget.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};