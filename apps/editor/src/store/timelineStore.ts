import { create } from 'zustand';
import { TimelineStore } from './types';

const defaultOptions = {
  snapToGrid: true,
  gridSize: 100,
  minZoom: 0.1,
  maxZoom: 10,
  timeUnit: 'millisecond' as const,
};

export const useTimelineStore = create<TimelineStore>((set) => ({
  timeline: null,
  options: defaultOptions,
  state: {
    playing: false,
    currentTime: 0,
    zoom: 1,
    selectedItems: [],
    draggingItem: null,
  },

  setTimeline: (timeline) => set({ timeline }),
  
  updateOptions: (options) =>
    set((state) => ({
      options: { ...state.options, ...options },
    })),

  addTrack: (track) =>
    set((state) => ({
      timeline: state.timeline
        ? {
            ...state.timeline,
            tracks: [...state.timeline.tracks, track],
          }
        : null,
    })),

  removeTrack: (trackId) =>
    set((state) => ({
      timeline: state.timeline
        ? {
            ...state.timeline,
            tracks: state.timeline.tracks.filter((t) => t.id !== trackId),
          }
        : null,
    })),

  addItem: (item) =>
    set((state) => {
      if (!state.timeline) return state;
      const trackIndex = state.timeline.tracks.findIndex((t) => t.id === item.trackId);
      if (trackIndex === -1) return state;

      const newTracks = [...state.timeline.tracks];
      newTracks[trackIndex] = {
        ...newTracks[trackIndex],
        items: [...newTracks[trackIndex].items, item],
      };

      return {
        timeline: {
          ...state.timeline,
          tracks: newTracks,
        },
      };
    }),

  removeItem: (itemId) =>
    set((state) => {
      if (!state.timeline) return state;
      
      const newTracks = state.timeline.tracks.map((track) => ({
        ...track,
        items: track.items.filter((item) => item.id !== itemId),
      }));

      return {
        timeline: {
          ...state.timeline,
          tracks: newTracks,
        },
      };
    }),

  updateItem: (itemId, updates) =>
    set((state) => {
      if (!state.timeline) return state;

      const newTracks = state.timeline.tracks.map((track) => ({
        ...track,
        items: track.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));

      return {
        timeline: {
          ...state.timeline,
          tracks: newTracks,
        },
      };
    }),

  setPlaying: (playing) =>
    set((state) => ({
      state: { ...state.state, playing },
    })),

  setCurrentTime: (currentTime) =>
    set((state) => ({
      state: { ...state.state, currentTime },
    })),

  setZoom: (zoom) =>
    set((state) => ({
      state: { ...state.state, zoom },
    })),

  setSelectedItems: (selectedItems) =>
    set((state) => ({
      state: { ...state.state, selectedItems },
    })),

  setDraggingItem: (draggingItem) =>
    set((state) => ({
      state: { ...state.state, draggingItem },
    })),
}));