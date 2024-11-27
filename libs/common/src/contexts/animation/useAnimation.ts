import { useState, useCallback } from 'react';
import { Animation, IAnimation, IAnimatable } from '@pulseboard/common';
import { AnimationState } from './types';

export function useAnimation() {
  const [state, setState] = useState<AnimationState>({
    animation: null,
    selectedAnimatable: null,
    currentTime: 0,
    isPlaying: false,
    duration: 3000,
    animatables: [],
  });

  const initAnimation = useCallback(() => {
    const animation = new Animation(
      crypto.randomUUID(),
      state.duration,
      state.animatables
    );
    setState(prev => ({ ...prev, animation }));
  }, [state.duration, state.animatables]);

  const setAnimation = useCallback((animation: IAnimation | null) => {
    setState(prev => ({ ...prev, animation }));
  }, []);

  const selectAnimatable = useCallback((animatable: IAnimatable | null) => {
    setState(prev => ({ ...prev, selectedAnimatable: animatable }));
  }, []);

  const addAnimatable = useCallback((animatable: IAnimatable) => {
    setState(prev => {
      const newAnimatables = [...prev.animatables, animatable];
      const newAnimation = new Animation(
        prev.animation?.id || crypto.randomUUID(),
        prev.duration,
        newAnimatables
      );
      return {
        ...prev,
        animatables: newAnimatables,
        animation: newAnimation
      };
    });
  }, []);

  const removeAnimatable = useCallback((id: string) => {
    setState(prev => {
      const newAnimatables = prev.animatables.filter(a => a.id !== id);
      const newAnimation = new Animation(
        prev.animation?.id || crypto.randomUUID(),
        prev.duration,
        newAnimatables
      );
      return {
        ...prev,
        animatables: newAnimatables,
        animation: newAnimation,
        selectedAnimatable: prev.selectedAnimatable?.id === id ? null : prev.selectedAnimatable
      };
    });
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setState(prev => ({ ...prev, isPlaying }));
  }, []);

  return {
    ...state,
    setAnimation,
    selectAnimatable,
    addAnimatable,
    removeAnimatable,
    initAnimation,
    setCurrentTime,
    setIsPlaying,
  };
}