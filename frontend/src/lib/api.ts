// API service for backend communication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  favorites?: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Temple {
  _id: string;
  id: string;
  name: string;
  location: string;
  deity: string;
  description: string;
  shortDescription: string;
  image: string;
  region: 'Mangalore' | 'Udupi' | 'Kundapura';
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  _id: string;
  temple: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  visitDate?: string;
  createdAt: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
    return res.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
};

// Temple API
export const templeAPI = {
  getAll: async (params?: { region?: string; sort?: string; search?: string }): Promise<{ success: boolean; count: number; data: Temple[] }> => {
    const query = new URLSearchParams((params || {}) as unknown as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/temples${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch temples');
    return res.json();
  },

  getById: async (id: string): Promise<{ success: boolean; data: Temple }> => {
    const res = await fetch(`${API_URL}/temples/${id}`);
    if (!res.ok) throw new Error('Failed to fetch temple');
    return res.json();
  },

  addToFavorites: async (templeId: string): Promise<{ success: boolean; data: string[] }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to add to favorites');
    return res.json();
  },

  removeFromFavorites: async (templeId: string): Promise<{ success: boolean; data: string[] }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/favorite`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove from favorites');
    return res.json();
  },
};

// Review API
export const reviewAPI = {
  getByTemple: async (templeId: string): Promise<{ success: boolean; count: number; data: Review[] }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  create: async (templeId: string, rating: number, comment: string, visitDate?: string): Promise<{ success: boolean; data: Review }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment, visitDate }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create review');
    }
    return res.json();
  },

  update: async (reviewId: string, rating: number, comment: string): Promise<{ success: boolean; data: Review }> => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to update review');
    return res.json();
  },

  delete: async (reviewId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },
};
