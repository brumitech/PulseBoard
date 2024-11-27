import React from 'react';
import { IAnimatable } from '@pulseboard/shared';
import useScreen from './useScreen';

interface PreviewProps {
  currentTime: number;
  animatables: IAnimatable<any, any>[];
}

export const Preview: React.FC<PreviewProps> = ({ currentTime, animatables }) => {
  const { width, height, scale } = useScreen();

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      {/* Virtual canvas */}
      <div
        className="relative bg-gray-800 rounded-lg border border-gray-700/50"
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
          overflow: 'hidden', // Prevent overflow
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
        }}
      >
        {/* Animatable Components */}
        {animatables.map((animatable) => {
          const Component = animatable.component;

          const isVisible =
            currentTime >= animatable.start &&
            currentTime <= animatable.start + animatable.duration;

          if (!isVisible) return null;

          // Constrain `x` and `y` to stay within the bounds of the panel
          const clampedX = clamp(
            animatable.props.x.value * scale,
            0,
            width * scale - animatable.props.width.value * scale
          );
          const clampedY = clamp(
            animatable.props.y.value * scale,
            0,
            height * scale - animatable.props.height.value * scale
          );

          return (
            <div
              key={animatable.id}
              style={{
                position: 'absolute',
                transform: `translate(${clampedX}px, ${clampedY}px) scale(${animatable.props.scale.value * scale})`,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.2s',
              }}
            >
              <Component {...animatable.props} {...animatable.componentProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Preview;
