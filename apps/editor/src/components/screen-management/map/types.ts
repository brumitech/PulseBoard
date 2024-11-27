import { IScreen } from '@pulseboard/shared';
import L from 'leaflet';

export interface Position {
  x: number;
  y: number;
}

export interface ExtendedScreen extends IScreen {
  status: 'active' | 'inactive';
  lastPing?: string;
}

export interface MapControllerRef {
  flyTo: (
    coords: [number, number],
    zoom: number,
    options?: L.ZoomPanOptions
  ) => void;
}

export interface MapClickHandlerProps {
  isAddingScreen: boolean;
  onAddScreen: (location: { latitude: number; longitude: number }) => void;
}

export interface DynamicMarkerProps {
  screen: ExtendedScreen;
  onToggleStatus: (id: string) => void;
  onAssignAnimation: (id: string) => void;
  isSelected: boolean;
}

export interface CustomPopupProps {
  screen: ExtendedScreen;
  onToggleStatus: (id: string) => void;
  onAssignAnimation: (id: string) => void;
  isSelected: boolean;
}

export interface MapControlsProps {
  isAddingScreen: boolean;
  setIsAddingScreen: (value: boolean) => void;
}
