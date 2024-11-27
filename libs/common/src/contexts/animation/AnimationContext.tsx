import React, { createContext, useContext } from 'react';
import { AnimationContextType } from './types';
import { useAnimation } from './useAnimation';

const AnimationContext = createContext<AnimationContextType | null>(null);

export function useAnimationContext() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
}

interface AnimationProviderProps {
  children: React.ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const animation = useAnimation();

  return (
    <AnimationContext.Provider value={animation}>
      {children}
    </AnimationContext.Provider>
  );
}