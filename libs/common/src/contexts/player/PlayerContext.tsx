import React, { createContext, useContext } from 'react';
import { PlayerContextType } from './types';
import { usePlayer } from './usePlayer';

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
}

interface PlayerProviderProps {
  children: React.ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const player = usePlayer();

  return (
    <PlayerContext.Provider value={player}>
      {children}
    </PlayerContext.Provider>
  );
}