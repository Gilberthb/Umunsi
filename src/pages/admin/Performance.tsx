import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Users,
  Clock,
  BarChart3,
  Activity,
  Award,
  Target,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Star
} from 'lucide-react';
import { apiClient } from '../../services/api';

const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://fggg.space/api';
  return apiUrl.replace('/api', '');
};

interface PerformanceData {
  // Overview metrics
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
  publishedPosts: number;
  
  // Performance indicators
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  engagementRate: number;
  
  // Top performers
  topViewedPosts: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    featuredImage?: string;
    author?: { firstName: string; lastName: string };
    category?: { name: string };
    createdAt: string;
  }>;
  
  topLikedPosts: Array<{
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
  }>;
  
  topCommentedPosts: Array<{
    id: string;
    title: string;
    viewCount: number;
    commentCount: number;
  }>;
  
  // Category performance
  categoryPerformance: Array<{
    id: string;
    name: string;
    color?: string;
    postCount: number;
    totalViews: number;
    totalLikes: number;
    avgViews: number;
  }>;
  
  // Author performance
  authorPerformance: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    postCount: number;
    totalViews: number;
    totalLikes: number;
    avgViews: number;
  }>;
  
  // Recent high performers (posts in last 7 days with high engagement)
  recentHighPerformers: Array<{
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
  }>;
}

const Performance = () => {
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'categories' | 'authors'>('overview');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('⚡ Fetching performance data...');

      const [postsResponse, categoriesResponse, usersResponse] = await Promise.all([
        apiClient.getPosts({ limit: 100, status: 'PUBLISHED' }).catch(() => ({ data: [] })),
        apiClient.getCategories({ includeInactive: true }).catch(() => []),
        apiClient.getUsers({ limit: 100 }).catch(() => ({ data: [] }))
      ]);

      const allPosts = postsResponse?.data || [];
      const allCategories = categoriesResponse || [];
      const allUsers = usersResponse?.data || [];

      // Calculate totals
      const totalViews = allPosts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
      const totalLikes = allPosts.reduce((sum: number, p: any) => sum + (p.likeCount || 0), 0);
      const totalComments = allPosts.reduce((sum: number, p: any) => sum + (p.commentCount || p._count?.comments || 0), 0);

      // Averages
      const avgViewsPerPost = allPosts.length > 0 ? Math.round(totalViews / allPosts.length) : 0;
      const avgLikesPerPost = allPosts.length > 0 ? totalLikes / allPosts.length : 0;
      const avgCommentsPerPost = allPosts.length > 0 ? totalComments / allPosts.length : 0;
      const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

      // Top viewed posts
      const topViewedPosts = [...allPosts]
        .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 10)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          viewCount: p.viewCount || 0,
          likeCount: p.likeCount || 0,
          commentCount: p.commentCount || p._count?.comments || 0,
          featuredImage: p.featuredImage,
          author: p.author,
          category: p.category,
          createdAt: p.createdAt
        }));

      // Top liked posts
      const topLikedPosts = [...allPosts]
        .sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          viewCount: p.viewCount || 0,
          likeCount: p.likeCount || 0
        }));

      // Top commented posts
      const topCommentedPosts = [...allPosts]
        .sort((a: any, b: any) => (b.commentCount || b._count?.comments || 0) - (a.commentCount || a._count?.comments || 0))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          viewCount: p.viewCount || 0,
          commentCount: p.commentCount || p._count?.comments || 0
        }));

      // Category performance
      const categoryColors = ['#fcd535', '#3b82f6', '#a855f7', '#ef4444', '#10b981', '#f97316', '#06b6d4', '#ec4899'];
      const categoryPerformance = allCategories.map((cat: any, index: number) => {
        const categoryPosts = allPosts.filter((p: any) => p.category?.id === cat.id);
        const catViews = categoryPosts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
        const catLikes = categoryPosts.reduce((sum: number, p: any) => sum + (p.likeCount || 0), 0);
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color || categoryColors[index % categoryColors.length],
          postCount: categoryPosts.length,
          totalViews: catViews,
          totalLikes: catLikes,
          avgViews: categoryPosts.length > 0 ? Math.round(catViews / categoryPosts.length) : 0
        };
      }).sort((a: any, b: any) => b.totalViews - a.totalViews);

      // Author performance
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
              totalViews: 0,
              totalLikes: 0
            });
          }
          const author = authorMap.get(authorId);
          author.postCount++;
          author.totalViews += post.viewCount || 0;
          author.totalLikes += post.likeCount || 0;
        }
      });
      const authorPerformance = Array.from(authorMap.values())
        .map((a: any) => ({
          ...a,
          avgViews: a.postCount > 0 ? Math.round(a.totalViews / a.postCount) : 0
        }))
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 10);

      // Recent high performers (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentHighPerformers = allPosts
        .filter((p: any) => new Date(p.createdAt) >= sevenDaysAgo)
        .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          viewCount: p.viewCount || 0,
          likeCount: p.likeCount || 0,
          commentCount: p.commentCount || p._count?.comments || 0,
          createdAt: p.createdAt
        }));

      setPerformanceData({
        totalViews,
        totalLikes,
        totalComments,
        totalPosts: allPosts.length,
        publishedPosts: allPosts.length,
        avgViewsPerPost,
        avgLikesPerPost,
        avgCommentsPerPost,
        engagementRate,
        topViewedPosts,
        topLikedPosts,
        topCommentedPosts,
        categoryPerformance,
        authorPerformance,
        recentHighPerformers
      });

      console.log('⚡ Performance data loaded');

    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Failed to load performance data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPerformanceData(true);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#fcd535]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#fcd535] animate-spin"></div>
            <Zap className="absolute inset-0 m-auto w-6 h-6 text-[#fcd535] animate-pulse" />
          </div>
          <p className="theme-text-tertiary">Loading performance data...</p>
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
            <h1 className="text-2xl font-bold theme-text-primary flex items-center">
              <Zap className="w-7 h-7 mr-2 text-[#fcd535]" />
              Performance
            </h1>
            <p className="theme-text-tertiary mt-1">Track content performance and engagement metrics</p>
          </div>
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

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
          <span className="text-red-400">{error}</span>
          <button onClick={handleRefresh} className="text-red-400 hover:text-red-300 text-sm font-medium">
            Try Again
          </button>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center text-emerald-400 text-xs font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Views
            </div>
          </div>
          <p className="text-2xl font-bold theme-text-primary">{formatNumber(performanceData?.totalViews || 0)}</p>
          <p className="text-xs theme-text-muted mt-1">Total Views</p>
        </div>

        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex items-center text-emerald-400 text-xs font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Likes
            </div>
          </div>
          <p className="text-2xl font-bold theme-text-primary">{formatNumber(performanceData?.totalLikes || 0)}</p>
          <p className="text-xs theme-text-muted mt-1">Total Likes</p>
        </div>

        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold theme-text-primary">{formatNumber(performanceData?.totalComments || 0)}</p>
          <p className="text-xs theme-text-muted mt-1">Total Comments</p>
        </div>

        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-[#fcd535]/10 rounded-lg">
              <Target className="w-5 h-5 text-[#fcd535]" />
            </div>
          </div>
          <p className="text-2xl font-bold theme-text-primary">{performanceData?.engagementRate.toFixed(2) || 0}%</p>
          <p className="text-xs theme-text-muted mt-1">Engagement Rate</p>
        </div>
      </div>

      {/* Average Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold theme-text-primary">{performanceData?.avgViewsPerPost || 0}</p>
              <p className="text-sm theme-text-muted">Avg. Views per Post</p>
            </div>
          </div>
        </div>

        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pink-500/10 rounded-xl">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold theme-text-primary">{performanceData?.avgLikesPerPost.toFixed(1) || 0}</p>
              <p className="text-sm theme-text-muted">Avg. Likes per Post</p>
            </div>
          </div>
        </div>

        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold theme-text-primary">{performanceData?.avgCommentsPerPost.toFixed(1) || 0}</p>
              <p className="text-sm theme-text-muted">Avg. Comments per Post</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: 'overview', label: 'Top Posts', icon: Award },
          { key: 'categories', label: 'Categories', icon: BarChart3 },
          { key: 'authors', label: 'Authors', icon: Users }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === key
                ? 'bg-[#fcd535] text-[#0b0e11]'
                : 'theme-bg-secondary theme-text-secondary border theme-border-primary hover:border-[#fcd535]/50'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview - Top Posts */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Viewed Posts */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-400" />
              <h3 className="text-lg font-semibold theme-text-primary">Most Viewed Posts</h3>
            </div>
            <div className="p-4 space-y-3">
              {performanceData?.topViewedPosts?.slice(0, 5).map((post, index) => (
                <div 
                  key={post.id}
                  onClick={() => navigate(`/admin/posts/${post.id}`)}
                  className="flex items-center space-x-3 p-3 theme-bg-tertiary rounded-xl cursor-pointer hover:theme-bg-card-hover transition-colors group"
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    index < 3 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-secondary theme-text-muted'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium theme-text-primary truncate group-hover:text-[#fcd535] transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs theme-text-muted">{post.category?.name || 'Uncategorized'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold theme-text-primary">{formatNumber(post.viewCount)}</p>
                    <p className="text-xs theme-text-muted">views</p>
                  </div>
                </div>
              ))}
              {(!performanceData?.topViewedPosts || performanceData.topViewedPosts.length === 0) && (
                <p className="text-center theme-text-muted py-4">No posts found</p>
              )}
            </div>
          </div>

          {/* Top Liked Posts */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-400" />
              <h3 className="text-lg font-semibold theme-text-primary">Most Liked Posts</h3>
            </div>
            <div className="p-4 space-y-3">
              {performanceData?.topLikedPosts?.map((post, index) => (
                <div 
                  key={post.id}
                  onClick={() => navigate(`/admin/posts/${post.id}`)}
                  className="flex items-center space-x-3 p-3 theme-bg-tertiary rounded-xl cursor-pointer hover:theme-bg-card-hover transition-colors group"
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    index < 3 ? 'bg-pink-500 text-white' : 'theme-bg-secondary theme-text-muted'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium theme-text-primary truncate group-hover:text-[#fcd535] transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs theme-text-muted">{formatNumber(post.viewCount)} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-pink-400">{formatNumber(post.likeCount)}</p>
                    <p className="text-xs theme-text-muted">likes</p>
                  </div>
                </div>
              ))}
              {(!performanceData?.topLikedPosts || performanceData.topLikedPosts.length === 0) && (
                <p className="text-center theme-text-muted py-4">No liked posts found</p>
              )}
            </div>
          </div>

          {/* Recent High Performers */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#fcd535]" />
              <h3 className="text-lg font-semibold theme-text-primary">Recent High Performers (Last 7 Days)</h3>
            </div>
            <div className="p-4">
              {performanceData?.recentHighPerformers && performanceData.recentHighPerformers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {performanceData.recentHighPerformers.map((post, index) => (
                    <div 
                      key={post.id}
                      onClick={() => navigate(`/admin/posts/${post.id}`)}
                      className="theme-bg-tertiary rounded-xl p-4 cursor-pointer hover:theme-bg-card-hover transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          index === 0 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-secondary theme-text-muted'
                        }`}>
                          #{index + 1}
                        </span>
                        <span className="text-xs theme-text-muted">{formatDate(post.createdAt)}</span>
                      </div>
                      <p className="text-sm font-medium theme-text-primary line-clamp-2 group-hover:text-[#fcd535] transition-colors mb-2">
                        {post.title}
                      </p>
                      <div className="flex items-center space-x-3 text-xs theme-text-muted">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatNumber(post.viewCount)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {formatNumber(post.likeCount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center theme-text-muted py-8">No recent high-performing posts</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categories Performance */}
      {activeTab === 'categories' && (
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary">
            <h3 className="text-lg font-semibold theme-text-primary">Category Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b theme-border-primary">
                  <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase">Posts</th>
                  <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase">Total Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase">Total Likes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium theme-text-muted uppercase">Avg. Views</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border-primary">
                {performanceData?.categoryPerformance?.map((cat, index) => (
                  <tr key={cat.id} className="hover:theme-bg-tertiary transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-tertiary theme-text-muted'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm font-medium theme-text-primary">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-secondary text-right">
                      {cat.postCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium theme-text-primary text-right">
                      {formatNumber(cat.totalViews)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-secondary text-right">
                      {formatNumber(cat.totalLikes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-secondary text-right">
                      {formatNumber(cat.avgViews)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!performanceData?.categoryPerformance || performanceData.categoryPerformance.length === 0) && (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">No category data</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Authors Performance */}
      {activeTab === 'authors' && (
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary">
            <h3 className="text-lg font-semibold theme-text-primary">Author Performance</h3>
          </div>
          <div className="p-4 space-y-3">
            {performanceData?.authorPerformance?.map((author, index) => (
              <div 
                key={author.id}
                className="flex items-center space-x-4 p-4 theme-bg-tertiary rounded-xl"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  index < 3 ? 'bg-[#fcd535] text-[#0b0e11]' : 'theme-bg-secondary theme-text-muted'
                }`}>
                  {index + 1}
                </span>
                
                {author.avatar ? (
                  <img 
                    src={author.avatar.startsWith('http') ? author.avatar : `${getServerBaseUrl()}${author.avatar}`}
                    alt={author.firstName}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fcd535] to-[#f0b90b] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[#0b0e11]">
                      {author.firstName?.[0] || author.username?.[0] || 'U'}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium theme-text-primary">
                    {author.firstName} {author.lastName}
                  </p>
                  <p className="text-sm theme-text-muted">@{author.username}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-lg font-bold theme-text-primary">{author.postCount}</p>
                    <p className="text-xs theme-text-muted">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-400">{formatNumber(author.totalViews)}</p>
                    <p className="text-xs theme-text-muted">Views</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-pink-400">{formatNumber(author.totalLikes)}</p>
                    <p className="text-xs theme-text-muted">Likes</p>
                  </div>
                </div>
              </div>
            ))}
            {(!performanceData?.authorPerformance || performanceData.authorPerformance.length === 0) && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">No author data</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;

