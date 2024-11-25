// libs/shared/src/lib/presets.ts
import { TimelineKeyframe } from './types';

export interface AnimationPreset {
  id: string;
  name: string;
  duration: number;
  keyframes: TimelineKeyframe[];
}

export const ANIMATION_PRESETS: readonly AnimationPreset[] = [
  {
    id: 'fade-in',
    name: 'Fade In',
    duration: 1000,
    keyframes: [
      {
        timestamp: 0,
        props: {
          x: 50,
          y: 50,
          scale: 0,
          colorR: 255,
          colorG: 255,
          colorB: 255
        },
        easing: 'easeOutCubic'
      },
      {
        timestamp: 1000,
        props: {
          x: 50,
          y: 50,
          scale: 1,
          colorR: 100,
          colorG: 149,
          colorB: 237
        }
      }
    ]
  },
  {
    id: 'bounce-in',
    name: 'Bounce In',
    duration: 1500,
    keyframes: [
      {
        timestamp: 0,
        props: {
          x: 50,
          y: -50,
          scale: 0.3,
          colorR: 255,
          colorG: 255,
          colorB: 255
        },
        easing: 'easeOutBounce'
      },
      {
        timestamp: 1500,
        props: {
          x: 50,
          y: 50,
          scale: 1,
          colorR: 100,
          colorG: 149,
          colorB: 237
        }
      }
    ]
  },
  {
    id: 'slide-in',
    name: 'Slide In',
    duration: 1000,
    keyframes: [
      {
        timestamp: 0,
        props: {
          x: -100,
          y: 50,
          scale: 1,
          colorR: 100,
          colorG: 149,
          colorB: 237
        },
        easing: 'easeOutCubic'
      },
      {
        timestamp: 1000,
        props: {
          x: 50,
          y: 50,
          scale: 1,
          colorR: 100,
          colorG: 149,
          colorB: 237
        }
      }
    ]
  }
] as const;

// Create a type from the preset IDs
export type PresetId = typeof ANIMATION_PRESETS[number]['id'];