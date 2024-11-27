import React, { createContext, useContext } from 'react';
import { ScreenInfo } from './types';
import { useScreen } from './useScreen';

const ScreenContext = createContext<ScreenInfo | null>(null);

export function useScreenContext() {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
}

interface ScreenProviderProps {
  children: React.ReactNode;
}

export function ScreenProvider({ children }: ScreenProviderProps) {
  const screenInfo = useScreen();
  
  return (
    <ScreenContext.Provider value={screenInfo}>
      {children}
    </ScreenContext.Provider>
  );
}