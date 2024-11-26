import { ComponentType } from 'react';
import { Prop, WidgetDefinition } from '@pulseboard/shared';
import { RectangleWidget } from './widgets';

export const widgetRegistry: WidgetDefinition[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    description: 'A simple rectangle widget',
    category: 'Basic Shapes',
    component: RectangleWidget,
    defaultDuration: 5000, // 5 seconds
    defaultProps: {
      x: Prop.number(0, 'X Position', 'transform'),
      y: Prop.number(0, 'Y Position', 'transform'),
      scale: Prop.number(1, 'Scale', 'transform'),
      color: Prop.color('rgb(59, 130, 246)', 'Color', 'appearance'),
    },
  }
];