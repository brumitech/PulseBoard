import { ComponentType } from 'react'

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
    onStart?: (animatable: IAnimatable<TProps>, t: number) => void; // Called when animation starts
    onUpdate?: (animatable: IAnimatable<TProps>, t: number) => void; // Called during updates
    onEnd?: (animatable: IAnimatable<TProps>, t: number) => void; // Called when animation ends
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
}

export type InterpolationFn = (a: number, b: number, t: number) => number;