import L from 'leaflet';
import castIcon from '../../../assets/cast.svg';

export const MAP_CONSTANTS = {
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  BASE_ICON_SIZE: 32,
} as const;

export const createScreenIcon = (
  size: number,
  isActive: boolean,
  isSelected: boolean
): L.Icon => {
  return new L.Icon({
    iconUrl: castIcon,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className: `transition-all duration-300 ${
      isActive ? 'drop-shadow-lg' : 'opacity-75'
    } ${isSelected ? 'border-2 border-blue-500 rounded-full' : ''}`,
  });
};

export const calculateIconSize = (currentZoom: number): number => {
  const { MIN_ZOOM, MAX_ZOOM, BASE_ICON_SIZE } = MAP_CONSTANTS;
  const zoomFactor = (currentZoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
  return BASE_ICON_SIZE * (0.5 + zoomFactor * 0.8);
};
