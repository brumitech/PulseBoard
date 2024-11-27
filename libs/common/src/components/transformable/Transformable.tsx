import React, { useState, useRef, useCallback } from 'react';
import { DragState, ResizeDirection, ResizeHandleProps } from './types';
import { calculateNewDimensions, getHandlePosition, RESIZE_HANDLES } from './utils';
import { useAnimatableContext, useScreenContext } from '../../contexts';
import { IAnimatable } from '../../types/anim';

interface TransformableProps {
  animatable: IAnimatable;
  selected: boolean;
  onSelect: () => void;
  convertToVirtualCoords: (clientX: number, clientY: number) => { x: number; y: number };
}

export function Transformable({
  animatable,
  selected,
  onSelect,
  convertToVirtualCoords,
}: TransformableProps) {
  const screen = useScreenContext();
  const { updateAnimatable } = useAnimatableContext();
  
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    isResizing: boolean;
    resizeDirection: ResizeDirection | null;
    state: DragState;
  }>({
    isDragging: false,
    isResizing: false,
    resizeDirection: null,
    state: {
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
      startWidth: 0,
      startHeight: 0,
      offsetX: 0,
      offsetY: 0,
    }
  });
  
  const componentRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((x: number, y: number) => {
    updateAnimatable({
      props: {
        ...animatable.props,
        x: { ...animatable.props.x, value: x },
        y: { ...animatable.props.y, value: y },
      },
    });
  }, [animatable.props, updateAnimatable]);

  const updateDimensions = useCallback((width: number, height: number) => {
    updateAnimatable({
      props: {
        ...animatable.props,
        width: { ...animatable.props.width, value: width },
        height: { ...animatable.props.height, value: height },
      },
    });
  }, [animatable.props, updateAnimatable]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    const startCoords = convertToVirtualCoords(e.clientX, e.clientY);
    
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      state: {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: animatable.props.x.value,
        startPosY: animatable.props.y.value,
        startWidth: animatable.props.width.value,
        startHeight: animatable.props.height.value,
        offsetX: startCoords.x - animatable.props.x.value,
        offsetY: startCoords.y - animatable.props.y.value,
      }
    }));
  }, [animatable.props, convertToVirtualCoords, onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    
    setDragState(prev => ({
      ...prev,
      isResizing: true,
      resizeDirection: direction,
      state: {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: animatable.props.x.value,
        startPosY: animatable.props.y.value,
        startWidth: animatable.props.width.value,
        startHeight: animatable.props.height.value,
        offsetX: 0,
        offsetY: 0,
      }
    }));
  }, [animatable.props, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging && !dragState.isResizing) return;

    if (dragState.isDragging) {
      const coords = convertToVirtualCoords(e.clientX, e.clientY);
      const newX = Math.max(0, Math.min(coords.x - dragState.state.offsetX, screen.targetWidth - animatable.props.width.value));
      const newY = Math.max(0, Math.min(coords.y - dragState.state.offsetY, screen.targetHeight - animatable.props.height.value));
      
      updatePosition(newX, newY);
    }

    if (dragState.isResizing && dragState.resizeDirection) {
      const deltaX = (e.clientX - dragState.state.startX) / screen.scale;
      const deltaY = (e.clientY - dragState.state.startY) / screen.scale;

      let { newWidth, newHeight, newX, newY } = calculateNewDimensions(
        dragState.state,
        deltaX,
        deltaY,
        dragState.resizeDirection,
        screen.targetWidth,
        screen.targetHeight
      );

      updatePosition(newX, newY);
      updateDimensions(newWidth, newHeight);
    }
  }, [dragState, screen, animatable.props, convertToVirtualCoords, updatePosition, updateDimensions]);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      isResizing: false,
      resizeDirection: null,
    }));
  }, []);

  React.useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.isResizing, handleMouseMove, handleMouseUp]);

  const Component = animatable.component;

  return (
    <div
      ref={componentRef}
      onMouseDown={handleDragStart}
      style={{
        position: 'absolute',
        left: `${animatable.props.x.value * screen.scale}px`,
        top: `${animatable.props.y.value * screen.scale}px`,
        width: `${animatable.props.width.value * screen.scale}px`,
        height: `${animatable.props.height.value * screen.scale}px`,
        cursor: dragState.isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <Component {...animatable.props} {...animatable.componentProps} />

      {selected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
          {RESIZE_HANDLES.map(handle => (
            <ResizeHandle
              key={handle.direction}
              {...handle}
              onMouseDown={e => handleResizeStart(e, handle.direction)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResizeHandle({ direction, cursor, onMouseDown }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute w-3 h-3 bg-white border-2 border-blue-500`}
      style={{
        ...getHandlePosition(direction),
        cursor,
        pointerEvents: 'auto'
      }}
    />
  );
}