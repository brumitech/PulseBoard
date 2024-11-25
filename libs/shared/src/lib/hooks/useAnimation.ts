// libs/shared/src/lib/hooks/useAnimation.ts
import { useState, useRef, useCallback } from 'react';
import { IAnimatable, Keyframe } from '../types';
import { Animation } from '../animation';
import { Prop } from '../prop';
interface UseAnimationState {
  selectedAnimatableId: string | null;
  selectedKeyframeId: string | null;
  isPlaying: boolean;
  currentTime: number;
}

export function useAnimation(initialDuration: number = 3000) {
  const [state, setState] = useState<UseAnimationState>({
    selectedAnimatableId: null,
    selectedKeyframeId: null,
    isPlaying: false,
    currentTime: 0,
  });

  const animationRef = useRef<Animation | null>(null);
  const animatablesRef = useRef<IAnimatable<any, any>[]>([]);

  // Initialize or fetch animation
  const initAnimation = useCallback(async (id?: string) => {
    if (id) {
      try {
        // TODO: Fetch animation from backend
        const response = await fetch(`/api/animations/${id}`);
        const data = await response.json();
        animatablesRef.current = data.animatables;
      } catch (error) {
        console.error('Failed to fetch animation:', error);
      }
    }

    animationRef.current = new Animation(
      id || crypto.randomUUID(),
      initialDuration,
      animatablesRef.current
    );

    // Override setT to update currentTime
    const originalSetT = animationRef.current.setT.bind(animationRef.current);
    animationRef.current.setT = (t: number) => {
      originalSetT(t);
      setState(prev => ({ ...prev, currentTime: t }));
    };
  }, [initialDuration]);

  // Animation controls
  const play = useCallback(() => {
    animationRef.current?.play();
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    animationRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    animationRef.current?.stop();
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  const setTime = useCallback((time: number) => {
    animationRef.current?.setT(time);
  }, []);

  // Animatable management
  const addAnimatable = useCallback((animatable: IAnimatable<any, any>) => {
    animatablesRef.current.push(animatable);
    animationRef.current = new Animation(
      animationRef.current?.id || '',
      animationRef.current?.duration || initialDuration,
      animatablesRef.current
    );
  }, [initialDuration]);

  const removeAnimatable = useCallback((id: string) => {
    animatablesRef.current = animatablesRef.current.filter(a => a.id !== id);
    if (state.selectedAnimatableId === id) {
      setState(prev => ({ ...prev, selectedAnimatableId: null, selectedKeyframeId: null }));
    }
    animationRef.current = new Animation(
      animationRef.current?.id || '',
      animationRef.current?.duration || initialDuration,
      animatablesRef.current
    );
  }, [initialDuration, state.selectedAnimatableId]);

  // Keyframe management
  const addKeyframe = useCallback((animatableId: string, timestamp: number, props: Record<string, any>) => {
    const animatable = animatablesRef.current.find(a => a.id === animatableId);
    if (!animatable) return;

    const keyframe: Keyframe<any> = {
      timestamp,
      props: Object.entries(props).reduce((acc, [key, value]) => {
        if (value instanceof Prop) {
          acc[key] = value.value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
    };

    animatable.keyframes.push(keyframe);
    // Sort keyframes by timestamp
    animatable.keyframes.sort((a, b) => a.timestamp - b.timestamp);
  }, []);

  const updateKeyframe = useCallback((
    animatableId: string, 
    keyframeIndex: number, 
    updates: Partial<Keyframe<any>>
  ) => {
    const animatable = animatablesRef.current.find(a => a.id === animatableId);
    if (!animatable || !animatable.keyframes[keyframeIndex]) return;

    animatable.keyframes[keyframeIndex] = {
      ...animatable.keyframes[keyframeIndex],
      ...updates,
    };

    // Re-sort if timestamp was updated
    if (updates.timestamp !== undefined) {
      animatable.keyframes.sort((a, b) => a.timestamp - b.timestamp);
    }
  }, []);

  const removeKeyframe = useCallback((animatableId: string, keyframeIndex: number) => {
    const animatable = animatablesRef.current.find(a => a.id === animatableId);
    if (!animatable) return;

    animatable.keyframes.splice(keyframeIndex, 1);
  }, []);

  // Selection handlers
  const selectAnimatable = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedAnimatableId: id, selectedKeyframeId: null }));
  }, []);

  const selectKeyframe = useCallback((animatableId: string, keyframeId: string) => {
    setState(prev => ({
      ...prev,
      selectedAnimatableId: animatableId,
      selectedKeyframeId: keyframeId
    }));
  }, []);

  return {
    // State
    currentTime: state.currentTime,
    isPlaying: state.isPlaying,
    selectedAnimatableId: state.selectedAnimatableId,
    selectedKeyframeId: state.selectedKeyframeId,
    animatables: animatablesRef.current,
    duration: animationRef.current?.duration || initialDuration,

    // Animation controls
    play,
    pause,
    stop,
    setTime,

    // Initialization
    initAnimation,

    // Animatable management
    addAnimatable,
    removeAnimatable,
    selectAnimatable,

    // Keyframe management
    addKeyframe,
    updateKeyframe,
    removeKeyframe,
    selectKeyframe,
  };
}