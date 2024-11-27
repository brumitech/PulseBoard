import { IAnimatable, IAnimation, Keyframe } from "./anim";
import { AnimatableProps, PropType, PropTypeToValue } from "./core";

type InterpolationFunction<T> = (start: T, end: T, progress: number) => T;

const Interpolators: Record<PropType, InterpolationFunction<any>> = {
  number: (start: number, end: number, progress: number) => {
    return start + (end - start) * progress;
  },
  
  color: (start: string, end: string, progress: number) => {
    const parseColor = (color: string) => {
      const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      return match ? match.slice(1).map(Number) : [0, 0, 0];
    };

    const [r1, g1, b1] = parseColor(start);
    const [r2, g2, b2] = parseColor(end);

    return `rgb(${
      Math.round(r1 + (r2 - r1) * progress)
    }, ${
      Math.round(g1 + (g2 - g1) * progress)
    }, ${
      Math.round(b1 + (b2 - b1) * progress)
    })`;
  },

  string: (start: string, end: string, progress: number) => 
    progress > 0.5 ? end : start
};

export class Animation implements IAnimation {
  constructor(
    public id: string,
    public duration: number,
    public animatables: IAnimatable[]
  ) {}

  private interpolateValue<T extends PropType>(
    start: PropTypeToValue[T],
    end: PropTypeToValue[T],
    progress: number,
    type: T
  ): PropTypeToValue[T] {
    return Interpolators[type](start, end, progress);
  }

  private updateAnimatableProps<T>(
    props: AnimatableProps<T>,
    keyframe: Keyframe<AnimatableProps<T>>
  ) {
    type PropKey = keyof AnimatableProps<T>;
    
    (Object.keys(keyframe.props) as PropKey[]).forEach(key => {
      const value = keyframe.props[key];
      if (value !== undefined) {
        const prop = props[key];
        prop.value = value as PropTypeToValue[typeof prop.type];
      }
    });
  }

  private interpolateAnimatableProps<T>(
    props: AnimatableProps<T>,
    prevKeyframe: Keyframe<AnimatableProps<T>>,
    nextKeyframe: Keyframe<AnimatableProps<T>>,
    progress: number
  ) {
    type PropKey = keyof AnimatableProps<T>;

    (Object.keys(props) as PropKey[]).forEach(key => {
      const prop = props[key];
      const prevValue = prevKeyframe.props[key];
      const nextValue = nextKeyframe.props[key] ?? prevValue;

      if (prevValue !== undefined && nextValue !== undefined) {
        prop.value = this.interpolateValue(
          prevValue as PropTypeToValue[typeof prop.type],
          nextValue as PropTypeToValue[typeof prop.type],
          progress,
          prop.type
        );
      }
    });
  }

  setT(time: number) {
    this.animatables.forEach(animatable => {
      const { keyframes, props } = animatable;
      const prevKeyframe = keyframes
        .slice()
        .reverse()
        .find(kf => kf.timestamp <= time);
      const nextKeyframe = keyframes.find(kf => kf.timestamp > time);

      if (prevKeyframe && nextKeyframe) {
        const progress = (time - prevKeyframe.timestamp) / 
                        (nextKeyframe.timestamp - prevKeyframe.timestamp);
        this.interpolateAnimatableProps(props, prevKeyframe, nextKeyframe, progress);
      } else if (prevKeyframe) {
        this.updateAnimatableProps(props, prevKeyframe);
      }
    });
  }
}