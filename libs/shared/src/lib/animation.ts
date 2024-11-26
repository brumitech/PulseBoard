import { interpolate, Prop } from './prop';
import { IAnimation, IAnimatable, Keyframe } from './types';

export class Animation implements IAnimation {
  id: string;
  duration: number;
  animatables: IAnimatable<any, any>[];
  private running = false;
  private startTime: number | null = null;
  private rafId: number | null = null;
  private generalTime: number = 0; // Elapsed time since animation start
  private initialProps: Record<string, any>[] = []; // Stores initial props for each animatable

  constructor(
    id: string,
    duration: number,
    animatables: IAnimatable<any, any>[]
  ) {
    this.id = id;
    this.duration = duration;
    this.animatables = animatables;

    console.log(
      'Animation constructor - Initializing with animatables:',
      animatables
    );

    this.animatables.forEach((animatable) => {
      console.log('Processing animatable:', animatable.id);

      // Store deep clones of the initial props
      const initialProps = Object.entries(animatable.props).reduce(
        (acc, [key, prop]) => {
          console.log('Cloning prop:', key, prop);
          if (prop instanceof Prop) {
            acc[key] = new Prop(
              prop.value,
              prop.type,
              prop.text,
              prop.groupTag
            );
          } else {
            acc[key] = prop;
          }
          return acc;
        },
        {} as Record<string, Prop<any>>
      );

      this.initialProps.push(initialProps);

      // Add the first keyframe if it doesn't exist
      if (
        animatable.keyframes.length === 0 ||
        animatable.keyframes[0].timestamp !== 0
      ) {
        console.log('Adding initial keyframe for animatable:', animatable.id);
        const initialKeyframe = {
          timestamp: 0,
          props: Object.entries(animatable.props).reduce((acc, [key, prop]) => {
            if (prop instanceof Prop) {
              acc[key] = prop.value;
            } else {
              acc[key] = prop;
            }
            return acc;
          }, {} as Record<string, any>),
        };
        animatable.keyframes.unshift(initialKeyframe);
      }

      animatable.once?.(animatable);
    });
  }

  resetProps() {
    this.animatables.forEach((animatable, index) => {
      // Reset props to their initial values
      animatable.props = Object.keys(this.initialProps[index]).reduce(
        (acc, key) => {
          acc[key] = { ...this.initialProps[index][key] }; // Deep clone the Prop object
          return acc;
        },
        {} as Record<string, any>
      );
    });
  }

  getT() {
    return this.generalTime % this.duration;
  }

  play() {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now();
    this.loop();
  }

  pause() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  stop() {
    this.pause();
    this.generalTime = 0;

    // Reset props to initial values
    this.resetProps();

    this.setT(0); // Reset animation state
  }

  setT(t: number) {
    console.log('Setting time:', t);

    this.generalTime = t;

    this.animatables.forEach((animatable) => {
      console.log('Processing animatable for time update:', animatable.id);

      const { keyframes, props, onStart, onUpdate, onEnd } = animatable;

      // Find surrounding keyframes
      const prevKeyframe = keyframes
        .slice()
        .reverse()
        .find((kf) => kf.timestamp <= t);
      const nextKeyframe = keyframes.find((kf) => kf.timestamp > t);

      console.log('Found keyframes:', {
        prev: prevKeyframe?.timestamp,
        next: nextKeyframe?.timestamp,
      });
   
      if (prevKeyframe && nextKeyframe) {
        const progress =
          (t - prevKeyframe.timestamp) /
          (nextKeyframe.timestamp - prevKeyframe.timestamp);

        // Interpolate each prop value
        Object.entries(props).forEach(([key, prop]) => {
          // Add type assertion here
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

        onUpdate?.(animatable, this.generalTime);
      } else if (prevKeyframe) {
        // Apply the last keyframe prop values
        Object.entries(prevKeyframe.props).forEach(([key, value]) => {
          if (value !== undefined) {
            const typedProp = props[key] as Prop<any>;
            typedProp.value = value;
          }
        });

        if (t >= animatable.start + animatable.duration) {
          onEnd?.(animatable, this.generalTime);
        }
      }

      if (t === 0) {
        this.resetProps();
        onStart?.(animatable, this.generalTime);
      }
    });
  }

  private loop() {
    if (!this.running) return;

    const elapsed = performance.now() - (this.startTime || 0);
    const t = elapsed % this.duration;

    this.setT(t);
    this.rafId = requestAnimationFrame(() => this.loop());
  }
}
