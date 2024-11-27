import { forwardRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { Plus, X } from 'lucide-react';
import {
  MapController,
  MapClickHandler,
  DynamicMarker,
} from '../components/screen-management/map';
import type { ExtendedScreen } from '../components/screen-management/map/types';
import 'leaflet/dist/leaflet.css';

interface ScreenMapProps {
  screens: ExtendedScreen[];
  onAddScreen: (location: { latitude: number; longitude: number }) => void;
  onToggleStatus: (id: string) => void;
  onAssignAnimation: (id: string) => void;
  selectedScreenId: string | null;
  onScreenSelect: (id: string) => void;
}

const defaultPosition: LatLngTuple = [41.9981, 21.4254];
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

export const ScreenMap = forwardRef<any, ScreenMapProps>(
  (
    {
      screens,
      onAddScreen,
      onToggleStatus,
      onAssignAnimation,
      selectedScreenId,
      onScreenSelect,
    },
    ref
  ) => {
    const [isAddingScreen, setIsAddingScreen] = useState(false);

    return (
      <div className="relative h-full rounded-lg overflow-hidden border border-gray-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-2">
          <button
            onClick={() => setIsAddingScreen(!isAddingScreen)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isAddingScreen
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-blue-400 border-gray-700 hover:border-blue-500'
            } border`}
            title={isAddingScreen ? 'Cancel adding screen' : 'Add new screen'}
          >
            {isAddingScreen ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        </div>

        <MapContainer
          center={defaultPosition}
          zoom={13}
          className="h-full w-full"
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
          <MapController ref={ref} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <MapClickHandler
            isAddingScreen={isAddingScreen}
            onAddScreen={(location) => {
              onAddScreen(location);
              setIsAddingScreen(false);
            }}
          />
          {screens.map((screen) => (
            <DynamicMarker
              key={screen.id}
              screen={screen}
              onToggleStatus={onToggleStatus}
              onAssignAnimation={onAssignAnimation}
              isSelected={screen.id === selectedScreenId}
            />
          ))}
        </MapContainer>

        <style>{`
        .screen-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
        .screen-popup .leaflet-popup-content {
          margin: 0;
        }
        .screen-popup .leaflet-popup-tip-container {
          display: none;
        }
        .screen-popup {
          filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.3));
        }
      `}</style>
      </div>
    );
  }
);

ScreenMap.displayName = 'ScreenMap';

export default ScreenMap;
