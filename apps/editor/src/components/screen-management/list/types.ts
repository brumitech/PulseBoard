import { ExtendedScreen } from '../map/types';

export interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export interface ScreenListItemProps {
  screen: ExtendedScreen;
  isSelected: boolean;
  onSelect: (id: string) => void;
  formatDate: (date?: string) => string;
}
