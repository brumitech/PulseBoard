import { interpolate } from './prop';
import { IAnimation, IAnimatable, Keyframe } from './types';

export class Animation implements IAnimation {
  id: string;
  duration: number;
  animatables: IAnimatable<any>[];
  private running = false;
  private startTime: number | null = null;
  private rafId: number | null = null;
  private generalTime: number = 0; // Elapsed time since animation start
  private initialProps: Record<string, any>[] = []; // Stores initial props for each animatable

  constructor(id: string, duration: number, animatables: IAnimatable<any>[]) {
    this.id = id;
    this.duration = duration;
    this.animatables = animatables;

    // Store initial props and ensure the first keyframe exists
    this.animatables.forEach((animatable) => {
      // Store deep clones of the initial props
      this.initialProps.push(
        Object.keys(animatable.props).reduce((acc, key) => {
          acc[key] = { ...animatable.props[key] }; // Clone each Prop object
          return acc;
        }, {} as Record<string, any>)
      );

      // Add the first keyframe if it doesn't exist
      if (animatable.keyframes.length === 0 || animatable.keyframes[0].timestamp !== 0) {
        animatable.keyframes.unshift({
          timestamp: 0,
          props: Object.entries(animatable.props).reduce((acc, [key, prop]) => {
            acc[key] = prop.value; // Extract the value for keyframes
            return acc;
          }, {} as Record<string, any>),
        });
      }
    });
  }

  resetProps() {
    this.animatables.forEach((animatable, index) => {
      // Reset props to their initial values
      animatable.props = Object.keys(this.initialProps[index]).reduce((acc, key) => {
        acc[key] = { ...this.initialProps[index][key] }; // Deep clone the Prop object
        return acc;
      }, {} as Record<string, any>);
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
    this.generalTime = t;

    this.animatables.forEach((animatable) => {
      const { keyframes, props, onStart, onUpdate, onEnd } = animatable;

      // Find surrounding keyframes
      const prevKeyframe = keyframes.slice().reverse().find((kf) => kf.timestamp <= t);
      const nextKeyframe = keyframes.find((kf) => kf.timestamp > t);

      if (prevKeyframe && nextKeyframe) {
        const progress =
          (t - prevKeyframe.timestamp) / (nextKeyframe.timestamp - prevKeyframe.timestamp);

        // Interpolate each prop value
        Object.entries(props).forEach(([key, prop]) => {
          const prevValue = prevKeyframe.props[key];
          const nextValue = nextKeyframe.props[key] ?? prevValue;

          if (prevValue !== undefined && nextValue !== undefined) {
            prop.value = interpolate(prevValue, nextValue, progress, prop.type);
          }
        });

        onUpdate?.(animatable, this.generalTime);
      } else if (prevKeyframe) {
        // Apply the last keyframe prop values
        Object.entries(prevKeyframe.props).forEach(([key, value]) => {
          if (value !== undefined) {
            props[key].value = value;
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
