import React, { useEffect } from 'react';
import { ScreenProvider } from './screen/ScreenContext';
import { AnimationProvider } from './animation/AnimationContext';
import { AnimatableProvider } from './animatable/AnimatableContext';
import { PlayerProvider } from './player/PlayerContext';
import { widgetRegistry } from '../widgets/registry';
import { RectangleWidget } from '../widgets/Rectangle';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    useEffect(() => {
        widgetRegistry.register(RectangleWidget);
    }, [])

    return (
        <AnimationProvider>
            <PlayerProvider>
                <AnimatableProvider>
                    <ScreenProvider>
                        {children}
                    </ScreenProvider>
                </AnimatableProvider>
            </PlayerProvider>
        </AnimationProvider>
    );
};