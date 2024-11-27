import { WidgetPropValue } from '../types/widget';
import { createWidget, WidgetPropDefinitions } from '../types/widget';
import { widgetRegistry } from './registry';

interface RectangleCustomProps extends Record<string, WidgetPropValue> {
  rotation: number;
  opacity: number;
}

const rectanglePropDefinitions: WidgetPropDefinitions<RectangleCustomProps> = {
  x: {
    type: 'number',
    defaultValue: 0,
    text: 'X Position',
    groupTag: 'position'
  },
  y: {
    type: 'number',
    defaultValue: 0,
    text: 'Y Position',
    groupTag: 'position'
  },
  width: {
    type: 'number',
    defaultValue: 100,
    text: 'Width',
    groupTag: 'size'
  },
  height: {
    type: 'number',
    defaultValue: 100,
    text: 'Height',
    groupTag: 'size'
  },
  color: {
    type: 'color',
    defaultValue: 'rgb(0, 0, 0)',
    text: 'Color',
    groupTag: 'appearance'
  },
  rotation: {
    type: 'number',
    defaultValue: 0,
    text: 'Rotation',
    groupTag: 'transform'
  },
  opacity: {
    type: 'number',
    defaultValue: 1,
    text: 'Opacity',
    groupTag: 'appearance'
  }
};

export const RectangleWidget = createWidget({
  id: 'rectangle',
  name: 'Rectangle',
  description: 'A simple rectangle shape',
  category: 'basic',
  defaultDuration: 1000,
  component: ({ x, y, width, height, color, rotation, opacity }) => (
    <div
      style={{
        position: 'absolute',
        left: `${x.value}px`,
        top: `${y.value}px`,
        width: `${width.value}px`,
        height: `${height.value}px`,
        backgroundColor: color.value,
        transform: `rotate(${rotation.value}deg)`,
        opacity: opacity.value
      }}
    />
  ),
  propDefinitions: rectanglePropDefinitions
});