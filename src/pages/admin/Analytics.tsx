import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  FileText, 
  Heart,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  FolderOpen,
  Calendar,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../../services/api';

const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://fggg.space/api';
  return apiUrl.replace('/api', '');
};

interface AnalyticsData {
  totalViews: number;
  totalUsers: number;
  totalPosts: number;
  totalCategories: number;
  totalComments: number;
  totalLikes: number;
  topArticles: Array<{
    id: string;
    title: string;
    slug?: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    featuredImage?: string;
    author?: {
      firstName: string;
      lastName: string;
    };
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    slug?: string;
    color?: string;
    _count?: {
      news: number;
    };
    postCount?: number;
  }>;
  recentUsers: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
    createdAt: string;
    role: string;
  }>;
  publishedPosts: number;
  draftPosts: number;
}

const Analytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState('30d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('📊 Fetching analytics data...');
      
      // Fetch all data in parallel for better performance
      const [dashboardStats, postsResponse, allPostsResponse, categoriesResponse, usersResponse] = await Promise.all([
        apiClient.getDashboardStats().catch((err) => {
          console.log('Dashboard stats error:', err);
          return null;
        }),
        apiClient.getPosts({ limit: 50, status: 'PUBLISHED' }).catch((err) => {
          console.log('Posts error:', err);
          return { data: [] };
        }),
        apiClient.getPosts({ limit: 100 }).catch((err) => {
          console.log('All posts error:', err);
          return { data: [] };
        }),
        apiClient.getCategories({ includeInactive: true }).catch((err) => {
          console.log('Categories error:', err);
          return [];
        }),
        apiClient.getUsers({ limit: 50 }).catch((err) => {
          console.log('Users error:', err);
          return { data: [] };
        })
      ]);

      console.log('📊 Dashboard stats:', dashboardStats);
      console.log('📊 Posts response:', postsResponse);
      console.log('📊 Categories response:', categoriesResponse);
      console.log('📊 Users response:', usersResponse);

      // Get all posts for statistics
      const allPosts = allPostsResponse?.data || [];
      const publishedPosts = allPosts.filter((p: any) => p.status === 'PUBLISHED');
      const draftPosts = allPosts.filter((p: any) => p.status === 'DRAFT');

      // Calculate total statistics from posts
      let totalViews = dashboardStats?.totalViews || 0;
      let totalLikes = dashboardStats?.totalLikes || 0;
      let totalComments = dashboardStats?.totalComments || 0;

      // Calculate from posts if not available from dashboard stats
      if (totalViews === 0 && allPosts.length > 0) {
        totalViews = allPosts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
      }
      if (totalLikes === 0 && allPosts.length > 0) {
        totalLikes = allPosts.reduce((sum: number, p: any) => sum + (p.likeCount || 0), 0);
      }
      if (totalComments === 0 && allPosts.length > 0) {
        totalComments = allPosts.reduce((sum: number, p: any) => sum + (p.commentCount || p._count?.comments || 0), 0);
      }

      // Sort posts by view count for top articles
      const sortedByViews = [...publishedPosts].sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0));
      
      // Get categories with post counts
      const categoriesWithCounts = (categoriesResponse || []).map((cat: any) => ({
        ...cat,
        postCount: cat._count?.news || cat._count?.posts || allPosts.filter((p: any) => p.category?.id === cat.id).length
      })).sort((a: any, b: any) => (b.postCount || 0) - (a.postCount || 0));

      // Get recent users sorted by creation date
      const recentUsers = [...(usersResponse?.data || [])]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      const analyticsResult: AnalyticsData = {
        totalViews,
        totalUsers: dashboardStats?.totalUsers || (usersResponse as any)?.pagination?.total || usersResponse?.data?.length || 0,
        totalPosts: dashboardStats?.totalArticles || dashboardStats?.totalPosts || (allPostsResponse as any)?.pagination?.total || allPosts.length,
        totalCategories: dashboardStats?.totalCategories || categoriesResponse?.length || 0,
        totalComments,
        totalLikes,
        topArticles: sortedByViews.slice(0, 5).map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          viewCount: post.viewCount || 0,
          likeCount: post.likeCount || 0,
          commentCount: post.commentCount || post._count?.comments || 0,
          featuredImage: post.featuredImage,
          author: post.author
        })),
        topCategories: categoriesWithCounts.slice(0, 5),
        recentUsers: recentUsers.map((user: any) => ({
          id: user.id,
          username: user.username,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
          role: user.role
        })),
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length
      };

      console.log('📊 Final analytics data:', analyticsResult);
      setAnalyticsData(analyticsResult);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getCategoryColor = (index: number) => {
    const colors = ['#fcd535', '#3b82f6', '#a855f7', '#ef4444', '#10b981', '#f97316', '#06b6d4', '#ec4899'];
    return colors[index % colors.length];
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
          <p className="theme-text-tertiary">Loading analytics...</p>
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
            <h1 className="text-2xl font-bold theme-text-primary">Analytics Dashboard</h1>
            <p className="theme-text-tertiary mt-1">Real-time statistics from your database</p>
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
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          onClick={() => navigate('/admin/analytics')}
          className="theme-bg-secondary rounded-xl border theme-border-primary p-5 cursor-pointer hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>Views</span>
            </div>
          </div>
          <p className="text-2xl font-bold theme-text-primary mb-1">{formatNumber(analyticsData?.totalViews || 0)}</p>
          <p className="text-sm theme-text-muted">Total Views</p>
        </div>

        <div 
          onClick={() => navigate('/admin/users')}
          className="theme-bg-secondary rounded-xl border theme-border-primary p-5 cursor-pointer hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <ChevronRight className="w-5 h-5 theme-text-muted group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-2xl font-bold theme-text-primary mb-1">{formatNumber(analyticsData?.totalUsers || 0)}</p>
          <p className="text-sm theme-text-muted">Total Users</p>
        </div>

        <div 
          onClick={() => navigate('/admin/posts')}
          className="theme-bg-secondary rounded-xl border theme-border-primary p-5 cursor-pointer hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <ChevronRight className="w-5 h-5 theme-text-muted group-hover:text-purple-400 transition-colors" />
          </div>
          <p className="text-2xl font-bold theme-text-primary mb-1">{formatNumber(analyticsData?.totalPosts || 0)}</p>
          <p className="text-sm theme-text-muted">Total Posts</p>
        </div>

        <div 
          onClick={() => navigate('/admin/categories')}
          className="theme-bg-secondary rounded-xl border theme-border-primary p-5 cursor-pointer hover:border-[#fcd535]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#fcd535]/10 rounded-xl group-hover:bg-[#fcd535]/20 transition-colors">
              <FolderOpen className="w-6 h-6 text-[#fcd535]" />
            </div>
            <ChevronRight className="w-5 h-5 theme-text-muted group-hover:text-[#fcd535] transition-colors" />
          </div>
          <p className="text-2xl font-bold theme-text-primary mb-1">{analyticsData?.totalCategories || 0}</p>
          <p className="text-sm theme-text-muted">Categories</p>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-500/10 rounded-xl">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(analyticsData?.totalLikes || 0)}</p>
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
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(analyticsData?.totalComments || 0)}</p>
              <p className="text-sm theme-text-muted">Total Comments</p>
            </div>
          </div>
        </div>

        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold theme-text-primary">
                {analyticsData?.totalPosts ? ((analyticsData.totalLikes + analyticsData.totalComments) / analyticsData.totalPosts).toFixed(1) : '0'}
              </p>
              <p className="text-sm theme-text-muted">Avg. Engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Articles */}
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#fcd535]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#fcd535]" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary">Top Performing Articles</h3>
            </div>
            <button 
              onClick={() => navigate('/admin/posts')}
              className="text-[#fcd535] hover:text-[#f0b90b] text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData?.topArticles && analyticsData.topArticles.length > 0 ? (
              analyticsData.topArticles.map((article, index) => (
                <div 
                  key={article.id} 
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => navigate(`/admin/posts/${article.id}`)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      index < 3 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-tertiary theme-text-tertiary'
                    }`}>
                      {index + 1}
                    </span>
                    {article.featuredImage && (
                      <img 
                        src={article.featuredImage.startsWith('http') ? article.featuredImage : `${getServerBaseUrl()}${article.featuredImage}`}
                        alt={article.title}
                        className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium theme-text-primary truncate group-hover:text-[#fcd535] transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center space-x-3 text-xs theme-text-muted mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatNumber(article.viewCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{formatNumber(article.likeCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{formatNumber(article.commentCount)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 theme-bg-tertiary rounded-full h-2 ml-3 flex-shrink-0">
                    <div 
                      className="bg-[#fcd535] h-2 rounded-full transition-all"
                      style={{ 
                        width: `${analyticsData.topArticles[0].viewCount > 0 
                          ? (article.viewCount / analyticsData.topArticles[0].viewCount) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">No articles found</p>
            </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary">Categories by Posts</h3>
            </div>
            <button 
              onClick={() => navigate('/admin/categories')}
              className="text-[#fcd535] hover:text-[#f0b90b] text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData?.topCategories && analyticsData.topCategories.length > 0 ? (
              analyticsData.topCategories.slice(0, 5).map((category, index) => {
                const postCount = category.postCount || category._count?.news || 0;
                const maxPosts = Math.max(...analyticsData.topCategories.map(c => c.postCount || c._count?.news || 0), 1);
                const color = category.color || getCategoryColor(index);
                
                return (
                  <div 
                    key={category.id} 
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => navigate(`/category/${category.slug || category.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                    ></div>
                    <div>
                        <p className="text-sm font-medium theme-text-primary group-hover:text-[#fcd535] transition-colors">
                          {category.name}
                        </p>
                        <p className="text-xs theme-text-muted">{postCount} {postCount === 1 ? 'post' : 'posts'}</p>
                      </div>
                    </div>
                    <div className="w-24 theme-bg-tertiary rounded-full h-2">
                    <div 
                        className="h-2 rounded-full transition-all"
                      style={{ 
                          width: `${(postCount / maxPosts) * 100}%`,
                          backgroundColor: color
                      }}
                    ></div>
                  </div>
                </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">No categories found</p>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Status & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Status */}
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold theme-text-primary">Post Status Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="theme-bg-tertiary rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                <p className="text-2xl font-bold theme-text-primary">{analyticsData?.publishedPosts || 0}</p>
                <p className="text-sm theme-text-muted">Published</p>
                  </div>
              <div className="theme-bg-tertiary rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-2xl font-bold theme-text-primary">{analyticsData?.draftPosts || 0}</p>
                <p className="text-sm theme-text-muted">Drafts</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm theme-text-tertiary">Publishing Rate</span>
                <span className="text-sm font-medium theme-text-primary">
                  {analyticsData?.totalPosts 
                    ? Math.round((analyticsData.publishedPosts / analyticsData.totalPosts) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full theme-bg-tertiary rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all"
                  style={{ 
                    width: `${analyticsData?.totalPosts 
                      ? (analyticsData.publishedPosts / analyticsData.totalPosts) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary">Recent Users</h3>
            </div>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-[#fcd535] hover:text-[#f0b90b] text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="p-4 space-y-2">
            {analyticsData?.recentUsers && analyticsData.recentUsers.length > 0 ? (
              analyticsData.recentUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center space-x-3 p-3 theme-bg-tertiary rounded-xl cursor-pointer hover:theme-bg-card-hover transition-colors group"
                  onClick={() => navigate(`/admin/users`)}
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar.startsWith('http') ? user.avatar : `${getServerBaseUrl()}${user.avatar}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#fcd535] to-[#f0b90b] flex items-center justify-center flex-shrink-0 ${user.avatar ? 'hidden' : ''}`}>
                    <span className="text-sm font-bold text-[#0b0e11]">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                  </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium theme-text-primary truncate group-hover:text-[#fcd535] transition-colors">
                      {user.firstName || user.username} {user.lastName || ''}
                    </p>
                    <div className="flex items-center space-x-2 text-xs theme-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                    user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                    user.role === 'EDITOR' ? 'bg-blue-500/10 text-blue-400' :
                    'theme-bg-secondary theme-text-tertiary'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">No users found</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
