import { useTimelineStore } from '../store/timelineStore';
import { Timeline } from '../components/Timeline';

function App() {
  const { setTimeline, timeline } = useTimelineStore();

  const createTestTimeline = () => {
    setTimeline({
      id: '1',
      name: 'Test Timeline',
      tracks: [
        {
          id: 'track1',
          name: 'Track 1',
          items: [
            {
              id: 'item1',
              startTime: 1000, // 1 second
              duration: 2000,  // 2 seconds
              trackId: 'track1',
              type: 'Widget 1',
              config: {}
            },
            {
              id: 'item2',
              startTime: 4000, // 4 seconds
              duration: 3000,  // 3 seconds
              trackId: 'track1',
              type: 'Widget 2',
              config: {}
            }
          ]
        },
        {
          id: 'track2',
          name: 'Track 2',
          items: []
        }
      ],
      groups: [],
      duration: 10000, // 10 seconds
      zoom: 1,
      position: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={createTestTimeline}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Test Timeline
        </button>
        
        {timeline && (
          <div className="space-y-4">
            <Timeline />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;