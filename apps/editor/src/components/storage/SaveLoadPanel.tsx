// apps/editor/src/components/SaveLoadPanel.tsx
import React, { useState, useEffect } from 'react';
import { TimelineItem } from '@pulseboard/shared';
import { TimelineConfig, saveTimeline, loadAllTimelines, deleteTimeline } from '../../lib/storage';
// apps/editor/src/components/SaveLoadPanel.tsx
import { 
    TrashIcon, 
    ArrowUpTrayIcon as UploadIcon  
  } from '@heroicons/react/24/solid';
  import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../common/LoadingSpinner';
interface SaveLoadPanelProps {
  items: TimelineItem[];
  onLoad: (items: TimelineItem[]) => void;
}

// apps/editor/src/components/SaveLoadPanel.tsx
export const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({ items, onLoad }) => {
    const [savedConfigs, setSavedConfigs] = useState<TimelineConfig[]>([]);
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      loadAllTimelines()
        .then(setSavedConfigs)
        .finally(() => setIsLoading(false));
    }, []);
  
    const handleSave = async () => {
      if (!newName.trim()) return;
      
      try {
        await saveTimeline({
          name: newName.trim(),
          items
        });
        
        const updated = await loadAllTimelines();
        setSavedConfigs(updated);
        setNewName('');
        toast.success('Timeline saved successfully');
      } catch (error) {
        toast.error('Failed to save timeline');
      }
    };
  
    const handleDelete = async (id: string, name: string) => {
      if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
      
      try {
        await deleteTimeline(id);
        setSavedConfigs(await loadAllTimelines());
        toast.success('Timeline deleted');
      } catch (error) {
        toast.error('Failed to delete timeline');
      }
    };
  
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 bo  rder-b">
          <h3 className="text-lg font-semibold">Saved Timelines</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Save New Timeline */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Save Current Timeline
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter timeline name"
                className="flex-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={!newName.trim() || !items.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
  
          {/* Saved Timelines List */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Saved Timelines
            </label>
            {isLoading ? (
              <div className="text-center py-4">
                <LoadingSpinner />
              </div>
            ) : savedConfigs.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                No saved timelines yet
              </div>
            ) : (
              <div className="space-y-2">
                {savedConfigs.map(config => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{config.name}</h4>
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(config.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onLoad(config.items)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Load timeline"
                      >
                        <UploadIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(config.id, config.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete timeline"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };