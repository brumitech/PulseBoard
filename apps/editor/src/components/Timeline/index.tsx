import React, { useRef } from 'react';
import { TimeGrid } from './TimeMarkers/TimeGrid';
import { TrackContainer } from './Track/TrackContainer';
import { ZoomControls } from './Controls/ZoomControls';
import { PlaybackControls } from './Controls/PlaybackControls';
import { useTimelineStore } from '@/store/timelineStore';

export const Timeline: React.FC = () => {
  const timeline = useTimelineStore((state) => state.timeline);
  const zoom = useTimelineStore((state) => state.state.zoom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!timeline) {
    return null;
  }

  return (
    <div className="relative border border-gray-200 rounded-lg bg-white">
      <ZoomControls />
      
      <div className="flex flex-col h-[300px]">
        {/* Time markers - fixed position */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex">
            {/* Track labels column */}
            <div className="flex-shrink-0 w-40 h-8 border-r border-gray-200 bg-gray-50" />
            {/* Time markers */}
            <div className="flex-grow overflow-hidden">
              <div className="relative h-8">
                <TimeGrid
                  width={3000}
                  zoom={zoom}
                  gridSize={50}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tracks container with horizontal scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow flex overflow-x-auto overflow-y-hidden"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #EDF2F7'
          }}
        >
          {/* Track names - fixed left */}
          <div className="flex-shrink-0 w-40 border-r border-gray-200 bg-gray-50">
            {timeline.tracks.map((track) => (
              <div 
                key={track.id}
                className="h-16 px-4 flex items-center border-b border-gray-200 font-medium"
              >
                {track.name}
              </div>
            ))}
          </div>

          {/* Tracks with items - scrollable */}
          <div className="flex-grow relative">
            <div className="absolute top-0 left-0" style={{ width: '3000px' }}>
              {timeline.tracks.map((track) => (
                <TrackContainer
                  key={track.id}
                  track={track}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PlaybackControls />
    </div>
  );
};