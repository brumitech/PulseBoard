import { forwardRef, useImperativeHandle } from 'react';
import { useMap } from 'react-leaflet';
import { MapControllerRef } from './types';

const MapController = forwardRef<MapControllerRef>((_, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    flyTo: (coords: [number, number], zoom: number, options?) => {
      map.flyTo(coords, zoom, options);
    },
  }));

  return null;
});

MapController.displayName = 'MapController';

export default MapController;
