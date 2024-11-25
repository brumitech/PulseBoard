import { ComponentType } from 'react';
import { Prop } from './prop';

export interface IScreen {
    id: string;
    animationId: string;
    latitude: number;
    longitude: number;
}

export interface IAnimation {
    id: string;
    duration: number;
    animatables: IAnimatable<any, any>[];
    play: () => void;
    pause: () => void;
    stop: () => void;
    setT: (t: number) => void;
}

export interface IAnimatable<TProps extends object, CProps extends object> {
    id: string;
    component: ComponentType<TProps & CProps>;
    componentProps: CProps;
    start: number;
    duration: number;
    keyframes: Keyframe<any>[];
    props: TProps;
    containerStyle?: React.CSSProperties;

    once?: (animatable: IAnimatable<TProps, CProps>) => void;
    onStart?: (animatable: IAnimatable<TProps, CProps>, t: number) => void;
    onUpdate?: (animatable: IAnimatable<TProps, CProps>, t: number) => void;
    onEnd?: (animatable: IAnimatable<TProps, CProps>, t: number) => void;
}

export interface Keyframe<TProps extends object> {
    timestamp: number;
    props: Partial<TProps>;
}

export interface WidgetDefinition<T = any> {
    id: string;
    name: string;
    description: string;
    category: string;
    defaultDuration: number;
    component: ComponentType<T>;
    defaultProps: {
        x: Prop<number>;
        y: Prop<number>;
        scale: Prop<number>;
        color: Prop<string>;
        [key: string]: any;
    };
}