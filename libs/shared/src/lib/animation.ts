import { IAnimation, IAnimatable } from './types';
import { interpolate, Prop } from './prop';

export class Animation implements IAnimation {
  constructor(
    public id: string,
    public duration: number,
    public animatables: IAnimatable<any, any>[]
  ) {}

  setT(t: number) {
    this.animatables.forEach((animatable) => {
      const { keyframes, props } = animatable;
      
      const prevKeyframe = keyframes
        .slice()
        .reverse()
        .find((kf) => kf.timestamp <= t);
      const nextKeyframe = keyframes.find((kf) => kf.timestamp > t);

      if (prevKeyframe && nextKeyframe) {
        const progress = (t - prevKeyframe.timestamp) / 
                        (nextKeyframe.timestamp - prevKeyframe.timestamp);

        Object.entries(props).forEach(([key, prop]) => {
          const typedProp = prop as Prop<any>;
          const prevValue = prevKeyframe.props[key];
          const nextValue = nextKeyframe.props[key] ?? prevValue;

          if (prevValue !== undefined && nextValue !== undefined) {
            typedProp.value = interpolate(
              prevValue,
              nextValue,
              progress,
              typedProp.type
            );
          }
        });
      } else if (prevKeyframe) {
        Object.entries(prevKeyframe.props).forEach(([key, value]) => {
          if (value !== undefined) {
            const typedProp = props[key] as Prop<any>;
            typedProp.value = value;
          }
        });
      }
    });
  }
}