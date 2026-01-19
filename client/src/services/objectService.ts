import api from './api';
import { HouseholdObject, ObjectHistory } from '../types';

export const objectService = {
  async getAll(filters?: { category?: number; location?: number; search?: string }): Promise<HouseholdObject[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category.toString());
    if (filters?.location) params.append('location', filters.location.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<{ objects: HouseholdObject[] }>(`/objects?${params}`);
    return response.data.objects;
  },

  async getById(id: number): Promise<{ object: HouseholdObject; history: ObjectHistory[] }> {
    const response = await api.get<{ object: HouseholdObject; history: ObjectHistory[] }>(`/objects/${id}`);
    return response.data;
  },

  async create(data: Partial<HouseholdObject>): Promise<HouseholdObject> {
    const response = await api.post<{ object: HouseholdObject }>('/objects', data);
    return response.data.object;
  },

  async update(id: number, data: Partial<HouseholdObject>): Promise<HouseholdObject> {
    const response = await api.put<{ object: HouseholdObject }>(`/objects/${id}`, data);
    return response.data.object;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/objects/${id}`);
  },
};
