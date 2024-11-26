import React, { useState, useCallback, useEffect, useRef } from 'react';
import TimelinePanel from './Timeline';
import PropertiesPanel from './Properties';
import BaseAnimatableComponent from './BaseAnimatableComponent';
import { widgetRegistry } from '@pulseboard/widgets';
import {
  IAnimatable,
  IAnimation,
  Keyframe,
  WidgetDefinition,
  Animation,
} from '@pulseboard/shared';

const useAnimation = () => {
  const [animation, setAnimation] = useState<IAnimation | null>(null);

  const addAnimatable = useCallback(
    (widgetDef: WidgetDefinition) => {
      if (!animation) return;

      const newAnimatable: IAnimatable<any, any> = {
        id: crypto.randomUUID(),
        component: widgetDef.component,
        componentProps: {},
        start: 0,
        duration: widgetDef.defaultDuration,
        keyframes: [
          {
            timestamp: 0,
            props: Object.entries(widgetDef.defaultProps).reduce(
              (acc, [key, prop]) => {
                acc[key] = prop.value;
                return acc;
              },
              {} as Record<string, any>
            ),
          },
        ],
        props: { ...widgetDef.defaultProps },
      };

      const updatedAnimatables = [...animation.animatables, newAnimatable];

      // Create new animation instance with the updated animatables
      const updatedAnimation = new Animation(
        animation.id,
        animation.duration,
        updatedAnimatables
      );

      setAnimation(updatedAnimation);
    },
    [animation]
  );

  const removeAnimatable = useCallback(
    (id: string) => {
      if (!animation) return;

      const updatedAnimatables = animation.animatables.filter(
        (a) => a.id !== id
      );

      // Create new animation instance with the filtered animatables
      const updatedAnimation = new Animation(
        animation.id,
        animation.duration,
        updatedAnimatables
      );

      setAnimation(updatedAnimation);
    },
    [animation]
  );

  return { animation, setAnimation, addAnimatable, removeAnimatable };
};

const useAnimatable = (
  animation: IAnimation | null,
  selectedId: string | null,
  setAnimation: (animation: IAnimation | null) => void
) => {
  const selectedAnimatable = animation?.animatables.find(
    (a) => a.id === selectedId
  );

  const updateAnimatable = useCallback(
    (updates: Partial<IAnimatable<any, any>>) => {
      if (!animation || !selectedId) return;

      const updatedAnimatables = animation.animatables.map((a) =>
        a.id === selectedId ? { ...a, ...updates } : a
      );

      // Create new animation instance with updated animatables
      const updatedAnimation = new Animation(
        animation.id,
        animation.duration,
        updatedAnimatables
      );

      // Here we need to pass setAnimation from context or props
      setAnimation(updatedAnimation);
    },
    [animation, selectedId]
  );

  const addKeyframe = useCallback(
    (timestamp: number, props: Record<string, any>) => {
      if (!selectedAnimatable) return;

      const newKeyframe: Keyframe<any> = {
        timestamp,
        props,
      };

      const updatedKeyframes = [
        ...selectedAnimatable.keyframes,
        newKeyframe,
      ].sort((a, b) => a.timestamp - b.timestamp);

      updateAnimatable({
        keyframes: updatedKeyframes,
      });
    },
    [selectedAnimatable, updateAnimatable]
  );

  return { selectedAnimatable, updateAnimatable, addKeyframe };
};

const usePlayer = (animation: IAnimation | null) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const rafIdRef = useRef<number | null>(null);
  
    // Clean up RAF on unmount
    useEffect(() => {
      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, []);
  
    const updateAnimation = useCallback((t: number) => {
      if (!animation) return;
      
      const normalizedTime = t % animation.duration;
      animation.setT(normalizedTime);
      setCurrentTime(normalizedTime);
    }, [animation]);
  
    const loop = useCallback(() => {
      if (!isPlaying || !startTimeRef.current || !animation) return;
  
      const elapsed = performance.now() - startTimeRef.current;
      updateAnimation(elapsed);
  
      rafIdRef.current = requestAnimationFrame(loop);
    }, [isPlaying, animation, updateAnimation]);
  
    const play = useCallback(() => {
      if (!animation) return;
      
      setIsPlaying(true);
      startTimeRef.current = performance.now() - currentTime;
      loop();
    }, [animation, currentTime, loop]);
  
    const pause = useCallback(() => {
      setIsPlaying(false);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    }, []);
  
    const stop = useCallback(() => {
      setIsPlaying(false);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      updateAnimation(0);
    }, [updateAnimation]);
  
    const seekTo = useCallback((t: number) => {
      if (!animation) return;
      
      const clampedTime = Math.max(0, Math.min(t, animation.duration));
      updateAnimation(clampedTime);
      
      if (isPlaying) {
        startTimeRef.current = performance.now() - clampedTime;
      }
    }, [animation, isPlaying, updateAnimation]);
  
    useEffect(() => {
      if (isPlaying) {
        loop();
      }
    }, [isPlaying, loop]);
  
    return {
      isPlaying,
      currentTime,
      isLooping,
      play,
      pause,
      stop,
      seekTo,
      setIsLooping
    };
  };

// Main Component
const AnimationEditor = () => {
  const [selectedAnimatableId, setSelectedAnimatableId] = useState<
    string | null
  >(null);
  const { animation, setAnimation, addAnimatable } = useAnimation();
  const { selectedAnimatable, updateAnimatable, addKeyframe } = useAnimatable(
    animation,
    selectedAnimatableId,
    setAnimation
  );
  const player = usePlayer(animation);

  // Initialize animation when component mounts
  useEffect(() => {
    // Create a new empty animation
    const newAnimation = new Animation('default-animation', 10000, []); // 10 seconds duration
    setAnimation(newAnimation);
  }, [setAnimation]);

  // Handler for adding widgetsf
  const handleAddWidget = useCallback(
    (widget: WidgetDefinition) => {
      addAnimatable(widget);
    },
    [addAnimatable]
  );

  // Handler for updating properties
  const handleUpdateProp = useCallback(
    (key: string, value: any) => {
      if (!selectedAnimatable) return;

      const updatedProps = {
        ...selectedAnimatable.props,
        [key]: {
          ...selectedAnimatable.props[key],
          value,
        },
      };

      updateAnimatable({ props: updatedProps });
    },
    [selectedAnimatable, updateAnimatable]
  );

  // Handler for creating keyframes
  const handleCreateKeyframe = useCallback(
    (props: Record<string, any>) => {
      if (!animation || !selectedAnimatableId) return;

      addKeyframe(player.currentTime, props);
    },
    [animation, selectedAnimatableId, player.currentTime, addKeyframe]
  );

  return (
    <div className="h-screen w-full flex flex-col bg-slate-800">
      {/* Upper section */}
      <div className="flex-1 flex">
        {/* Widgets Panel */}
        <div className="w-1/5 p-4 m-2 overflow-y-auto border rounded-lg">
          <h2 className="text-lg font-bold mb-4">Widgets</h2>
          <div className="space-y-2">
            {widgetRegistry.map((widget) => (
              <div
                key={widget.id}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => handleAddWidget(widget)}
              >
                {widget.name}
              </div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 p-4 m-2 border rounded-lg">
          <h2 className="text-lg font-bold mb-4">Preview</h2>
          <div className="relative w-full h-full bg-gray-50 border rounded">
            {animation?.animatables.map((animatable) => (
              <BaseAnimatableComponent
                key={animatable.id}
                animatable={animatable}
                selected={animatable.id === selectedAnimatableId}
                onSelect={() => setSelectedAnimatableId(animatable.id)}
              />
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-3/10 p-4 m-2 border rounded-lg">
          <h2 className="text-lg font-bold mb-4">Properties</h2>
          {selectedAnimatable && (
            <PropertiesPanel
              animatable={selectedAnimatable}
              currentTime={player.currentTime}
              onCreateKeyframe={handleCreateKeyframe}
              onUpdateProp={handleUpdateProp}
            />
          )}
        </div>
      </div>

      {/* Timeline Panel */}
      <div className="h-64 m-2 border rounded-lg">
        <TimelinePanel
          animation={animation}
          currentTime={player.currentTime}
          isPlaying={player.isPlaying}
          onSeek={player.seekTo}
          onPlay={player.play}
          onPause={player.pause}
          onStop={player.stop}
          selectedAnimatableId={selectedAnimatableId}
        />
      </div>
    </div>
  );
};

export default AnimationEditor;
