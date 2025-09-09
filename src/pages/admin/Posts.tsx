import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag,
  MoreVertical,
  Star,
  Pin,
  MessageCircle,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import { apiClient, Post, Category } from '../../services/api';

const Posts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get server base URL
  const getServerBaseUrl = () => {
    // In development, use relative URLs since Vite proxy handles routing
    if (import.meta.env.DEV) {
      return '';
    }
    // In production, use the full server URL
    return import.meta.env.VITE_API_URL || '';
  };

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    console.log('🔗 Processing image URL:', imagePath);
    
    // Fix any URLs that still have /api/ in them
    let fixedPath = imagePath;
    if (imagePath.includes('/api/uploads/')) {
      fixedPath = imagePath.replace('/api/uploads/', '/uploads/');
      console.log('🔧 Fixed URL (removed /api/):', fixedPath);
    }
    
    // If the image path already includes a full URL, use it as is
    if (fixedPath.startsWith('http://') || fixedPath.startsWith('https://')) {
      console.log('✅ Using full URL as-is:', fixedPath);
      return fixedPath;
    }
    // Otherwise, prepend the server base URL
    const finalUrl = `${getServerBaseUrl()}${fixedPath}`;
    console.log('🔧 Constructed URL:', finalUrl);
    return finalUrl;
  };
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postsToDelete, setPostsToDelete] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' }
  ];

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentPage, selectedStatus, selectedCategory, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        page: currentPage,
        limit: 12
      };

      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await apiClient.getPosts(params);
      console.log('📄 Posts fetched:', response.data.length, 'posts');
      response.data.forEach(post => {
        if (post.featuredImage) {
          console.log('🖼️ Post featured image:', post.title, '->', post.featuredImage);
          console.log('🔗 Generated image URL:', getImageUrl(post.featuredImage));
        }
      });
      setPosts(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeletePosts = async (postIds: string[]) => {
    setPostsToDelete(postIds);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.deletePosts(postsToDelete);
      await fetchPosts();
      setSelectedPosts([]);
      setShowDeleteConfirm(false);
      setPostsToDelete([]);
    } catch (error) {
      console.error('Error deleting posts:', error);
      // Check if it's a "Post not found" error
      if (error.message && error.message.includes('Post not found')) {
        setError('Some posts may have already been deleted. Refreshing the list...');
        // Refresh the posts list to get current state
        await fetchPosts();
      } else {
        setError('Failed to delete posts. Please try again.');
      }
      setShowDeleteConfirm(false);
      setPostsToDelete([]);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostsToDelete([]);
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const selectAllPosts = () => {
    setSelectedPosts(posts.map(post => post.id));
  };

  const clearSelection = () => {
    setSelectedPosts([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPosts = posts;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and articles</p>
          </div>
          <button 
            onClick={() => navigate('/admin/posts/add')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-green-800 font-medium">
              {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleDeletePosts(selectedPosts)}
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => fetchPosts()}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Posts Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">Get started by creating your first post.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
                selectedPosts.includes(post.id) 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={(e) => {
                // Don't navigate if clicking on checkbox or action buttons
                if ((e.target as HTMLElement).closest('input[type="checkbox"]') || 
                    (e.target as HTMLElement).closest('button')) {
                  return;
                }
                console.log('🖱️ Grid view: Clicking on post:', post.id, post.title);
                navigate(`/admin/posts/${post.id}`);
              }}
            >
              <div className="p-3">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => togglePostSelection(post.id)}
                      className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                    />
                    {/* Square Status Badge */}
                    <div className="flex justify-center">
                      <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-md ${getStatusColor(post.status)}`}>
                        {post.status.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {post.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                    {post.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Optimized Post Thumbnail */}
                <div className="mb-3">
                  <div className="relative w-full h-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {post.featuredImage ? (
                      <img
                        src={getImageUrl(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load featured image:', getImageUrl(post.featuredImage));
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show a placeholder
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div class="text-center">
                                  <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p class="text-xs text-gray-500 font-medium">No image</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                        onLoad={() => {
                          console.log('✅ Featured image loaded:', getImageUrl(post.featuredImage));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 font-medium">No image</p>
                        </div>
                      </div>
                    )}
                    {/* Overlay for better text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Post Meta */}
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3" />
                      <span className="truncate">{post.author.firstName} {post.author.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {post.category && (
                      <div className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        <span className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{post.viewCount}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => navigate(`/admin/posts/${post.id}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Post"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeletePosts([post.id])}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={selectedPosts.length === filteredPosts.length ? clearSelection : selectAllPosts}
                      className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr 
                    key={post.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      // Don't navigate if clicking on checkbox or action buttons
                      if ((e.target as HTMLElement).closest('input[type="checkbox"]') || 
                          (e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      console.log('🖱️ List view: Clicking on post:', post.id, post.title);
                      navigate(`/admin/posts/${post.id}`);
                    }}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                        className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          {post.featuredImage ? (
                            <img
                              src={getImageUrl(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover object-center"
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                              onError={(e) => {
                                console.error('❌ Failed to load list view featured image:', getImageUrl(post.featuredImage));
                                // Fallback to FileText icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
                                }
                              }}
                              onLoad={() => {
                                console.log('✅ List view featured image loaded:', getImageUrl(post.featuredImage));
                              }}
                            />
                          ) : (
                            <FileText className="w-7 h-7 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {post.title}
                            {post.isFeatured && <Star className="w-4 h-4 text-yellow-500 ml-2" />}
                            {post.isPinned && <Pin className="w-4 h-4 text-blue-500 ml-1" />}
                          </div>
                          {post.excerpt && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {post.excerpt}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-md ${getStatusColor(post.status)}`}>
                          {post.status.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {post.author.firstName} {post.author.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {post.category ? (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">No category</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{post.commentCount}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{post.likeCount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/posts/${post.id}`)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Post"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePosts([post.id])}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Post"
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete {postsToDelete.length === 1 ? 'Post' : 'Posts'}
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete {postsToDelete.length === 1 ? 'this post' : `these ${postsToDelete.length} posts`}? 
                This will permanently remove {postsToDelete.length === 1 ? 'it' : 'them'} from the database.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete {postsToDelete.length === 1 ? 'Post' : 'Posts'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
