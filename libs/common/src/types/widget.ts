import { ComponentType } from 'react';
import { PropDefinition, AnimatableProps, Prop, PropType, PropTypeToValue } from './core';

// Define the allowed value types for widget props
export type WidgetPropValue = PropTypeToValue[PropType];

// Now BaseWidgetProps extends AnimatableProps directly
export interface BaseWidgetProps extends AnimatableProps {
  color: Prop<'color'>;
}

// WidgetProps now only needs to handle the custom props
export type WidgetProps<T extends Record<string, WidgetPropValue>> = 
  BaseWidgetProps & 
  {
    [K in keyof T]: Prop<PropType>;
  };

// Widget prop definitions
export type WidgetPropDefinitions<T extends Record<string, WidgetPropValue>> = {
  x: PropDefinition<'number'>;
  y: PropDefinition<'number'>;
  width: PropDefinition<'number'>;
  height: PropDefinition<'number'>;
  color: PropDefinition<'color'>;
} & {
  [K in keyof T]: PropDefinition<PropType>;
};

// Widget definition
export interface WidgetDefinition<T extends Record<string, WidgetPropValue>> {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultDuration: number;
  component: ComponentType<WidgetProps<T>>;
  propDefinitions: WidgetPropDefinitions<T>;
}

export function createWidget<T extends Record<string, WidgetPropValue>>(
  definition: WidgetDefinition<T>
): WidgetDefinition<T> {
  // Validate required base props
  const requiredProps = ['x', 'y', 'width', 'height', 'color'] as const;
  const requiredTypes = {
    x: 'number',
    y: 'number',
    width: 'number',
    height: 'number',
    color: 'color'
  } as const;

  for (const prop of requiredProps) {
    if (!(prop in definition.propDefinitions)) {
      throw new Error(`Missing required prop definition: ${prop}`);
    }

    const actualType = definition.propDefinitions[prop].type;
    const expectedType = requiredTypes[prop];
    
    if (actualType !== expectedType) {
      throw new Error(
        `Invalid type for ${prop}. Expected ${expectedType}, got ${actualType}`
      );
    }
  }

  // Validate all prop definitions have valid types
  Object.entries(definition.propDefinitions).forEach(([key, def]) => {
    if (!['number', 'string', 'color'].includes(def.type)) {
      throw new Error(`Invalid prop type: ${def.type} for prop: ${key}`);
    }
  });

  return definition;
}