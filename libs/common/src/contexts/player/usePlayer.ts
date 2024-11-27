import { useCallback, useRef, useEffect } from 'react';
import { useAnimationContext } from '../animation/AnimationContext';

export function usePlayer() {
  const { 
    animation,
    currentTime,
    isPlaying,
    setCurrentTime,
    setIsPlaying 
  } = useAnimationContext();
  
  const startTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const updateAnimation = useCallback((t: number) => {
    if (!animation) return;
    const normalizedTime = t % animation.duration;
    animation.setT(normalizedTime);
    setCurrentTime(normalizedTime);
  }, [animation, setCurrentTime]);

  const loop = useCallback(() => {
    if (!isPlaying || !startTimeRef.current || !animation) return;
    const elapsed = performance.now() - startTimeRef.current;
    updateAnimation(elapsed);
    rafIdRef.current = requestAnimationFrame(loop);
  }, [isPlaying, animation, updateAnimation]);

  const play = useCallback(() => {
    setIsPlaying(true);
    startTimeRef.current = performance.now() - currentTime;
  }, [currentTime, setIsPlaying]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, [setIsPlaying]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    updateAnimation(0);
  }, [setIsPlaying, updateAnimation]);

  const seekTo = useCallback((time: number) => {
    if (!animation) return;
    const clampedTime = Math.max(0, Math.min(time, animation.duration));
    updateAnimation(clampedTime);
    if (isPlaying) {
      startTimeRef.current = performance.now() - clampedTime;
    }
  }, [animation, isPlaying, updateAnimation]);

  useEffect(() => {
    if (isPlaying) {
      loop();
    }
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isPlaying, loop]);

  return { 
    isPlaying,
    play, 
    pause, 
    stop, 
    seekTo 
  };
}