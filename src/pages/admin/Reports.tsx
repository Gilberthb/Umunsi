import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Eye, 
  Heart,
  MessageSquare,
  FolderOpen,
  Calendar,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../../services/api';

const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'fgggg.space/api';
  return apiUrl.replace('/api', '');
};

interface ReportData {
  // Summary Stats
  totalPosts: number;
  totalUsers: number;
  totalCategories: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  
  // Posts by Status
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  
  // Posts by Category
  postsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
    color?: string;
  }>;
  
  // Top Authors
  topAuthors: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    postCount: number;
    totalViews: number;
  }>;
  
  // Top Posts
  topPosts: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    featuredImage?: string;
    author?: {
      firstName: string;
      lastName: string;
    };
    category?: {
      name: string;
    };
    createdAt: string;
  }>;
  
  // Recent Activity
  recentPosts: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    author?: {
      firstName: string;
      lastName: string;
    };
  }>;
  
  // User Roles Distribution
  usersByRole: {
    admin: number;
    editor: number;
    author: number;
    user: number;
  };
}

const Reports = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'overview' | 'posts' | 'users' | 'engagement'>('overview');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📊 Fetching report data...');

      // Fetch all data in parallel
      const [dashboardStats, postsResponse, categoriesResponse, usersResponse] = await Promise.all([
        apiClient.getDashboardStats().catch(() => null),
        apiClient.getPosts({ limit: 100 }).catch(() => ({ data: [] })),
        apiClient.getCategories({ includeInactive: true }).catch(() => []),
        apiClient.getUsers({ limit: 100 }).catch(() => ({ data: [] }))
      ]);

      const allPosts = postsResponse?.data || [];
      const allUsers = usersResponse?.data || [];
      const allCategories = categoriesResponse || [];

      // Calculate posts by status
      const publishedPosts = allPosts.filter((p: any) => p.status === 'PUBLISHED');
      const draftPosts = allPosts.filter((p: any) => p.status === 'DRAFT');
      const archivedPosts = allPosts.filter((p: any) => p.status === 'ARCHIVED');

      // Calculate totals
      const totalViews = allPosts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
      const totalLikes = allPosts.reduce((sum: number, p: any) => sum + (p.likeCount || 0), 0);
      const totalComments = allPosts.reduce((sum: number, p: any) => sum + (p.commentCount || p._count?.comments || 0), 0);

      // Posts by category
      const categoryColors = ['#fcd535', '#3b82f6', '#a855f7', '#ef4444', '#10b981', '#f97316', '#06b6d4', '#ec4899'];
      const postsByCategory = allCategories.map((cat: any, index: number) => ({
        categoryId: cat.id,
        categoryName: cat.name,
        count: allPosts.filter((p: any) => p.category?.id === cat.id).length,
        color: cat.color || categoryColors[index % categoryColors.length]
      })).sort((a: any, b: any) => b.count - a.count);

      // Top authors
      const authorMap = new Map();
      allPosts.forEach((post: any) => {
        if (post.author) {
          const authorId = post.author.id;
          if (!authorMap.has(authorId)) {
            authorMap.set(authorId, {
              id: authorId,
              username: post.author.username,
              firstName: post.author.firstName || '',
              lastName: post.author.lastName || '',
              avatar: post.author.avatar,
              postCount: 0,
              totalViews: 0
            });
          }
          const author = authorMap.get(authorId);
          author.postCount++;
          author.totalViews += post.viewCount || 0;
        }
      });
      const topAuthors = Array.from(authorMap.values())
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 5);

      // Top posts by views
      const topPosts = [...publishedPosts]
        .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 10)
        .map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          viewCount: post.viewCount || 0,
          likeCount: post.likeCount || 0,
          commentCount: post.commentCount || post._count?.comments || 0,
          featuredImage: post.featuredImage,
          author: post.author,
          category: post.category,
          createdAt: post.createdAt
        }));

      // Recent posts
      const recentPosts = [...allPosts]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((post: any) => ({
          id: post.id,
          title: post.title,
          status: post.status,
          createdAt: post.createdAt,
          author: post.author
        }));

      // Users by role
      const usersByRole = {
        admin: allUsers.filter((u: any) => u.role === 'ADMIN').length,
        editor: allUsers.filter((u: any) => u.role === 'EDITOR').length,
        author: allUsers.filter((u: any) => u.role === 'AUTHOR').length,
        user: allUsers.filter((u: any) => u.role === 'USER').length
      };

      setReportData({
        totalPosts: allPosts.length,
        totalUsers: allUsers.length,
        totalCategories: allCategories.length,
        totalViews,
        totalLikes,
        totalComments,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        archivedPosts: archivedPosts.length,
        postsByCategory,
        topAuthors,
        topPosts,
        recentPosts,
        usersByRole
      });

      console.log('📊 Report data loaded successfully');

    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchReportData(true);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-500/10 text-emerald-400';
      case 'DRAFT': return 'bg-amber-500/10 text-amber-400';
      case 'ARCHIVED': return 'bg-gray-500/10 text-gray-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#fcd535]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#fcd535] animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#fcd535] animate-pulse" />
          </div>
          <p className="theme-text-tertiary">Generating reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold theme-text-primary">Reports</h1>
            <p className="theme-text-tertiary mt-1">Comprehensive statistics and reports from your database</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-[#fcd535]/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-400">{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Report Type Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'posts', label: 'Posts Report', icon: FileText },
          { key: 'users', label: 'Users Report', icon: Users },
          { key: 'engagement', label: 'Engagement', icon: Heart }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setReportType(key as any)}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all ${
              reportType === key
                ? 'bg-[#fcd535] text-[#0b0e11]'
                : 'theme-bg-secondary theme-text-secondary border theme-border-primary hover:border-[#fcd535]/50'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold theme-text-primary">{reportData?.totalPosts || 0}</p>
              <p className="text-xs theme-text-muted">Total Posts</p>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold theme-text-primary">{reportData?.totalUsers || 0}</p>
              <p className="text-xs theme-text-muted">Total Users</p>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <FolderOpen className="w-5 h-5 text-[#fcd535]" />
              </div>
              <p className="text-2xl font-bold theme-text-primary">{reportData?.totalCategories || 0}</p>
              <p className="text-xs theme-text-muted">Categories</p>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(reportData?.totalViews || 0)}</p>
              <p className="text-xs theme-text-muted">Total Views</p>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(reportData?.totalLikes || 0)}</p>
              <p className="text-xs theme-text-muted">Total Likes</p>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(reportData?.totalComments || 0)}</p>
              <p className="text-xs theme-text-muted">Comments</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Posts by Category */}
            <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
              <div className="px-6 py-4 border-b theme-border-primary">
                <h3 className="text-lg font-semibold theme-text-primary flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-400" />
                  Posts by Category
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {reportData?.postsByCategory?.slice(0, 6).map((cat, index) => {
                  const percentage = reportData.totalPosts > 0 
                    ? Math.round((cat.count / reportData.totalPosts) * 100) 
                    : 0;
                  return (
                    <div key={cat.categoryId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        <span className="text-sm theme-text-primary">{cat.categoryName}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 theme-bg-tertiary rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                          ></div>
                        </div>
                        <span className="text-sm theme-text-muted w-12 text-right">{cat.count}</span>
                      </div>
                    </div>
                  );
                })}
                {(!reportData?.postsByCategory || reportData.postsByCategory.length === 0) && (
                  <p className="text-center theme-text-muted py-4">No category data</p>
                )}
              </div>
            </div>

            {/* User Roles Distribution */}
            <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
              <div className="px-6 py-4 border-b theme-border-primary">
                <h3 className="text-lg font-semibold theme-text-primary flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  Users by Role
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="theme-bg-tertiary rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Star className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-xl font-bold theme-text-primary">{reportData?.usersByRole?.admin || 0}</p>
                    <p className="text-xs theme-text-muted">Admins</p>
                  </div>
                  <div className="theme-bg-tertiary rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-xl font-bold theme-text-primary">{reportData?.usersByRole?.editor || 0}</p>
                    <p className="text-xs theme-text-muted">Editors</p>
                  </div>
                  <div className="theme-bg-tertiary rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold theme-text-primary">{reportData?.usersByRole?.author || 0}</p>
                    <p className="text-xs theme-text-muted">Authors</p>
                  </div>
                  <div className="theme-bg-tertiary rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-gray-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xl font-bold theme-text-primary">{reportData?.usersByRole?.user || 0}</p>
                    <p className="text-xs theme-text-muted">Users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Posts Report */}
      {reportType === 'posts' && (
        <>
          {/* Post Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold theme-text-primary">{reportData?.publishedPosts || 0}</p>
                  <p className="text-sm theme-text-muted">Published</p>
                </div>
              </div>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold theme-text-primary">{reportData?.draftPosts || 0}</p>
                  <p className="text-sm theme-text-muted">Drafts</p>
                </div>
              </div>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold theme-text-primary">{reportData?.archivedPosts || 0}</p>
                  <p className="text-sm theme-text-muted">Archived</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Posts Table */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary">
              <h3 className="text-lg font-semibold theme-text-primary">Top Performing Posts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b theme-border-primary">
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase tracking-wider">Likes</th>
                    <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border-primary">
                  {reportData?.topPosts?.map((post, index) => (
                    <tr 
                      key={post.id} 
                      className="hover:theme-bg-tertiary cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/posts/${post.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          index < 3 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-tertiary theme-text-muted'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium theme-text-primary truncate max-w-xs">{post.title}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-secondary">
                        {post.author?.firstName} {post.author?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-secondary">
                        {post.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-primary text-right font-medium">
                        {formatNumber(post.viewCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-primary text-right">
                        {formatNumber(post.likeCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-primary text-right">
                        {formatNumber(post.commentCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!reportData?.topPosts || reportData.topPosts.length === 0) && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                  <p className="theme-text-muted">No posts found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Users Report */}
      {reportType === 'users' && (
        <>
          {/* Top Authors */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden mb-6">
            <div className="px-6 py-4 border-b theme-border-primary">
              <h3 className="text-lg font-semibold theme-text-primary">Top Authors by Posts</h3>
            </div>
            <div className="p-6 space-y-4">
              {reportData?.topAuthors?.map((author, index) => (
                <div key={author.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-tertiary theme-text-muted'
                    }`}>
                      {index + 1}
                    </span>
                    {author.avatar ? (
                      <img 
                        src={author.avatar.startsWith('http') ? author.avatar : `${getServerBaseUrl()}${author.avatar}`}
                        alt={author.firstName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fcd535] to-[#f0b90b] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#0b0e11]">
                          {author.firstName?.[0] || author.username?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium theme-text-primary">
                        {author.firstName} {author.lastName}
                      </p>
                      <p className="text-xs theme-text-muted">@{author.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium theme-text-primary">{author.postCount} posts</p>
                    <p className="text-xs theme-text-muted">{formatNumber(author.totalViews)} views</p>
                  </div>
                </div>
              ))}
              {(!reportData?.topAuthors || reportData.topAuthors.length === 0) && (
                <p className="text-center theme-text-muted py-4">No author data</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary">
              <h3 className="text-lg font-semibold theme-text-primary">Recent Posts Activity</h3>
            </div>
            <div className="divide-y theme-border-primary">
              {reportData?.recentPosts?.map((post) => (
                <div 
                  key={post.id} 
                  className="px-6 py-4 flex items-center justify-between hover:theme-bg-tertiary cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/posts/${post.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 theme-text-muted" />
                    <div>
                      <p className="text-sm font-medium theme-text-primary">{post.title}</p>
                      <p className="text-xs theme-text-muted">
                        by {post.author?.firstName} {post.author?.lastName} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>
              ))}
              {(!reportData?.recentPosts || reportData.recentPosts.length === 0) && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                  <p className="theme-text-muted">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Engagement Report */}
      {reportType === 'engagement' && (
        <>
          {/* Engagement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold theme-text-primary">{formatNumber(reportData?.totalViews || 0)}</p>
                  <p className="text-sm theme-text-muted">Total Views</p>
                </div>
              </div>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-pink-500/10 rounded-xl">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold theme-text-primary">{formatNumber(reportData?.totalLikes || 0)}</p>
                  <p className="text-sm theme-text-muted">Total Likes</p>
                </div>
              </div>
            </div>
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold theme-text-primary">{formatNumber(reportData?.totalComments || 0)}</p>
                  <p className="text-sm theme-text-muted">Total Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-6">
              <h3 className="text-lg font-semibold theme-text-primary mb-4">Average Engagement per Post</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm theme-text-secondary">Avg. Views per Post</span>
                  <span className="text-lg font-bold theme-text-primary">
                    {reportData?.totalPosts ? Math.round(reportData.totalViews / reportData.totalPosts) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm theme-text-secondary">Avg. Likes per Post</span>
                  <span className="text-lg font-bold theme-text-primary">
                    {reportData?.totalPosts ? (reportData.totalLikes / reportData.totalPosts).toFixed(1) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm theme-text-secondary">Avg. Comments per Post</span>
                  <span className="text-lg font-bold theme-text-primary">
                    {reportData?.totalPosts ? (reportData.totalComments / reportData.totalPosts).toFixed(1) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t theme-border-primary">
                  <span className="text-sm theme-text-secondary">Total Engagement</span>
                  <span className="text-lg font-bold text-[#fcd535]">
                    {formatNumber((reportData?.totalViews || 0) + (reportData?.totalLikes || 0) + (reportData?.totalComments || 0))}
                  </span>
                </div>
              </div>
            </div>

            <div className="theme-bg-secondary rounded-xl border theme-border-primary p-6">
              <h3 className="text-lg font-semibold theme-text-primary mb-4">Engagement Ratio</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm theme-text-secondary">Like Rate</span>
                    <span className="text-sm font-medium theme-text-primary">
                      {reportData?.totalViews ? ((reportData.totalLikes / reportData.totalViews) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                  <div className="w-full theme-bg-tertiary rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ 
                        width: `${reportData?.totalViews ? Math.min((reportData.totalLikes / reportData.totalViews) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm theme-text-secondary">Comment Rate</span>
                    <span className="text-sm font-medium theme-text-primary">
                      {reportData?.totalViews ? ((reportData.totalComments / reportData.totalViews) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                  <div className="w-full theme-bg-tertiary rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ 
                        width: `${reportData?.totalViews ? Math.min((reportData.totalComments / reportData.totalViews) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

