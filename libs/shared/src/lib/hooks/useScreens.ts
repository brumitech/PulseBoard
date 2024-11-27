import { useState, useEffect } from 'react';
import { IScreen } from '../types';

interface UseScreensReturn {
  screens: IScreen[];
  loading: boolean;
  error: Error | null;
  filterScreens: (status: 'all' | 'active' | 'inactive') => void;
  refreshScreens: () => Promise<void>;
}

export function useScreens(): UseScreensReturn {
  const [screens, setScreens] = useState<IScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/screens');
      if (!response.ok) throw new Error('Failed to fetch screens');
      const data = await response.json();
      setScreens(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
    } finally {
      setLoading(false);
    }
  };

  const filterScreens = (status: 'all' | 'active' | 'inactive') => {
    setFilter(status);
  };

  const refreshScreens = async () => {
    await fetchScreens();
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return {
    screens:
      filter === 'all'
        ? screens
        : screens.filter((screen) => screen.status === filter),
    loading,
    error,
    filterScreens,
    refreshScreens,
  };
}
