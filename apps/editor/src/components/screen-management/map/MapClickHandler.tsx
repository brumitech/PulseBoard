import React, { useState, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { Position, MapClickHandlerProps } from './types';

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  isAddingScreen,
  onAddScreen,
}) => {
  const map = useMap();
  const [previewPosition, setPreviewPosition] = useState<Position | null>(null);

  useMapEvents({
    mousemove: (e) => {
      if (!isAddingScreen) return;
      const point = map.latLngToContainerPoint(e.latlng);
      setPreviewPosition({ x: point.x, y: point.y });
    },
    click: (e) => {
      if (!isAddingScreen) return;
      const { lat: latitude, lng: longitude } = e.latlng;
      onAddScreen({ latitude, longitude });
    },
  });

  useEffect(() => {
    const mapElement = map.getContainer();
    if (isAddingScreen) {
      mapElement.style.cursor = 'none';
    } else {
      mapElement.style.cursor = 'grab';
      setPreviewPosition(null);
    }
  }, [isAddingScreen, map]);

  if (!previewPosition) return null;

  return (
    <div
      className="absolute z-[1000] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ left: previewPosition.x, top: previewPosition.y }}
    >
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500/50 animate-pulse" />
        <div className="mt-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-700">
          <span className="text-xs text-gray-200">Click to place screen</span>
        </div>
      </div>
    </div>
  );
};

export default MapClickHandler;
