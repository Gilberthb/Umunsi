import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Eye, 
  Heart, 
  MessageSquare, 
  Calendar,
  Clock,
  Star,
  Zap,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  Bell,
  Mail,
  Shield,
  Cloud,
  Database,
  Server,
  Wifi,
  HardDrive,
  Network,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  User
} from 'lucide-react';
import { apiClient } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
  totalComments: number;
  totalViews: number;
  totalLikes: number;
}

interface RecentArticle {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  status: string;
  publishedAt: string;
}

interface RecentUser {
  id: string;
  username: string;
  email: string;
  role: string;
  lastActive: string;
  status: string;
}

interface SystemStatus {
  database: string;
  server: string;
  storage: string;
  network: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArticles: 0,
    totalCategories: 0,
    totalComments: 0,
    totalViews: 0,
    totalLikes: 0
  });

  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'healthy',
    server: 'healthy',
    storage: 'warning',
    network: 'healthy'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await apiClient.getDashboardStats();
      if (statsResponse) {
        setStats({
          totalUsers: statsResponse.totalUsers || 0,
          totalArticles: statsResponse.totalArticles || 0,
          totalCategories: statsResponse.totalCategories || 0,
          totalComments: statsResponse.totalComments || 0,
          totalViews: statsResponse.totalViews || 0,
          totalLikes: statsResponse.totalLikes || 0
        });
      }

      // Fetch recent articles
      const articlesResponse = await apiClient.getArticles({ limit: 5, status: 'PUBLISHED' });
      if (articlesResponse?.data) {
        const formattedArticles = articlesResponse.data.map(article => ({
          id: article.id,
          title: article.title,
          author: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim() || 'Unknown Author',
          views: article.viewCount || 0,
          likes: article.likeCount || 0,
          comments: article.commentCount || 0,
          status: article.status?.toLowerCase() || 'draft',
          publishedAt: article.createdAt || new Date().toISOString()
        }));
        setRecentArticles(formattedArticles);
      }

      // Fetch recent users
      const usersResponse = await apiClient.getUsers({ limit: 5 });
      if (usersResponse?.data) {
        const formattedUsers = usersResponse.data.map(user => ({
          id: user.id,
          username: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email || '',
          role: user.role || 'USER',
          lastActive: user.lastLoginAt || user.createdAt || new Date().toISOString(),
          status: user.isActive ? 'active' : 'inactive'
        }));
        setRecentUsers(formattedUsers);
      }

      // Check system status
      try {
        await apiClient.healthCheck();
        setSystemStatus(prev => ({ ...prev, database: 'healthy', server: 'healthy' }));
      } catch (error) {
        setSystemStatus(prev => ({ ...prev, database: 'error', server: 'error' }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data if API fails
      setStats({
        totalUsers: 1247,
        totalArticles: 89,
        totalCategories: 12,
        totalComments: 456,
        totalViews: 23456,
        totalLikes: 1234
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'published': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'draft': 'bg-amber-100 text-amber-800 border-amber-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'active': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'inactive': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getHealthColor = (status: string) => {
    const colors = {
      'healthy': 'bg-green-500',
      'warning': 'bg-yellow-500',
      'error': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || colors.warning;
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-200/50 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side - Logo */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src="/images/logo.png" 
                    alt="Umunsi Logo" 
                    className="w-16 h-16 object-contain drop-shadow-sm"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white"></div>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-green-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles, users, categories..."
                  className="block w-full pl-12 pr-4 py-2.5 border border-green-200/50 rounded-xl leading-5 bg-white/60 backdrop-blur-sm placeholder-green-500 focus:outline-none focus:placeholder-green-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile search button */}
              <button className="md:hidden p-2.5 text-green-600 hover:text-green-700 hover:bg-green-50/80 rounded-xl transition-all duration-200 hover:shadow-md">
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button className="p-2.5 text-green-600 hover:text-green-700 hover:bg-green-50/80 rounded-xl transition-all duration-200 hover:shadow-md relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"></span>
              </button>

              {/* Settings */}
              <button className="p-2.5 text-green-600 hover:text-green-700 hover:bg-green-50/80 rounded-xl transition-all duration-200 hover:shadow-md">
                <Settings size={20} />
              </button>

              {/* User profile */}
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-green-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles, users, categories..."
                className="block w-full pl-12 pr-4 py-3 border border-green-200/50 rounded-xl leading-5 bg-white/60 backdrop-blur-sm placeholder-green-500 focus:outline-none focus:placeholder-green-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalArticles)}</p>
              <p className="text-sm text-gray-600">Articles</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalLikes)}</p>
              <p className="text-sm text-gray-600">Total Likes</p>
                </div>
                </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalComments)}</p>
              <p className="text-sm text-gray-600">Comments</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalCategories)}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Articles */}
          <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/50">
            <div className="p-6 border-b border-green-100/50">
                <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Articles</h2>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                  <span>View all</span>
                  <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            <div className="p-6 space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div key={article.id} className="group p-4 bg-green-50/60 hover:bg-green-100/80 rounded-xl border border-green-200/50 hover:border-green-300/70 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(article.views)} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{formatNumber(article.likes)} likes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{formatNumber(article.comments)} comments</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-green-100/80 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p>No articles found</p>
                </div>
              )}
              </div>
            </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Users */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/50">
              <div className="p-6 border-b border-green-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View all
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <p>No users found</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/50">
              <div className="p-6 border-b border-green-100/50">
                <h3 className="text-lg font-bold text-gray-900">System Status</h3>
              </div>
              <div className="p-6 space-y-4">
                {Object.entries(systemStatus).map(([key, status]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getHealthColor(status)}`} />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getHealthIcon(status)}
                      <span className={`text-xs font-medium ${
                        status === 'healthy' ? 'text-green-600' :
                        status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                    </div>
                  ))}
            </div>
          </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-sm rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-left flex items-center space-x-3">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Create Article</span>
                </button>
                <button className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-left flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Add User</span>
                </button>
                <button className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-left flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-medium">View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100/50">
          <div className="p-6 border-b border-green-100/50">
            <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Growth Rate</h4>
                <p className="text-2xl font-bold text-green-600">+24.5%</p>
                <p className="text-sm text-gray-600">vs last month</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Engagement</h4>
                <p className="text-2xl font-bold text-green-600">89.2%</p>
                <p className="text-sm text-gray-600">user retention</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Quality Score</h4>
                <p className="text-2xl font-bold text-green-600">9.4/10</p>
                <p className="text-sm text-gray-600">content rating</p>
              </div>

          <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Response Time</h4>
                <p className="text-2xl font-bold text-green-600">0.8s</p>
                <p className="text-sm text-gray-600">average load</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
