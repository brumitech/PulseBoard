import { Track, TrackGroup } from './track';
import { TimelineItem } from './item';

export interface Timeline {
  id: string;
  name: string;
  tracks: Track[];
  groups: TrackGroup[];
  duration: number;
  zoom: number;
  position: number;
}

export interface TimelineState {
  playing: boolean;
  currentTime: number;
  zoom: number;
  selectedItems: string[];
  draggingItem: TimelineItem | null;
}

export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour';

export interface TimelineOptions {
  snapToGrid: boolean;
  gridSize: number;
  minZoom: number;
  maxZoom: number;
  timeUnit: TimeUnit;
}