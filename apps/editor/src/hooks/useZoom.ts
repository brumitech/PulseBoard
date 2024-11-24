import { useCallback } from 'react';
import { useTimelineStore } from '@/store/timelineStore';

export const useZoom = () => {
  const setZoom = useTimelineStore((state) => state.setZoom);
  const zoom = useTimelineStore((state) => state.state.zoom);
  const options = useTimelineStore((state) => state.options);

  const zoomIn = useCallback(() => {
    setZoom(Math.min(zoom * 1.2, options.maxZoom));
  }, [zoom, options.maxZoom, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(Math.max(zoom / 1.2, options.minZoom));
  }, [zoom, options.minZoom, setZoom]);



  return {
    zoom,
    zoomIn,
    zoomOut,
  };
};