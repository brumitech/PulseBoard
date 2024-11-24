import React from 'react';
import { useZoom } from '@/hooks/useZoom';

export const ZoomControls: React.FC = () => {
  const { zoomIn, zoomOut, zoom } = useZoom();

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-gray-800 rounded-lg shadow-lg p-2 z-50">
      <button
        onClick={zoomOut}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded"
      >
        −
      </button>
      <div className="text-white px-2 min-w-[60px] text-center">
        {Math.round(zoom * 100)}%
      </div>
      <button
        onClick={zoomIn}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded"
      >
        +
      </button>
    </div>
  );
};