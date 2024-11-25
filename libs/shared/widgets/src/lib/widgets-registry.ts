import { WidgetDefinition, Prop } from '../../../src/';
import { AirQualityWidget, WeatherWidget, ClockWidget } from './widgets';

export const widgetRegistry: WidgetDefinition[] = [
  {
    id: 'air-quality',
    name: 'Air Quality',
    description: 'Displays real-time air quality data from Pulse.eco',
    category: 'Environmental',
    component: AirQualityWidget,
    defaultDuration: 3000,
    defaultProps: {
      x: Prop.number(0, 'X Position', 'transform'),
      y: Prop.number(0, 'Y Position', 'transform'),
      scale: Prop.number(1, 'Scale', 'transform'),
      color: Prop.color('rgb(59, 130, 246)', 'Background Color', 'appearance'),
      aqi: 50
    }
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Shows current weather conditions',
    category: 'Environmental',
    component: WeatherWidget,
    defaultDuration: 3000,
    defaultProps: {
      x: Prop.number(0, 'X Position', 'transform'),
      y: Prop.number(0, 'Y Position', 'transform'),
      scale: Prop.number(1, 'Scale', 'transform'),
      color: Prop.color('rgb(99, 102, 241)', 'Background Color', 'appearance'),
      temperature: 20,
      condition: 'sunny'
    }
  },
  {
    id: 'clock',
    name: 'Clock',
    description: 'Displays current time',
    category: 'Utility',
    component: ClockWidget,
    defaultDuration: 3000,
    defaultProps: {
      x: Prop.number(0, 'X Position', 'transform'),
      y: Prop.number(0, 'Y Position', 'transform'),
      scale: Prop.number(1, 'Scale', 'transform'),
      color: Prop.color('rgb(79, 70, 229)', 'Background Color', 'appearance'),
      format: '24h'
    }
  }
];