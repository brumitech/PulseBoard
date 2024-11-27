import { IAnimation, IAnimatable } from '@pulseboard/common';

export interface AnimationState {
  animation: IAnimation | null;
  selectedAnimatable: IAnimatable<any> | null;
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  animatables: IAnimatable<any>[];
}

export interface AnimationContextType extends AnimationState {
  setAnimation: (animation: IAnimation | null) => void;
  selectAnimatable: (animatable: IAnimatable<any> | null) => void;
  addAnimatable: (animatable: IAnimatable<any>) => void;
  removeAnimatable: (id: string) => void;
  initAnimation: () => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}