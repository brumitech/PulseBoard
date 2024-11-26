import React from 'react';
import { IAnimatable } from '@pulseboard/shared';

interface PreviewProps {
  currentTime: number;
  animatables: IAnimatable<any, any>[];
}

export const Preview: React.FC<PreviewProps> = ({ currentTime, animatables }) => {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {animatables.map((animatable) => {
        const Component = animatable.component;
        return (
          <Component
            key={animatable.id}
            {...animatable.componentProps}
            {...Object.fromEntries(
              Object.entries(animatable.props).map(([key, prop]) => [key, prop])
            )}
          />
        );
      })}
    </div>
  );
};