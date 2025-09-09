import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Calendar, 
  RefreshCw,
  BarChart3,
  TrendingUp,
  X,
  Save,
  AlertCircle,
  Hash
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  articleCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  children?: Category[];
}

const Categories = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Add Category Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // Edit Category Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  // View Category Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  // Delete Category Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteText, setDeleteText] = useState('');
  const [deleteFormLoading, setDeleteFormLoading] = useState(false);
  const [deleteFormError, setDeleteFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);



  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real categories from backend
      const response = await apiClient.getCategories();
      
      if (response && Array.isArray(response)) {
        // Transform the response to match our interface
        const transformedCategories = response.map(category => ({
          ...category,
          description: category.description || '',
          articleCount: category._count?.news || 0,
          isActive: category.isActive !== false // Default to true if not specified
        }));
        setCategories(transformedCategories);
      } else {
        console.error('❌ Invalid categories response:', response);
        setCategories([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch categories');
      setLoading(false);
      setCategories([]);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  // Add Category Modal Functions
  const openAddModal = () => {
    if (!isAuthenticated) {
      setError('You must be logged in to create categories');
      return;
    }
    
    setShowAddModal(true);
    setFormError(null);
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormError(null);
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  // Edit Category Modal Functions
  const openEditModal = (category: Category) => {
    if (!isAuthenticated) {
      setError('You must be logged in to edit categories');
      return;
    }
    
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setShowEditModal(true);
    setEditFormError(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setEditFormError(null);
    setEditFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setEditFormError('You must be logged in to edit categories');
      return;
    }
    
    if (!editingCategory || !editFormData.name.trim() || !editFormData.description.trim()) {
      setEditFormError('Please fill in all required fields');
      return;
    }

    try {
      setEditFormLoading(true);
      setEditFormError(null);

      const updatedCategory = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        isActive: editFormData.isActive
      };

      console.log('🚀 Attempting to update category:', updatedCategory);
      console.log('🔑 Auth token available:', !!apiClient.token);

      const response = await apiClient.updateCategory(editingCategory.id, updatedCategory);
      
      console.log('📡 Server response:', response);
      
      if (response && response.success && response.category && response.category.id) {
        // Update the category in the list
        const updatedCategoryWithCount = {
          ...response.category,
          articleCount: editingCategory.articleCount, // Preserve article count
          isActive: response.category.isActive !== false
        };
        
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? updatedCategoryWithCount : cat
        ));
        closeEditModal();
        
        console.log('✅ Category updated successfully:', response.category);
      } else {
        setEditFormError('Failed to update category. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error updating category:', error);
      
      // Extract error message from server response
      let errorMessage = 'Failed to update category. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract error message from server response
        if ('error' in error) {
          errorMessage = error.error;
        } else if ('message' in error) {
          errorMessage = error.message;
        }
      }
      
      setEditFormError(errorMessage);
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setFormError('You must be logged in to create categories');
      return;
    }
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      const newCategory = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive
      };

      console.log('🚀 Attempting to create category:', newCategory);
      console.log('🔑 Auth token available:', !!apiClient.token);

      const response = await apiClient.createCategory(newCategory);
      
      console.log('📡 Server response:', response);
      
      if (response && response.success && response.category && response.category.id) {
        // Add the new category to the list
        const categoryWithCount = {
          ...response.category,
          articleCount: 0,
          isActive: response.category.isActive !== false
        };
        
        setCategories(prev => [categoryWithCount as Category, ...prev]);
        closeAddModal();
        
        // Show success message (you can add a toast notification here)
        console.log('✅ Category created successfully:', response.category);
      } else {
        setFormError('Failed to create category. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error creating category:', error);
      
      // Extract error message from server response
      let errorMessage = 'Failed to create category. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract error message from server response
        if ('error' in error) {
          errorMessage = error.error;
        } else if ('message' in error) {
          errorMessage = error.message;
        }
      }
      
      setFormError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, isActive: !currentStatus } : category
    ));
  };

  // View Category Modal Functions
  const openViewModal = (category: Category) => {
    setViewingCategory(category);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingCategory(null);
  };

  // Delete Category Modal Functions
  const openDeleteModal = (category: Category) => {
    if (!isAuthenticated) {
      setError('You must be logged in to delete categories');
      return;
    }
    
    setDeletingCategory(category);
    setDeleteText('');
    setDeleteFormError(null);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCategory(null);
    setDeleteText('');
    setDeleteFormError(null);
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setDeleteFormError('You must be logged in to delete categories');
      return;
    }
    
    if (!deletingCategory) {
      setDeleteFormError('No category selected for deletion');
      return;
    }

    // Validate DELETE text
    if (deleteText !== 'DELETE') {
      setDeleteFormError('Please type DELETE exactly as shown');
      return;
    }

    try {
      setDeleteFormLoading(true);
      setDeleteFormError(null);

      console.log('🗑️ Attempting to delete category:', deletingCategory.name);
      console.log('🔑 Auth token available:', !!apiClient.token);

      // Call the delete API
      await apiClient.deleteCategory(deletingCategory.id);
      
      // Remove from local state
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id));
      closeDeleteModal();
      
      console.log('✅ Category deleted successfully:', deletingCategory.name);
      
      // Show success message (you can add a toast notification here)
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      
      // Extract error message from server response
      let errorMessage = 'Failed to delete category. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        if ('error' in error) {
          errorMessage = error.error;
        } else if ('message' in error) {
          errorMessage = error.message;
        }
      }
      
      setDeleteFormError(errorMessage);
    } finally {
      setDeleteFormLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('rw-RW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );



  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg font-medium">Checking authentication...</p>
          <p className="text-green-600 text-sm mt-2">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Authentication Required</h3>
          <p className="text-red-600 mb-4">You must be logged in to access this page</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg font-medium">Loading categories...</p>
          <p className="text-green-600 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">Category Management</h1>
            <p className="text-green-700 font-medium">Organize and manage article categories</p>
            {user && (
              <p className="text-sm text-green-600 mt-1">
                Logged in as: <span className="font-semibold">{user.firstName} {user.lastName}</span> ({user.role})
              </p>
            )}
          </div>
          <div className="text-sm text-green-600 font-medium">
            {loading ? 'Loading...' : `${categories.length} categories loaded`}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading categories</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-200 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Total Categories</p>
              <p className="text-3xl font-bold text-yellow-800">{categories.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-md">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Categories</p>
              <p className="text-3xl font-bold text-green-800">{categories.filter(c => c.isActive).length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl shadow-md">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Articles</p>
              <p className="text-3xl font-bold text-green-800">{categories.reduce((sum, c) => sum + c.articleCount, 0)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl shadow-md">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Avg Articles/Category</p>
              <p className="text-3xl font-bold text-green-800">
                {categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.articleCount, 0) / categories.length) : 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl shadow-md">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 shadow-lg border border-green-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories by name, description, or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={openAddModal}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-green-800">
            {loading ? 'Loading...' : `${filteredCategories.length} Categories Found`}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <RefreshCw className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-green-700 font-medium">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-yellow-700" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              {searchTerm ? 'No categories found' : 'No categories found'}
            </h3>
            <p className="text-green-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
            </p>
            {!searchTerm && (
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
              >
                Retry Loading
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-green-50 to-yellow-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-yellow-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-3 bg-gradient-to-br from-green-400 to-green-500 shadow-md"
                        >
                          <span className="text-white font-bold text-sm">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-green-800">{category.name}</div>
                          <div className="text-sm text-green-600">/{category.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-green-700 max-w-xs truncate" title={category.description}>
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-green-800">{category.articleCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        category.isActive 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openViewModal(category)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100" 
                          title="View Category"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(category)}
                          className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-100" 
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(category.id, category.isActive)}
                          className={`transition-colors p-1 rounded ${
                            category.isActive 
                              ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                          }`}
                          title={category.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {category.isActive ? '🟢' : '🔴'}
                        </button>
                        <button 
                          onClick={() => openDeleteModal(category)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-100"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Error Message */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-800 text-sm">{formError}</p>
                  </div>
                </div>
              )}

              {/* Name and Description */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                    placeholder="Describe what this category is about..."
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Category is active
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Category</span>
                    </>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Error Message */}
              {editFormError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-800 text-sm">{editFormError}</p>
                  </div>
                </div>
              )}

              {/* Name and Description */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                    placeholder="Describe what this category is about..."
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  name="isActive"
                  checked={editFormData.isActive}
                  onChange={handleEditInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-700">
                  Category is active
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editFormLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {editFormLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Category</span>
                    </>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewModal && viewingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Category Details</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category Information */}
            <div className="p-6 space-y-6">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FolderOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{viewingCategory.name}</h3>
                    <p className="text-gray-600 mt-1">{viewingCategory.description}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        viewingCategory.isActive 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                      }`}>
                        {viewingCategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        {viewingCategory.articleCount} Articles
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Category ID</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                      {viewingCategory.id}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Slug</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                      {viewingCategory.slug}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border min-h-[60px]">
                      {viewingCategory.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Statistics & Timestamps */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Statistics & Timestamps</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Article Count</label>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-2xl font-bold text-blue-600">{viewingCategory.articleCount}</span>
                      <span className="text-sm text-gray-500">articles</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        viewingCategory.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        viewingCategory.isActive ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {viewingCategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(viewingCategory.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(viewingCategory.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      closeViewModal();
                      openEditModal(viewingCategory);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Category</span>
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal();
                      handleToggleStatus(viewingCategory.id, viewingCategory.isActive);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      viewingCategory.isActive 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {viewingCategory.isActive ? '🟢' : '🔴'}
                    <span>{viewingCategory.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal();
                      openDeleteModal(viewingCategory);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Category</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-900">Delete Category</h2>
                  <p className="text-red-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Warning: Irreversible Action</h3>
                    <p className="text-red-700 mb-3">
                      You are about to permanently delete the category <strong>"{deletingCategory.name}"</strong>.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-red-600 mb-2"><strong>This will:</strong></p>
                      <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                        <li>Remove the category permanently</li>
                        <li>Affect {deletingCategory.articleCount} article(s) in this category</li>
                        <li>Cannot be undone or recovered</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Form */}
              <form onSubmit={handleDeleteSubmit} className="space-y-6">
                {/* Error Message */}
                {deleteFormError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      <p className="text-red-800 text-sm">{deleteFormError}</p>
                    </div>
                  </div>
                )}

                {/* DELETE Text Confirmation */}
                <div>
                  <label htmlFor="delete-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Type "DELETE" to confirm *
                  </label>
                  <input
                    type="text"
                    id="delete-text"
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-mono text-center text-lg tracking-wider"
                    placeholder="DELETE"
                  />
                  <p className="text-xs text-gray-500 mt-1">Type DELETE exactly as shown to confirm</p>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteFormLoading || deleteText !== 'DELETE'}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-md"
                  >
                    {deleteFormLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Category</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
