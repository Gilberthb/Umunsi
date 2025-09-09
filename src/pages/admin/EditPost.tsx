import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Tag,
  Calendar,
  User,
  FolderOpen,
  Star,
  Pin,
  MessageCircle,
  Globe,
  Lock,
  FileText,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { apiClient, Category, MediaFile, Post } from '../../services/api';
import RichTextEditor from '../../components/RichTextEditor';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED',
    categoryId: '',
    isFeatured: false,
    isPinned: false,
    allowComments: true,
    tags: [] as string[],
    metaTitle: '',
    metaDescription: ''
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedFeaturedImage, setSelectedFeaturedImage] = useState<MediaFile | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchCategories();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setInitialLoading(true);
      const postData = await apiClient.getPost(id!);
      setPost(postData);
      
      // Extract featured image URL from the full URL
      const featuredImageUrl = postData.featuredImage ? 
        postData.featuredImage.replace(/^https?:\/\/[^\/]+/, '') : '';
      
      setFormData({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt || '',
        featuredImage: featuredImageUrl,
        status: postData.status,
        categoryId: postData.category?.id || '',
        isFeatured: postData.isFeatured,
        isPinned: postData.isPinned,
        allowComments: postData.allowComments,
        tags: postData.tags || [],
        metaTitle: postData.metaTitle || '',
        metaDescription: postData.metaDescription || ''
      });

      // Set selected featured image if exists
      if (postData.featuredImage) {
        setSelectedFeaturedImage({
          id: 'temp',
          originalName: 'Current Featured Image',
          filename: 'current',
          mimeType: 'image/svg+xml',
          size: 0,
          url: featuredImageUrl,
          thumbnailUrl: featuredImageUrl,
          category: 'featured',
          tags: [],
          description: 'Current featured image',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { id: 'temp', firstName: 'Current', lastName: 'User' }
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setErrors({ fetch: 'Failed to load post. Please try again.' });
    } finally {
      setInitialLoading(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.excerpt && formData.excerpt.length > 500) {
      newErrors.excerpt = 'Excerpt must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.updatePost(id!, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featuredImage: formData.featuredImage || undefined,
        status: formData.status,
        categoryId: formData.categoryId || undefined,
        isFeatured: formData.isFeatured,
        isPinned: formData.isPinned,
        allowComments: formData.allowComments,
        tags: formData.tags,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined
      });

      navigate('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      setErrors({ submit: 'Failed to update post. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const plainText = formData.content.replace(/<[^>]*>/g, '');
      const excerpt = plainText.substring(0, 150);
      setFormData(prev => ({
        ...prev,
        excerpt: excerpt + (plainText.length > 150 ? '...' : '')
      }));
    }
  };

  const generateMetaTitle = () => {
    if (formData.title) {
      setFormData(prev => ({
        ...prev,
        metaTitle: formData.title
      }));
    }
  };

  const generateMetaDescription = () => {
    if (formData.excerpt) {
      setFormData(prev => ({
        ...prev,
        metaDescription: formData.excerpt
      }));
    }
  };

  const handleFeaturedImageSelect = (media: MediaFile) => {
    setSelectedFeaturedImage(media);
    const getServerBaseUrl = () => {
      return import.meta.env.VITE_API_URL || '';
    };
    setFormData(prev => ({
      ...prev,
      featuredImage: `${getServerBaseUrl()}${media.url}`
    }));
  };

  const removeFeaturedImage = () => {
    setSelectedFeaturedImage(null);
    setFormData(prev => ({
      ...prev,
      featuredImage: ''
    }));
  };

  if (initialLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/posts')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/posts')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Posts
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              <p className="text-gray-600 mt-1">Update your blog post</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              type="submit"
              form="post-form"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {(errors.submit || errors.fetch) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{errors.submit || errors.fetch}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form id="post-form" onSubmit={handleSubmit} className="p-6">
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter post title..."
                  maxLength={200}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your post content here..."
                  className={errors.content ? 'border-red-300' : ''}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                    Excerpt
                  </label>
                  <button
                    type="button"
                    onClick={generateExcerpt}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Generate from content
                  </button>
                </div>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.excerpt ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of your post..."
                  maxLength={500}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.excerpt.length}/500 characters
                </p>
              </div>

              {/* Featured Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                
                {selectedFeaturedImage ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL || ''}${selectedFeaturedImage.url}`}
                        alt="Featured image preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.error('Failed to load featured image:', e);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Featured image loaded successfully');
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeFeaturedImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFeaturedImage.originalName}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFeaturedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMediaLibrary(true)}
                        className="text-sm text-green-600 hover:text-green-700 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No featured image selected</p>
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Select from Media Library
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Publish Settings
            </h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                  />
                  <Star className="w-4 h-4 ml-2 text-yellow-500" />
                  <span className="ml-2 text-sm text-gray-700">Featured Post</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                  />
                  <Pin className="w-4 h-4 ml-2 text-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Pinned Post</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                  />
                  <MessageCircle className="w-4 h-4 ml-2 text-gray-500" />
                  <span className="ml-2 text-sm text-gray-700">Allow Comments</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Tags
            </h3>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              SEO Settings
            </h3>
            
            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                    Meta Title
                  </label>
                  <button
                    type="button"
                    onClick={generateMetaTitle}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Use title
                  </button>
                </div>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="SEO title for search engines..."
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <button
                    type="button"
                    onClick={generateMetaDescription}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Use excerpt
                  </button>
                </div>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="SEO description for search engines..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal for Featured Image */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleFeaturedImageSelect}
        title="Select Featured Image"
        mode="select"
        type="image"
      />
    </div>
  );
};

export default EditPost;
