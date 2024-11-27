import React from 'react';
import { useAnimationContext, widgetRegistry, IAnimatable } from '@pulseboard/common';

const WidgetList: React.FC = () => {
  const { addAnimatable } = useAnimationContext();
  const widgets = widgetRegistry.getAllWidgets();

  const createAnimatable = (entry: ReturnType<typeof widgetRegistry.getAllWidgets>[number]): IAnimatable => {
    const initialProps = entry.initialProps;
    
    return {
      id: crypto.randomUUID(),
      component: entry.widgetDef.component as IAnimatable['component'],
      props: initialProps,
      start: 0,
      duration: entry.widgetDef.defaultDuration,
      keyframes: [{
        timestamp: 0,
        props: Object.entries(initialProps).reduce((acc, [key, prop]) => {
          acc[key] = prop.value;
          return acc;
        }, {} as Record<string, any>)
      }],
      componentProps: {}
    };
  };

  return (
    <div className="space-y-2">
      {widgets.map((entry) => (
        <button
          key={entry.widgetDef.id}
          onClick={() => {
            const newAnimatable = createAnimatable(entry);
            addAnimatable(newAnimatable);
          }}
          className="w-full p-2 text-left hover:bg-gray-700"
        >
          {entry.widgetDef.name}
        </button>
      ))}
    </div>
  );
};

export default WidgetList;