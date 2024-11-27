import React, { createContext, useContext } from 'react';
import { AnimatableContextType } from './types';
import { useAnimatable } from './useAnimatable';

const AnimatableContext = createContext<AnimatableContextType | null>(null);

export function useAnimatableContext() {
  const context = useContext(AnimatableContext);
  if (!context) {
    throw new Error('useAnimatableContext must be used within an AnimatableProvider');
  }
  return context;
}

interface AnimatableProviderProps {
  children: React.ReactNode;
}

export function AnimatableProvider({ children }: AnimatableProviderProps) {
  const animatable = useAnimatable();

  return (
    <AnimatableContext.Provider value={animatable}>
      {children}
    </AnimatableContext.Provider>
  );
}