// apps/editor/src/components/Timeline.tsx
import React, { useState, useMemo } from 'react';
import { TimelineItem as TimelineItemType } from '@pulseboard/shared';
import { WidgetPicker, WidgetType } from '../widgets/WidgetPicker';
import { TimelineItemEditor } from './TimelineItemEditor';
import { TimelineItem } from './TimelineItem';
import { PreviewPanel } from '../preview/PreviewPanel';
import { SaveLoadPanel } from '../storage/SaveLoadPanel';

export const Timeline: React.FC = () => {
  const [items, setItems] = useState<TimelineItemType[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Calculate the maximum duration for scaling the timeline
  const maxDuration = useMemo(() => {
    if (items.length === 0) return 10000; // Default max
    return Math.max(...items.map(item => item.duration));
  }, [items]);

  const handleAddWidget = (type: WidgetType) => {
    const newItem: TimelineItemType = {
      id: `${type}-${Date.now()}`,
      widgetType: type,
      duration: 5000, // Default 5 seconds
      keyframes: [
        { timestamp: 0, props: { scale: 1, x: 0, y: 0, colorR: 255, colorG: 255, colorB: 255 } }
      ]
    };

    setItems([...items, newItem]);
  };

  const handleRemoveWidget = (type: WidgetType) => {
    setItems(items.filter(item => item.widgetType !== type));
    if (selectedItemId && items.find(i => i.id === selectedItemId)?.widgetType === type) {
      setSelectedItemId(null);
    }
  };

  const handleUpdateItem = (updatedItem: TimelineItemType) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const activeWidgetTypes = items.map(item => item.widgetType);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-3 space-y-6">
        <WidgetPicker
          onAdd={handleAddWidget}
          onRemove={handleRemoveWidget}
          activeWidgets={activeWidgetTypes}
        />
        <SaveLoadPanel 
          items={items} 
          onLoad={loadedItems => {
            setItems(loadedItems);
            setSelectedItemId(null);
          }} 
        />
      </div>

      {/* Main Content */}
      <div className="col-span-9 space-y-6">
        <PreviewPanel items={items} />
        
        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Timeline</h2>
          </div>
          <div className="p-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Add widgets from the left panel to get started
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItemId === item.id}
                    onSelect={setSelectedItemId}
                    maxDuration={maxDuration}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor Section */}
        {selectedItemId && (
          <div className="bg-white rounded-lg shadow">
            <TimelineItemEditor
              item={items.find(i => i.id === selectedItemId)!}
              onUpdate={handleUpdateItem}
            />
          </div>
        )}
      </div>
    </div>
  );
};