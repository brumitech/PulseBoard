import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { Power, Signal, Plus, X, MapPin, Clock } from 'lucide-react';
import castIcon from '../assets/cast.svg';

interface Screen {
  id: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  animationId?: string;
  lastPing?: string;
}

interface Position {
  x: number;
  y: number;
}

interface MapControlsProps {
  isAddingScreen: boolean;
  setIsAddingScreen: (value: boolean) => void;
}

interface CustomPopupProps {
  screen: Screen;
  onToggleStatus: (id: string) => void;
  onAssignAnimation: (id: string) => void;
}

interface DynamicMarkerProps {
  screen: Screen;
  onToggleStatus: (id: string) => void;
  onAssignAnimation: (id: string) => void;
  isSelected: boolean;
}

interface MapClickHandlerProps {
  isAddingScreen: boolean;
  onAddScreen: (location: { latitude: number; longitude: number }) => void;
}

interface ScreenMapProps {
  screens: Screen[];
  onAddScreen: (location: { latitude: number; longitude: number }) => void;
  onToggleStatus: (id: string) => void;
  onAssignAnimation: (id: string) => void;
  selectedScreenId: string | null;
  onScreenSelect: (id: string) => void;
}

const defaultPosition: LatLngTuple = [41.9981, 21.4254];
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;
const BASE_ICON_SIZE = 32;

const MapController = forwardRef((props, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    flyTo: (
      coords: [number, number],
      zoom: number,
      options?: L.ZoomPanOptions
    ) => {
      map.flyTo(coords, zoom, options);
    },
  }));

  return null;
});

const CustomPopup: React.FC<CustomPopupProps> = ({
  screen,
  onToggleStatus,
  onAssignAnimation,
}) => (
  <div className="min-w-[320px]">
    <div className="bg-gray-900 -m-1 p-4 rounded-lg border border-gray-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-2 h-2 rounded-full ${
                screen.status === 'active'
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
            <h3 className="text-sm font-semibold text-gray-100">
              Screen {screen.id}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                screen.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {screen.status}
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
            <MapPin className="h-4 w-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">
                Location
              </span>
              <span className="text-xs text-gray-100">
                {screen.latitude.toFixed(4)}, {screen.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
            <Signal className="h-4 w-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">
                Animation
              </span>
              <span className="text-xs text-gray-100 font-mono">
                {screen.animationId || 'None'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
            <Clock className="h-4 w-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">
                Last Ping
              </span>
              <span className="text-xs text-gray-100">
                {screen.lastPing
                  ? new Date(screen.lastPing).toLocaleString()
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(screen.id);
            }}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-1.5"
          >
            <Power className="h-3 w-3" />
            <span>Toggle Status</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssignAnimation(screen.id);
            }}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 bg-gray-800 border border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300 flex items-center justify-center space-x-1.5"
          >
            <Signal className="h-3 w-3" />
            <span>Assign Animation</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

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
      const newZoom = map.getZoom();
      const zoomFactor = (newZoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
      const size = BASE_ICON_SIZE * (0.5 + zoomFactor * 0.8);

      if (markerRef.current) {
        const icon = new L.Icon({
          iconUrl: castIcon,
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
          popupAnchor: [0, -size],
          className: `transition-all duration-300 ${
            screen.status === 'active' ? 'drop-shadow-lg' : 'opacity-75'
          } ${isSelected ? 'border-2 border-blue-500 rounded-full' : ''}`,
        });
        markerRef.current.setIcon(icon);
      }
    };

    map.on('zoom', handleZoom);
    handleZoom();

    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map, screen.status, isSelected]);

  const initialIcon = new L.Icon({
    iconUrl: castIcon,
    iconSize: [BASE_ICON_SIZE, BASE_ICON_SIZE],
    iconAnchor: [BASE_ICON_SIZE / 2, BASE_ICON_SIZE],
    popupAnchor: [0, -BASE_ICON_SIZE],
    className: `transition-all duration-300 ${
      screen.status === 'active' ? 'drop-shadow-lg' : 'opacity-75'
    } ${isSelected ? 'border-2 border-blue-500 rounded-full' : ''}`,
  });

  return (
    <Marker
      ref={markerRef}
      position={[screen.latitude, screen.longitude] as LatLngTuple}
      icon={initialIcon}
    >
      <Popup className="screen-popup">
        <CustomPopup
          screen={screen}
          onToggleStatus={onToggleStatus}
          onAssignAnimation={onAssignAnimation}
        />
      </Popup>
    </Marker>
  );
};

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
