import { Timeline, TimelineOptions, TimelineState } from '../types/timeline';
import { TimelineItem } from '../types/item';
import { Track } from '../types/track';

export interface TimelineStore {
  // Timeline data
  timeline: Timeline | null;
  options: TimelineOptions;
  state: TimelineState;

  // Actions
  setTimeline: (timeline: Timeline) => void;
  updateOptions: (options: Partial<TimelineOptions>) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  addItem: (item: TimelineItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<TimelineItem>) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setSelectedItems: (itemIds: string[]) => void;
  setDraggingItem: (item: TimelineItem | null) => void;
}