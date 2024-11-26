import { useState, useRef, useCallback } from 'react';
import { IAnimatable, Keyframe } from '../types';
import { Animation } from '../animation';
import { Prop } from '../prop';

interface UseAnimationState {
  selectedAnimatableId: string | null;
  selectedKeyframeId: string | null;
  isPlaying: boolean;
  currentTime: number;
  animatables: IAnimatable<any, any>[];
}

export function useAnimation(initialDuration: number = 3000) {
  const [state, setState] = useState<UseAnimationState>({
    selectedAnimatableId: null,
    selectedKeyframeId: null,
    isPlaying: false,
    currentTime: 0,
    animatables: [],
  });

  const animationRef = useRef<Animation | null>(null);

  // Initialize animation
  const initAnimation = useCallback(() => {
    console.log('Initializing animation with animatables:', state.animatables);
    
    // Always create a new animation instance
    if (animationRef.current) {
      animationRef.current.pause();
    }
    
    animationRef.current = new Animation(
      crypto.randomUUID(),
      initialDuration,
      state.animatables
    );
  
    // Override setT to update currentTime
    const originalSetT = animationRef.current.setT.bind(animationRef.current);
    animationRef.current.setT = (t: number) => {
      console.log('Animation setT called with:', t);
      originalSetT(t);
      setState(prev => ({ ...prev, currentTime: t }));
    };
  }, [initialDuration, state.animatables]);

  // Add animatable
  const addAnimatable = useCallback((animatable: IAnimatable<any, any>) => {
    console.log('Adding animatable:', animatable);
    setState(prev => {
      const newAnimatables = [...prev.animatables, {
        ...animatable,
        props: Object.entries(animatable.props).reduce((acc, [key, value]) => {
          if (value instanceof Prop) {
            acc[key] = new Prop(value.value, value.type, value.text, value.groupTag);
          } else {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>),
        keyframes: [{
          timestamp: 0,
          props: Object.entries(animatable.props).reduce((acc, [key, value]) => {
            acc[key] = value instanceof Prop ? value.value : value;
            return acc;
          }, {} as Record<string, any>)
        }]
      }];

      if (animationRef.current) {
        animationRef.current = new Animation(
          animationRef.current.id,
          initialDuration,
          newAnimatables
        );
      }

      return {
        ...prev,
        animatables: newAnimatables
      };
    });
  }, [initialDuration]);
  // Remove animatable
  const removeAnimatable = useCallback((id: string) => {
    setState(prev => {
      const newAnimatables = prev.animatables.filter(a => a.id !== id);
      
      if (animationRef.current) {
        animationRef.current = new Animation(
          animationRef.current.id,
          initialDuration,
          newAnimatables
        );
      }

      return {
        ...prev,
        animatables: newAnimatables,
        selectedAnimatableId: prev.selectedAnimatableId === id ? null : prev.selectedAnimatableId,
        selectedKeyframeId: prev.selectedAnimatableId === id ? null : prev.selectedKeyframeId
      };
    });
  }, [initialDuration]);

  // Add keyframe
const addKeyframe = useCallback((animatableId: string, timestamp: number) => {
  console.log('Adding keyframe:', { animatableId, timestamp });
  
  setState(prev => {
    // Find the animatable and check if it exists
    const newAnimatables = [...prev.animatables];
    const animatableIndex = newAnimatables.findIndex(a => a.id === animatableId);
    
    if (animatableIndex === -1) {
      console.warn('Animatable not found:', animatableId);
      return prev;
    }

    const animatable = newAnimatables[animatableIndex];

    // Check if keyframe already exists at this timestamp
    const tolerance = 10; // 10ms tolerance
    const existingKeyframe = animatable.keyframes.find(
      kf => Math.abs(kf.timestamp - timestamp) < tolerance
    );

    if (existingKeyframe) {
      console.log('Keyframe already exists at this timestamp');
      return prev;
    }
      
    // Create new keyframe with current prop values
    const newKeyframe: Keyframe<any> = {
      timestamp,
      props: Object.entries(animatable.props).reduce((acc, [key, prop]) => {
        const typedProp = prop as Prop<any>;
        acc[key] = typedProp.value;
        return acc;
      }, {} as Record<string, any>)
    };

    // Add keyframe and sort
    animatable.keyframes.push(newKeyframe);
    animatable.keyframes.sort((a, b) => a.timestamp - b.timestamp);

    // Find the index of the new keyframe
    const newKeyframeIndex = animatable.keyframes.findIndex(
      kf => kf.timestamp === timestamp
    );

    // Create single new animation instance
    const newAnimationRef = new Animation(
      crypto.randomUUID(),
      initialDuration,
      newAnimatables
    );

    // Replace current animation
    if (animationRef.current) {
      animationRef.current.pause();
    }
    animationRef.current = newAnimationRef;

    return {
      ...prev,
      animatables: newAnimatables,
      selectedKeyframeId: newKeyframeIndex.toString()
    };
  });
}, [initialDuration]);

  // Update keyframe
  const updateKeyframe = useCallback((
    animatableId: string,
    keyframeIndex: number,
    updates: Partial<Keyframe<any>>
  ) => {
    setState(prev => {
      const newAnimatables = [...prev.animatables];
      const animatableIndex = newAnimatables.findIndex(a => a.id === animatableId);
      if (animatableIndex === -1) return prev;

      const animatable = newAnimatables[animatableIndex];
      if (!animatable.keyframes[keyframeIndex]) return prev;

      animatable.keyframes[keyframeIndex] = {
        ...animatable.keyframes[keyframeIndex],
        ...updates,
      };

      if (updates.timestamp !== undefined) {
        animatable.keyframes.sort((a, b) => a.timestamp - b.timestamp);
      }

      if (animationRef.current) {
        animationRef.current.setT(prev.currentTime);
      }

      return { ...prev, animatables: newAnimatables };
    });
  }, []);

  // Remove keyframe
  const removeKeyframe = useCallback((animatableId: string, keyframeIndex: number) => {
    setState(prev => {
      const newAnimatables = [...prev.animatables];
      const animatableIndex = newAnimatables.findIndex(a => a.id === animatableId);
      if (animatableIndex === -1) return prev;

      const animatable = newAnimatables[animatableIndex];
      if (keyframeIndex === 0) return prev; // Don't remove the first keyframe

      animatable.keyframes.splice(keyframeIndex, 1);

      return { ...prev, animatables: newAnimatables };
    });
  }, []);

  return {
    // State
    currentTime: state.currentTime,
    isPlaying: state.isPlaying,
    selectedAnimatableId: state.selectedAnimatableId,
    selectedKeyframeId: state.selectedKeyframeId,
    animatables: state.animatables,
    duration: initialDuration,

   // Animation controls
play: useCallback(() => {
  console.log('Play called, current animation:', animationRef.current);
  if (!animationRef.current) {
    console.log('No animation instance, initializing...');
    initAnimation();
  }
  animationRef.current?.play();
  setState(prev => ({ ...prev, isPlaying: true }));
}, [initAnimation]),

pause: useCallback(() => {
  console.log('Pause called, current animation:', animationRef.current);
  if (!animationRef.current) {
    console.log('No animation instance, initializing...');
    initAnimation();
  }
  animationRef.current?.pause();
  setState(prev => ({ ...prev, isPlaying: false }));
}, [initAnimation]),

stop: useCallback(() => {
  console.log('Stop called, current animation:', animationRef.current);
  if (!animationRef.current) {
    console.log('No animation instance, initializing...');
    initAnimation();
  }
  animationRef.current?.stop();
  setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
}, [initAnimation]),

setTime: useCallback((time: number) => {
  console.log('SetTime called with:', time);
  if (!animationRef.current) {
    console.log('No animation instance, initializing...');
    initAnimation();
  }
  animationRef.current?.setT(time);
}, [initAnimation]),

    // Initialization
    initAnimation,

    // Animatable management
    addAnimatable,
    removeAnimatable,
    selectAnimatable: useCallback((id: string | null) => {
      setState(prev => ({ ...prev, selectedAnimatableId: id, selectedKeyframeId: null }));
    }, []),

    // Keyframe management
    addKeyframe,
    updateKeyframe,
    removeKeyframe,
    selectKeyframe: useCallback((animatableId: string, keyframeId: string) => {
      console.log('Selecting keyframe:', { animatableId, keyframeId });

      setState(prev => ({
        ...prev,
        selectedAnimatableId: animatableId,
        selectedKeyframeId: keyframeId
      }));
    }, []),
  };
}