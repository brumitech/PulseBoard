import { TimelineItem } from './item';

export interface Track {
  id: string;
  name: string;
  items: TimelineItem[];
  parentId?: string;
  isGroup?: boolean;
  children?: Track[];
  collapsed?: boolean;
  height?: number;
}

export interface TrackGroup {
  id: string;
  name: string;
  tracks: Track[];
  collapsed?: boolean;
}