import { ComponentType } from 'react';
import { Prop, AnimatableProps, PropTypeToValue } from './core';

export type ExtractPropValue<P> = P extends Prop<infer T> ? PropTypeToValue[T] : never;

export type AnimatableValues<T> = {
  [K in keyof T]: ExtractPropValue<T[K]>;
};

export interface Keyframe<T extends Record<string, any> = any> {
  timestamp: number;
  props: Partial<AnimatableValues<AnimatableProps<T>>>;
}

export interface IAnimatable<T extends Record<string, any> = any> {
  id: string;
  component: ComponentType<AnimatableProps<T>>;
  componentProps: T;
  start: number;
  duration: number;
  keyframes: Keyframe<T>[];
  props: AnimatableProps<T>;
}

export interface IAnimation {
  id: string;
  duration: number;
  animatables: IAnimatable<any>[];
  setT: (t: number) => void;
}