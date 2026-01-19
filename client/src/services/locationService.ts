import api from './api';
import { Location } from '../types';

export const locationService = {
  async getAll(): Promise<Location[]> {
    const response = await api.get<{ locations: Location[] }>('/locations');
    return response.data.locations;
  },

  async getById(id: number): Promise<Location> {
    const response = await api.get<{ location: Location }>(`/locations/${id}`);
    return response.data.location;
  },

  async create(data: Partial<Location>): Promise<Location> {
    const response = await api.post<{ location: Location }>('/locations', data);
    return response.data.location;
  },

  async update(id: number, data: Partial<Location>): Promise<Location> {
    const response = await api.put<{ location: Location }>(`/locations/${id}`, data);
    return response.data.location;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/locations/${id}`);
  },
};
