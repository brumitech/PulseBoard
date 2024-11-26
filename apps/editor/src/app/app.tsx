// apps/editor/src/app/app.tsx
import { useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { Timeline } from '../components/Timeline';
import { Properties } from '../components/Properties';
import { useAnimation } from '@pulseboard/shared';
//import { Mockup } from '../components/mockup';
import DemoScreenList from '../components/ScreenList';

export function App() {
  const {
    currentTime,
    isPlaying,
    duration,
    animatables,
    selectedAnimatableId,
    selectedKeyframeId,
    initAnimation,
    play,
    pause,
    stop,
    setTime,
    selectAnimatable,
    selectKeyframe,
    removeAnimatable,
    updateKeyframe,
  } = useAnimation(6000); // 6 seconds default duration

  useEffect(() => {
    initAnimation();
  }, [initAnimation]);

  const handleKeyframeUpdate = (updates: Partial<any>) => {
    if (!selectedAnimatableId || selectedKeyframeId === null) return;
    updateKeyframe(selectedAnimatableId, parseInt(selectedKeyframeId), updates);
  };

  const handleKeyframeTimeChange = (time: number) => {
    if (!selectedAnimatableId || selectedKeyframeId === null) return;
    updateKeyframe(selectedAnimatableId, parseInt(selectedKeyframeId), {
      timestamp: time,
    });
  };

  const selectedAnimatable = animatables.find(
    (a) => a.id === selectedAnimatableId
  );

  return <DemoScreenList />;
}

export default App;
