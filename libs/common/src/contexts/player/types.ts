export interface PlayerContextType {
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    stop: () => void;
    seekTo: (time: number) => void;
}