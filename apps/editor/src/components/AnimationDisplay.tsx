import React from 'react';
import { IAnimation } from '@pulseboard/shared';

interface AnimationDisplayProps {
  animation: IAnimation;
  currentTime: number;
}

const AnimationDisplay: React.FC<AnimationDisplayProps> = ({
  animation,
  currentTime,
}) => {
  React.useEffect(() => {
    // Update animation state based on current time
    animation.setT(currentTime);
  }, [animation, currentTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-blue-100 to-gray-200 mb-6">
          Animation
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-6" />

        <div className="group relative h-full">
          <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50" />
          
          <div className="relative bg-gradient-to-r from-gray-800/95 to-gray-800/90 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm h-full">
            {animation.animatables.map((animatable) => {
              const Component = animatable.component;
              const isVisible =
                currentTime >= animatable.start &&
                currentTime <= animatable.start + animatable.duration;

              if (!isVisible) return null;

              return (
                <div
                  key={animatable.id}
                  style={{
                    position: 'absolute',
                    transform: `translate(${animatable.props.x.value}px, ${animatable.props.y.value}px) scale(${animatable.props.scale.value})`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                    ...animatable.containerStyle,
                  }}
                >
                  <Component {...animatable.props} {...animatable.componentProps} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDisplay;