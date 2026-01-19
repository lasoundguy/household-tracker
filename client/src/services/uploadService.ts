import api from './api';

export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<{ url: string; publicId: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteImage(publicId: string): Promise<void> {
    await api.delete('/upload', { data: { publicId } });
  },
};
