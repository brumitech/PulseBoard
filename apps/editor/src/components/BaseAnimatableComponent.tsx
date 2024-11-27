import React, { useState, useRef, useCallback } from 'react';
import { IAnimatable } from '@pulseboard/shared';

interface BaseAnimatableComponentProps {
  animatable: IAnimatable<any, any>;
  selected: boolean;
  onSelect: () => void;
  containerWidth: number;
  containerHeight: number;
  onUpdateProp?: (key: string, value: any) => void;
}

const BaseAnimatableComponent: React.FC<BaseAnimatableComponentProps> = ({
  animatable,
  selected,
  onSelect,
  containerWidth,
  containerHeight,
  onUpdateProp,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    startWidth: 0,
    startHeight: 0,
    offsetX: 0,
    offsetY: 0
  });

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const updatePosition = (x: number, y: number) => {
    if (onUpdateProp) {
      const clampedX = clamp(x, 0, containerWidth - (animatable.props.width?.value || 100));
      const clampedY = clamp(y, 0, containerHeight - (animatable.props.height?.value || 100));
      
      onUpdateProp('x', clampedX);
      onUpdateProp('y', clampedY);
    }
  };

  const updateDimensions = (width: number, height: number) => {
    if (onUpdateProp) {
      const clampedWidth = clamp(width, 10, containerWidth);
      const clampedHeight = clamp(height, 10, containerHeight);
      
      onUpdateProp('width', clampedWidth);
      onUpdateProp('height', clampedHeight);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize', direction?: string) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    const rect = componentRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (type === 'resize' && direction) {
      setIsResizing(true);
      setResizeDirection(direction);
    } else {
      setIsDragging(true);
    }

    setDragState({
      startX: e.clientX,
      startY: e.clientY,
      startPosX: animatable.props.x?.value || 0,
      startPosY: animatable.props.y?.value || 0,
      startWidth: animatable.props.width?.value || 100,
      startHeight: animatable.props.height?.value || 100,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();

    if (isDragging) {
      const previewRect = componentRef.current?.parentElement?.getBoundingClientRect();
      if (!previewRect) return;

      const x = e.clientX - previewRect.left - dragState.offsetX;
      const y = e.clientY - previewRect.top - dragState.offsetY;
      updatePosition(x, y);
    }

    if (isResizing && resizeDirection) {
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      let newWidth = dragState.startWidth;
      let newHeight = dragState.startHeight;
      let newX = dragState.startPosX;
      let newY = dragState.startPosY;

      switch (resizeDirection) {
        case 'bottom-right':
          newWidth = dragState.startWidth + deltaX;
          newHeight = dragState.startHeight + deltaY;
          break;
        case 'top-right':
          newWidth = dragState.startWidth + deltaX;
          newHeight = dragState.startHeight - deltaY;
          newY = dragState.startPosY + deltaY;
          break;
        case 'bottom-left':
          newWidth = dragState.startWidth - deltaX;
          newHeight = dragState.startHeight + deltaY;
          newX = dragState.startPosX + deltaX;
          break;
        case 'top-left':
          newWidth = dragState.startWidth - deltaX;
          newHeight = dragState.startHeight - deltaY;
          newX = dragState.startPosX + deltaX;
          newY = dragState.startPosY + deltaY;
          break;
        case 'middle-right':
          newWidth = dragState.startWidth + deltaX;
          break;
        case 'middle-bottom':
          newHeight = dragState.startHeight + deltaY;
          break;
      }

      updatePosition(newX, newY);
      updateDimensions(newWidth, newHeight);
    }
  }, [isDragging, isResizing, resizeDirection, dragState, onUpdateProp]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  React.useEffect(() => {
    if (isResizing || isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, handleMouseMove, handleMouseUp]);

  const Component = animatable.component;

  return (
    <div
      ref={componentRef}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      style={{
        position: 'absolute',
        left: animatable.props.x?.value || 0,
        top: animatable.props.y?.value || 0,
        width: animatable.props.width?.value || 100,
        height: animatable.props.height?.value || 100,
        background: animatable.props.color?.value || 'blue',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <Component {...animatable.props} {...animatable.componentProps} />

      {selected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
          {['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-right', 'middle-bottom'].map((direction) => (
            <div
              key={direction}
              onMouseDown={(e) => handleMouseDown(e, 'resize', direction)}
              className={`absolute w-3 h-3 bg-white border-2 border-blue-500 cursor-${direction === 'middle-right' ? 'ew' : direction === 'middle-bottom' ? 'ns' : direction === 'top-left' || direction === 'bottom-right' ? 'nwse' : 'nesw'}-resize`}
              style={{
                ...getHandlePosition(direction),
                pointerEvents: 'auto'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const getHandlePosition = (direction: string): React.CSSProperties => {
  switch (direction) {
    case 'top-left':
      return { top: 0, left: 0, transform: 'translate(-50%, -50%)' };
    case 'top-right':
      return { top: 0, right: 0, transform: 'translate(50%, -50%)' };
    case 'bottom-left':
      return { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' };
    case 'bottom-right':
      return { bottom: 0, right: 0, transform: 'translate(50%, 50%)' };
    case 'middle-right':
      return { top: '50%', right: 0, transform: 'translate(50%, -50%)' };
    case 'middle-bottom':
      return { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' };
    default:
      return {};
  }
};

export default BaseAnimatableComponent;