import { Interpolators } from "./utils";

export type PropType = 'number' | 'string' | 'color';

export class Prop<T> {
    constructor(
        public value: T,
        public type: PropType,
        public text: string,
        public groupTag?: string
    ) { }

    static number(value: number, text: string, groupTag?: string): Prop<number> {
        return new Prop<number>(value, 'number', text, groupTag);
    }

    static string(value: string, text: string, groupTag?: string): Prop<string> {
        return new Prop<string>(value, 'string', text, groupTag);
    }

    static color(value: string, text: string, groupTag?: string): Prop<color> {
        return new Prop<string>(value, 'color', text, groupTag);
    }
}

export function interpolate(
    a: any,
    b: any,
    t: number,
    type: string
): any {
    switch (type) {
        case 'number':
            return Interpolators.number(a as number, b as number, t);
        case 'color':
            return Interpolators.color(a as string, b as string, t);
        case 'string':
            return Interpolators.string(a as string, b as string, t);
        default:
            return a;
    }
}

export interface BaseWidgetProps {
    x: Prop<number>;
    y: Prop<number>;
    scale: Prop<number>;
    color: Prop<string>;
}