import { IScreen } from '../types';

const API_URL = 'http://localhost:3000/api';

export const screenApi = {
  async getScreens(): Promise<IScreen[]> {
    const response = await fetch(`${API_URL}/screens`);
    if (!response.ok) throw new Error('Failed to fetch screens');
    return response.json();
  },

  async getScreensWithinBounds(bounds: {
    latMin: number;
    latMax: number;
    lngMin: number;
    lngMax: number;
  }): Promise<IScreen[]> {
    const { latMin, latMax, lngMin, lngMax } = bounds;
    const response = await fetch(
      `${API_URL}/screens/bounds?latMin=${latMin}&latMax=${latMax}&lngMin=${lngMin}&lngMax=${lngMax}`
    );
    if (!response.ok) throw new Error('Failed to fetch screens within bounds');
    return response.json();
  },

  async createScreen(location: {
    latitude: number;
    longitude: number;
  }): Promise<IScreen> {
    const response = await fetch(`${API_URL}/screens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    });
    if (!response.ok) throw new Error('Failed to create screen');
    return response.json();
  },

  async assignAnimation(id: string, animationId: string): Promise<IScreen> {
    const response = await fetch(`${API_URL}/screens/${id}/assign-animation`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ animationId }),
    });
    if (!response.ok) throw new Error('Failed to assign animation');
    return response.json();
  },

  async toggleStatus(id: string): Promise<IScreen> {
    const response = await fetch(`${API_URL}/screens/${id}/toggle-status`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to toggle screen status');
    return response.json();
  },
};
