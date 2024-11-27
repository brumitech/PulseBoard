import { Prop } from '../types/core';
import { 
  WidgetDefinition, 
  WidgetProps, 
  WidgetPropValue 
} from '../types/widget';

export interface WidgetRegistryEntry<T extends Record<string, WidgetPropValue>> {
  widgetDef: WidgetDefinition<T>;
  initialProps: WidgetProps<T>;
}

export class WidgetRegistry {
  private widgets = new Map<string, WidgetRegistryEntry<any>>();

  register<T extends Record<string, WidgetPropValue>>(
    widgetDef: WidgetDefinition<T>
  ): void {
    const initialProps = Object.entries(widgetDef.propDefinitions).reduce(
      (acc, [key, def]) => ({
        ...acc,
        [key]: Prop.create(def)
      }),
      {} as WidgetProps<T>
    );

    this.widgets.set(widgetDef.id, {
      widgetDef,
      initialProps
    });
  }

  getWidget<T extends Record<string, WidgetPropValue>>(
    id: string
  ): WidgetRegistryEntry<T> | undefined {
    const entry = this.widgets.get(id);
    return entry as WidgetRegistryEntry<T> | undefined;
  }

  getAllWidgets(): Array<WidgetRegistryEntry<any>> {
    return Array.from(this.widgets.values());
  }
}

export const widgetRegistry = new WidgetRegistry();