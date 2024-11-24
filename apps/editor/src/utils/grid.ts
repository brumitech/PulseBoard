import { TimelineItem } from '../types/item';
import { millisecondsToPixels, pixelsToMilliseconds } from './time';  // Add this import

export const GRID_SIZE = 100;
export const MIN_ITEM_WIDTH = 50;

export const getItemStyle = (
  item: TimelineItem,
  zoom: number,
): React.CSSProperties => {
  const left = millisecondsToPixels(item.startTime, zoom);
  const width = millisecondsToPixels(item.duration, zoom);
  
  return {
    position: 'absolute',
    left: `${left}px`,
    width: `${width}px`,
    height: '80%',
    top: '10%',
    opacity: 1,
  };
};

export const calculateGridLines = (
  width: number,
  zoom: number,
  gridSize: number = 100
): { position: number; time: number }[] => {
  const lines: { position: number; time: number }[] = [];
  const numLines = Math.ceil(width / gridSize);
  const timeIncrement = pixelsToMilliseconds(gridSize, zoom);

  for (let i = 0; i <= numLines; i++) {
    lines.push({
      position: i * gridSize,
      time: i * timeIncrement
    });
  }
  
  return lines;
};