import { useCallback } from 'react';
import { Animation, IAnimatable, Keyframe } from '@pulseboard/common';
import { useAnimationContext } from '../animation/AnimationContext';

export function useAnimatable() {
  const { animation, selectedAnimatable, setAnimation } = useAnimationContext();

  const updateAnimatable = useCallback((updates: Partial<IAnimatable<any>>) => {
    if (!animation || !selectedAnimatable) return;

    const updatedAnimatables = animation.animatables.map(a =>
      a.id === selectedAnimatable.id ? { ...a, ...updates } : a
    ) as IAnimatable<any>[];

    setAnimation(new Animation(animation.id, animation.duration, updatedAnimatables));
  }, [animation, selectedAnimatable, setAnimation]);

  const addKeyframe = useCallback((timestamp: number, props: Record<string, any>) => {
    if (!animation || !selectedAnimatable) return;

    const animatable = animation.animatables.find(a => a.id === selectedAnimatable.id);
    if (!animatable) return;

    const newKeyframe: Keyframe = { timestamp, props };
    const updatedKeyframes = [...animatable.keyframes, newKeyframe]
      .sort((a, b) => a.timestamp - b.timestamp);

    updateAnimatable({ keyframes: updatedKeyframes });
  }, [animation, selectedAnimatable, updateAnimatable]);

  const updateKeyframe = useCallback((keyframeIndex: number, updates: Partial<Keyframe>) => {
    if (!animation || !selectedAnimatable) return;

    const animatable = animation.animatables.find(a => a.id === selectedAnimatable.id);
    if (!animatable) return;

    const updatedKeyframes = [...animatable.keyframes];
    updatedKeyframes[keyframeIndex] = { ...updatedKeyframes[keyframeIndex], ...updates };

    if (updates.timestamp !== undefined) {
      updatedKeyframes.sort((a, b) => a.timestamp - b.timestamp);
    }

    updateAnimatable({ keyframes: updatedKeyframes });
  }, [animation, selectedAnimatable, updateAnimatable]);

  const removeKeyframe = useCallback((keyframeIndex: number) => {
    if (!animation || !selectedAnimatable) return;

    const animatable = animation.animatables.find(a => a.id === selectedAnimatable.id);
    if (!animatable) return;

    if (keyframeIndex === 0) return; 

    const updatedKeyframes = animatable.keyframes.filter((_, index) => index !== keyframeIndex);
    updateAnimatable({ keyframes: updatedKeyframes });
  }, [animation, selectedAnimatable, updateAnimatable]);

  return {
    selectedAnimatable,
    updateAnimatable,
    addKeyframe,
    updateKeyframe,
    removeKeyframe,
  };
}