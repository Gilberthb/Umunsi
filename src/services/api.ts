// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
  token: string;
}

// News Types
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  articleCount: number;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  _count: {
    articles: number;
    comments: number;
  };
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
  totalComments: number;
  userGrowthPercentage: number;
  articleGrowthPercentage: number;
}

export interface AnalyticsData {
  period: string;
  totalViews: number;
  uniqueVisitors: number;
  newUsers: number;
  returningUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  topCategories: Array<{
    name: string;
    views: number;
    color: string;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
  articleGrowth: Array<{
    date: string;
    articles: number;
  }>;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && retryCount === 0) {
        try {
          // Try to refresh the token
          await this.refreshToken();
          // Retry the original request
          return this.request(endpoint, options, retryCount + 1);
        } catch (refreshError) {
          // If refresh fails, clear token and redirect to login
          this.token = null;
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await this.request<AuthResponse['user']>('/auth/me');
    return response;
  }

  async refreshToken(): Promise<void> {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST'
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
  }

  // News Methods
  async getArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Article>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const response = await this.request<{news: Article[], pagination: any}>(
      `/news?${searchParams.toString()}`
    );
    return {
      data: response.news,
      pagination: response.pagination
    };
  }

  async getArticle(id: string): Promise<Article> {
    const response = await this.request<Article>(`/news/${id}`);
    return response;
  }

  async createArticle(articleData: Partial<Article>): Promise<Article> {
    const response = await this.request<Article>('/news', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
    return response;
  }

  async updateArticle(id: string, articleData: Partial<Article>): Promise<Article> {
    const response = await this.request<Article>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
    return response;
  }

  async deleteArticle(id: string): Promise<void> {
    await this.request(`/news/${id}`, { method: 'DELETE' });
  }

  // Categories Methods
  async getCategories(): Promise<Category[]> {
    const response = await this.request<{categories: Category[]}>('/categories');
    return response.categories;
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const response = await this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response;
  }

  // Users Methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);

    const response = await this.request<PaginatedResponse<User>>(
      `/users?${searchParams.toString()}`
    );
    return response;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Analytics Methods
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>('/admin/dashboard');
    return response;
  }

  async getAnalytics(period: string = '30d'): Promise<AnalyticsData> {
    const response = await this.request<AnalyticsData>(`/analytics?period=${period}`);
    return response;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; environment: string; database: string }> {
    const response = await this.request('/health');
    return response;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export type {
  ApiResponse,
  PaginatedResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  Article,
  Category,
  User,
  DashboardStats,
  AnalyticsData,
};
