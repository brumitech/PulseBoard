// apps/editor/src/lib/storage.ts
import { TimelineItem } from '@pulseboard/shared';

export interface TimelineConfig {
  id: string;
  name: string;
  items: TimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export const saveTimeline = async (config: Omit<TimelineConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newConfig: TimelineConfig = {
    ...config,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const savedConfigs = await loadAllTimelines();
  savedConfigs.push(newConfig);
  localStorage.setItem('timelines', JSON.stringify(savedConfigs));
  return newConfig;
};

export const loadAllTimelines = async (): Promise<TimelineConfig[]> => {
  const saved = localStorage.getItem('timelines');
  return saved ? JSON.parse(saved) : [];
};

export const loadTimeline = async (id: string): Promise<TimelineConfig | null> => {
  const configs = await loadAllTimelines();
  return configs.find(config => config.id === id) ?? null;
};

export const deleteTimeline = async (id: string): Promise<void> => {
  const configs = await loadAllTimelines();
  localStorage.setItem(
    'timelines',
    JSON.stringify(configs.filter(config => config.id !== id))
  );
};