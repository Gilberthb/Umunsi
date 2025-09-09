import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag,
  Star,
  Pin,
  MessageCircle,
  TrendingUp,
  Globe,
  Lock,
  FileText,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { apiClient, Post } from '../../services/api';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🚀 PostDetail component mounted with ID:', id);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching post with ID:', id);
      const postData = await apiClient.getPost(id!);
      console.log('📄 Post data received:', postData);
      console.log('📝 Content length:', postData.content?.length || 0);
      console.log('🖼️ Featured image:', postData.featuredImage);
      console.log('📋 Full post object keys:', Object.keys(postData));
      console.log('📋 Post content preview:', postData.content?.substring(0, 100));
      setPost(postData);
    } catch (error: any) {
      console.error('❌ Error fetching post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    if (confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      try {
        await apiClient.deletePosts([post.id]);
        navigate('/admin/posts');
      } catch (error: any) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post. Please try again.');
      }
    }
  };

  const getServerBaseUrl = () => {
    if (import.meta.env.DEV) {
      return '';
    }
    return import.meta.env.VITE_API_URL || '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Post</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => fetchPost()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/admin/posts')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/admin/posts')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/admin/posts')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Posts
            </button>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          </div>
          
          {/* Title and Thumbnail Section */}
          <div className="flex items-start gap-4 mb-3">
            {/* Thumbnail */}
            {post.featuredImage && (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={`${getServerBaseUrl()}${post.featuredImage}`}
                    alt={post.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Title and Meta Info */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <h1 
                className="text-lg font-bold text-gray-900 mb-2 leading-tight break-words overflow-wrap-anywhere"
                style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
              >
                {post.title}
              </h1>
              
              {/* Post Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>{post.author?.name || 'Unknown Author'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  <span>{post.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex items-center">
                  {post.status === 'PUBLISHED' ? (
                    <Globe className="w-3 h-3 mr-1 text-green-600" />
                  ) : (
                    <Lock className="w-3 h-3 mr-1 text-gray-400" />
                  )}
                  <span className={post.status === 'PUBLISHED' ? 'text-green-600' : 'text-gray-400'}>
                    {post.status}
                  </span>
                </div>
              </div>

              {/* Post Stats */}
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>{post.viewCount} views</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span>{post.commentCount} comments</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{post.likeCount} likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Content</h2>
          <div className="w-full overflow-hidden">
            {post.content ? (
              <div 
                className="text-gray-800 text-sm leading-relaxed break-words overflow-wrap-anywhere"
                style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(
                    /<img([^>]*)src="([^"]*)"([^>]*)>/gi, 
                    (match, before, src, after) => {
                      // Fix image URLs to use the correct server base URL
                      const correctedSrc = src.startsWith('/uploads/') 
                        ? `${getServerBaseUrl()}${src}`
                        : src.startsWith('http') 
                        ? src 
                        : `${getServerBaseUrl()}/uploads/${src}`;
                      
                      return `<img${before}src="${correctedSrc}"${after} class="max-w-full h-auto rounded-lg shadow-sm my-4 block" onerror="this.style.display='none'">`;
                    }
                  )
                }} 
              />
            ) : (
              <p className="text-gray-500 italic text-sm">No content available for this post.</p>
            )}
          </div>
        </div>

        {/* Content Images Gallery */}
        {post.content && (() => {
          const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
          const images = [];
          let match;
          while ((match = imgRegex.exec(post.content)) !== null) {
            images.push(match[1]);
          }
          
          if (images.length > 0) {
            return (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Content Images ({images.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {images.map((src, index) => {
                    const correctedSrc = src.startsWith('/uploads/') 
                      ? `${getServerBaseUrl()}${src}`
                      : src.startsWith('http') 
                      ? src 
                      : `${getServerBaseUrl()}/uploads/${src}`;
                    
                    return (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center group cursor-pointer hover:shadow-md transition-shadow">
                        <img
                          src={correctedSrc}
                          alt={`Content image ${index + 1}`}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onClick={() => {
                            // Open image in new tab for full view
                            window.open(correctedSrc, '_blank');
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Post Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Excerpt */}
            {post.excerpt && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Excerpt</h3>
                <div className="w-full overflow-hidden">
                  <p 
                    className="text-gray-700 text-sm break-words overflow-wrap-anywhere"
                    style={{ 
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    {post.excerpt}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SEO */}
            {(post.metaTitle || post.metaDescription) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">SEO Information</h3>
                {post.metaTitle && (
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Meta Title</label>
                    <div className="w-full overflow-hidden">
                      <p 
                        className="text-gray-600 text-sm break-words overflow-wrap-anywhere"
                        style={{ 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {post.metaTitle}
                      </p>
                    </div>
                  </div>
                )}
                {post.metaDescription && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Meta Description</label>
                    <div className="w-full overflow-hidden">
                      <p 
                        className="text-gray-600 text-sm break-words overflow-wrap-anywhere"
                        style={{ 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {post.metaDescription}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Post Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Post Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Featured Post</span>
                  {post.isFeatured ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  ) : (
                    <Star className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Pinned Post</span>
                  {post.isPinned ? (
                    <Pin className="w-4 h-4 text-blue-500 fill-current" />
                  ) : (
                    <Pin className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Allow Comments</span>
                  {post.allowComments ? (
                    <MessageCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>
            </div>

            {/* Post Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Post Information</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono text-gray-900">{post.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slug:</span>
                  <span className="font-mono text-gray-900">{post.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{formatDate(post.createdAt)}</span>
                </div>
                {post.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="text-gray-900">{formatDate(post.updatedAt)}</span>
                  </div>
                )}
                {post.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="text-gray-900">{formatDate(post.publishedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
