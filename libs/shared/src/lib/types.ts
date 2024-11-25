// libs/shared/src/lib/types.ts
import { ComponentType } from 'react'
import { Easing } from './easing';

// db
export interface IScreen {
    id: string;
    animationId: string;
    latitude: number;
    longitude: number;
}

// db
export interface IAnimation {
    id: string;
    duration: number;
    animatables: IAnimatable<any>[];
    play: () => void;
    pause: () => void;
    stop: () => void;
    setT: (t: number) => void;
}

// db
export interface IAnimatable<TProps extends object> {
    id: string;
    component: ComponentType<TProps>;
    start: number;
    duration: number;
    keyframes: Keyframe<TProps>[];
    props: TProps;
    containerStyle?: React.CSSProperties;

    // Lifecycle hooks
    onStart?: (animatable: IAnimatable<TProps>, t: number) => void;
    onUpdate?: (animatable: IAnimatable<TProps>, t: number) => void;
    onEnd?: (animatable: IAnimatable<TProps>, t: number) => void;
}

export interface BaseWidgetProps {
    x: number;
    y: number;
    scale: number;
    colorR: number;
    colorG: number;
    colorB: number;
}

// db
export interface IWidget extends IAnimatable<BaseWidgetProps> {
}

// db
export interface Keyframe<TProps extends object> {
    timestamp: number; // ms
    props: TProps;
    easing?: keyof typeof Easing;
}

export type InterpolationFn = (a: number, b: number, t: number) => number;

// Updated TimelineKeyframe to extend from Keyframe with BaseWidgetProps
export interface TimelineKeyframe extends Keyframe<BaseWidgetProps> {
    timestamp: number;
    props: BaseWidgetProps;
    easing?: keyof typeof Easing;
}

export interface TimelineItem {
    id: string;
    widgetType: 'aqi' | 'temperature';
    duration: number;
    keyframes: TimelineKeyframe[];
}

export interface Timeline {
    items: TimelineItem[];
    duration: number;
}