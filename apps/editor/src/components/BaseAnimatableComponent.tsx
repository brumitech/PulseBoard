import React, { useState, useRef, useCallback } from 'react';
import { IAnimatable } from '@pulseboard/shared';

interface BaseAnimatableComponentProps {
  animatable: IAnimatable<any, any>;
  selected: boolean;
  onSelect: () => void;
}

interface Position {
  x: number;
  y: number;
}

const BaseAnimatableComponent: React.FC<BaseAnimatableComponentProps> = ({
  animatable,
  selected,
  onSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const componentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!componentRef.current) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - animatable.props.x.value,
      y: e.clientY - animatable.props.y.value
    });
    onSelect();
  }, [animatable.props.x.value, animatable.props.y.value, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !componentRef.current) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Update the animatable props
    animatable.props.x.value = newX;
    animatable.props.y.value = newY;
  }, [isDragging, dragStart, animatable.props]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const Component = animatable.component;

  return (
    <div
      ref={componentRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        cursor: isDragging ? 'grabbing' : 'grab',
        ...animatable.containerStyle,
      }}
    >
      <Component {...animatable.props} {...animatable.componentProps} />
      {selected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
      )}
    </div>
  );
};

export default BaseAnimatableComponent;