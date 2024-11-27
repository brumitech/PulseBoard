import { IAnimatable, Keyframe } from '@pulseboard/common';

export interface AnimatableContextType {
  selectedAnimatable: IAnimatable<any> | null;
  updateAnimatable: (updates: Partial<IAnimatable<any>>) => void;
  addKeyframe: (timestamp: number, props: Record<string, any>) => void;
  updateKeyframe: (keyframeIndex: number, updates: Partial<Keyframe>) => void;
  removeKeyframe: (keyframeIndex: number) => void;
}