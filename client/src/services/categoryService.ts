import api from './api';
import { Category } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<{ categories: Category[] }>('/categories');
    return response.data.categories;
  },

  async create(data: Partial<Category>): Promise<Category> {
    const response = await api.post<{ category: Category }>('/categories', data);
    return response.data.category;
  },

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const response = await api.put<{ category: Category }>(`/categories/${id}`, data);
    return response.data.category;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
