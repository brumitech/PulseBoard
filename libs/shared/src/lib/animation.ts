import { Easing } from "./easing";
import { IAnimatable, IAnimation, InterpolationFn } from "./types";

export class Animation implements IAnimation {
    id: string;
    duration: number;
    animatables: IAnimatable<any>[];
    private running = false;
    private startTime: number | null = null;
    private rafId: number | null = null;
    private interpolationFn: InterpolationFn;
    private generalTime: number = 0; // Elapsed time since animation start

    constructor(
        id: string,
        duration: number,
        animatables: IAnimatable<any>[],
        interpolationFn: InterpolationFn
    ) {
        this.id = id;
        this.duration = duration;
        this.animatables = animatables;
        this.interpolationFn = interpolationFn;
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
        this.generalTime = 0; // Reset elapsed time
        this.setT(0); // Reset animation state
    }

    setT(t: number) {
        this.generalTime = t;

        this.animatables.forEach((animatable: IAnimatable<any>) => {
            const { keyframes, props, onStart, onUpdate, onEnd } = animatable;

            const prevKeyframe = keyframes.slice().reverse().find((kf) => kf.timestamp <= t);
            const nextKeyframe = keyframes.find((kf) => kf.timestamp > t);

            if (prevKeyframe && nextKeyframe) {
                const progress = (t - prevKeyframe.timestamp) /
                    (nextKeyframe.timestamp - prevKeyframe.timestamp);

                // Apply easing if specified
                const easedProgress = prevKeyframe.easing 
                    ? Easing[prevKeyframe.easing](progress)
                    : progress;

                const interpolatedProps = { ...props };
                for (const key of new Set([...Object.keys(prevKeyframe.props), ...Object.keys(nextKeyframe.props)])) {
                    const prevValue = prevKeyframe.props[key] ?? props[key];
                    const nextValue = nextKeyframe.props[key] ?? prevValue;

                    if (prevValue !== undefined && nextValue !== undefined) {
                        interpolatedProps[key] = this.interpolationFn(prevValue, nextValue, easedProgress);
                    }
                }

                animatable.props = interpolatedProps;
                onUpdate?.(animatable, this.generalTime);
            } else if (prevKeyframe) {
                animatable.props = { ...props, ...prevKeyframe.props };

                if (t >= this.duration) {
                    onEnd?.(animatable, this.generalTime);
                }
            }

            if (t === 0) {
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

    getGeneralTime(): number {
        return this.generalTime;
    }
}
