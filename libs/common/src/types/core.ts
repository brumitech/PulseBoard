export type PropType = 'number' | 'string' | 'color';

export type PropTypeToValue = {
  number: number;
  string: string;
  color: string;
};

export interface PropDefinition<T extends PropType> {
  type: T;
  defaultValue: PropTypeToValue[T];
  text: string;
  groupTag?: string;
}

export class Prop<T extends PropType> {
  constructor(
    public value: PropTypeToValue[T],
    public type: T,
    public text: string,
    public groupTag?: string
  ) {}

  static create<T extends PropType>(def: PropDefinition<T>): Prop<T> {
    return new Prop<T>(def.defaultValue, def.type, def.text, def.groupTag);
  }
}

export interface BaseAnimatableProps {
  x: Prop<'number'>;
  y: Prop<'number'>;
  width: Prop<'number'>;
  height: Prop<'number'>;
}

export type AnimatableProps<T = {}> = BaseAnimatableProps & {
  [K in keyof T]: Prop<PropType>;
};