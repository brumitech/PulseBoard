import { TimelineItem } from "@/types/item";
import { Timeline } from "@/types/timeline";
import { Track } from "@/types/track";

export const isValidTimelineItem = (item: TimelineItem): boolean => {
  return (
    typeof item.id === 'string' &&
    typeof item.startTime === 'number' &&
    typeof item.duration === 'number' &&
    item.duration > 0 &&
    typeof item.trackId === 'string'
  );
};

export const isValidTrack = (track: Track): boolean => {
  return (
    typeof track.id === 'string' &&
    typeof track.name === 'string' &&
    Array.isArray(track.items) &&
    track.items.every(isValidTimelineItem)
  );
};

export const checkItemCollision = (
  item: TimelineItem,
  track: Track
): boolean => {
  return track.items.some(
    (existingItem) =>
      item.id !== existingItem.id &&
      ((item.startTime >= existingItem.startTime &&
        item.startTime < existingItem.startTime + existingItem.duration) ||
        (existingItem.startTime >= item.startTime &&
          existingItem.startTime < item.startTime + item.duration))
  );
};

export const validateTimelineBounds = (
  timeline: Timeline,
  item: TimelineItem
): boolean => {
  return (
    item.startTime >= 0 &&
    item.startTime + item.duration <= timeline.duration
  );
};