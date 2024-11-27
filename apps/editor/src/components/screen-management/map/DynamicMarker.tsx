import React, { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { DynamicMarkerProps } from './types';
import CustomPopup from './CustomPopup';
import { MAP_CONSTANTS, createScreenIcon, calculateIconSize } from './utils';

const DynamicMarker: React.FC<DynamicMarkerProps> = ({
  screen,
  onToggleStatus,
  onAssignAnimation,
  isSelected,
}) => {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const handleZoom = () => {
      const size = calculateIconSize(map.getZoom());
      if (markerRef.current) {
        const icon = createScreenIcon(
          size,
          screen.status === 'active',
          isSelected
        );
        markerRef.current.setIcon(icon);
      }
    };

    map.on('zoom', handleZoom);
    handleZoom();

    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map, screen.status, isSelected]);

  const initialIcon = createScreenIcon(
    MAP_CONSTANTS.BASE_ICON_SIZE,
    screen.status === 'active',
    isSelected
  );

  // Add smooth transitions
  useEffect(() => {
    if (markerRef.current) {
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        markerElement.style.transition = 'transform 0.3s ease-out';
      }
    }
  }, []);

  return (
    <Marker
      ref={markerRef}
      position={[screen.latitude, screen.longitude] as LatLngTuple}
      icon={initialIcon}
      // Enable Leaflet's built-in marker animations
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        add: (e) => {
          const marker = e.target;
          marker.options.animate = true;
          marker.options.duration = 0.3;
        },
      }}
    >
      <Popup className="screen-popup">
        <CustomPopup
          screen={screen}
          onToggleStatus={onToggleStatus}
          onAssignAnimation={onAssignAnimation}
          isSelected={isSelected}
        />
      </Popup>
    </Marker>
  );
};

export default DynamicMarker;
