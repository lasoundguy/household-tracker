export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  address?: string;
  object_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  object_count?: number;
  created_at: string;
}

export interface HouseholdObject {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  category_name?: string;
  category_color?: string;
  location_id?: number;
  location_name?: string;
  photo_url?: string;
  added_by: number;
  added_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ObjectHistory {
  id: number;
  object_id: number;
  from_location_id?: number;
  from_location_name?: string;
  to_location_id?: number;
  to_location_name?: string;
  moved_by: number;
  moved_by_name?: string;
  moved_at: string;
  notes?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
