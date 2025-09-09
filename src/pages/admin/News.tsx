import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Clock, Calendar, User, AlertTriangle,
  TrendingUp, Zap, Star, Search, RefreshCw, MoreVertical, CheckCircle,
  XCircle, Pause, X, Filter, Grid3X3, List, Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  isActive: boolean;
}

const News: React.FC = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    status: 'DRAFT' as const,
    isFeatured: false,
    isBreaking: false,
    isTrending: false,
    imageFile: null as File | null
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch news articles
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getArticles({ 
        page: currentPage, 
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        categoryId: categoryFilter === 'ALL' ? undefined : categoryFilter,
        sortBy,
        sortOrder
      });
      
      if (response?.data) {
        let filteredNews = response.data;
        
        // Apply type filter
        if (typeFilter !== 'ALL') {
          filteredNews = filteredNews.filter(article => {
            if (typeFilter === 'BREAKING') return article.isBreaking;
            if (typeFilter === 'FEATURED') return article.isFeatured;
            if (typeFilter === 'TRENDING') return article.isTrending;
            return true;
          });
        }
        
        setNews(filteredNews);
        setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response) {
        setCategories(response);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, typeFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image file size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      setFormError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.content.trim()) errors.push('Content is required');
    if (!formData.categoryId) errors.push('Category is required');
    
    if (errors.length > 0) {
      setFormError(`Please fix the following errors: ${errors.join(', ')}`);
      setFormLoading(false);
      return;
    }

    try {
      const data = new FormData();
      if (formData.imageFile) data.append('image', formData.imageFile);
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('excerpt', formData.excerpt);
      data.append('categoryId', formData.categoryId);
      data.append('status', formData.status);
      data.append('isFeatured', formData.isFeatured.toString());
      data.append('isBreaking', formData.isBreaking.toString());
      data.append('isTrending', formData.isTrending.toString());

      const newArticle = await apiClient.createArticle(data);
      setNews(prev => [newArticle, ...prev]);
      setFormSuccess('News article created successfully!');
      
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
        setFormSuccess(null);
      }, 1500);
    } catch (error: any) {
      setFormError(`Failed to create article: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '', content: '', excerpt: '', categoryId: '', status: 'DRAFT',
      isFeatured: false, isBreaking: false, isTrending: false, imageFile: null
    });
    setFormError(null);
    setFormSuccess(null);
  };

  // Delete article
  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteArticle(id);
      setNews(prev => prev.filter(article => article.id !== id));
      setShowDeleteModal(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  // Toggle article status
  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await apiClient.updateArticle(id, { status: newStatus });
      setNews(prev => prev.map(article => 
        article.id === id ? { ...article, status: newStatus as any } : article
      ));
    } catch (error) {
      console.error('Error updating article status:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const config = {
      DRAFT: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PUBLISHED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800', icon: Pause },
      DELETED: { color: 'bg-red-100 text-red-800', icon: XCircle }
    }[status] || { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  // Get type badges
  const getTypeBadges = (article: NewsArticle) => {
    const badges = [];
    if (article.isBreaking) {
      badges.push(
        <span key="breaking" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-1">
          <Zap className="w-3 h-3 mr-1" />
          Breaking
        </span>
      );
    }
    if (article.isFeatured) {
      badges.push(
        <span key="featured" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-1">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </span>
      );
    }
    if (article.isTrending) {
      badges.push(
        <span key="trending" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
          <TrendingUp className="w-3 h-3 mr-1" />
          Trending
        </span>
      );
    }
    return badges;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Grid3X3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
                <p className="text-sm text-gray-600">Manage all types of news articles</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    <Grid3X3 className="w-3 h-3 mr-1" />
                    {news.length} Articles
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News Article
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="ALL">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="ALL">All Types</option>
                <option value="BREAKING">Breaking News</option>
                <option value="FEATURED">Featured News</option>
                <option value="TRENDING">Trending News</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Date Updated</option>
                <option value="title">Title</option>
                <option value="viewCount">Views</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>

              <button
                onClick={fetchNews}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No news articles</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first news article.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add News Article
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {news.map((article) => (
              <div key={article.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                {/* Article Image */}
                <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48'}`}>
                  {article.featuredImage ? (
                    <img
                      className="w-full h-full object-cover"
                      src={article.featuredImage}
                      alt={article.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Grid3X3 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      {getStatusBadge(article.status)}
                      {getTypeBadges(article)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {article.author.firstName} {article.author.lastName}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.createdAt)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {article.viewCount} views
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {article.likeCount} likes
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleStatus(article.id, article.status)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        article.status === 'PUBLISHED'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {article.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>

                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedArticle(article);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add News Article</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formSuccess && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {formSuccess}
              </div>
            )}

            {formError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter article content"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter article excerpt (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBreaking"
                    checked={formData.isBreaking}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Breaking</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Trending</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {formLoading ? 'Creating...' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedArticle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Article</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{selectedArticle.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 px-4 py-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedArticle.id)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;

