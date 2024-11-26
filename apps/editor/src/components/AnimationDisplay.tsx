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
    <div className="relative w-full h-full bg-gray-100">
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
  );
};

export default AnimationDisplay;