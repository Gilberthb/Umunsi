import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Activity,
  UserPlus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { apiClient } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
  totalComments: number;
  userGrowthPercentage: number;
  articleGrowthPercentage: number;
}

interface RecentArticle {
  id: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author: {
    username: string;
    firstName: string;
    lastName: string;
  };
  category: {
    name: string;
    color: string;
  };
}

interface RecentUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface TopArticle {
  id: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author: {
    username: string;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, articlesData, usersData, topArticlesData] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getArticles({ limit: 5, status: 'PUBLISHED' }),
        apiClient.getUsers({ limit: 5 }),
        apiClient.getArticles({ limit: 5, status: 'PUBLISHED' })
      ]);

      const mockData = {
        overview: statsData,
        recentArticles: articlesData.data.map(article => ({
          id: article.id,
          title: article.title,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          commentCount: article.commentCount,
          author: { 
            username: article.author.username, 
            firstName: article.author.firstName, 
            lastName: article.author.lastName 
          },
          category: { 
            name: article.category.name, 
            color: article.category.color 
          }
        })),
        recentUsers: usersData.data.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        })),
        topArticles: topArticlesData.data.map(article => ({
          id: article.id,
          title: article.title,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          commentCount: article.commentCount,
          author: { username: article.author.username }
        }))
      };

      setStats(mockData.overview);
      setRecentArticles(mockData.recentArticles);
      setRecentUsers(mockData.recentUsers);
      setTopArticles(mockData.topArticles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('rw-RW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'EDITOR': return 'bg-blue-100 text-blue-800';
      case 'AUTHOR': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Welcome back! Here's what's happening with your site.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile Scrollable */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'content', name: 'Content', icon: FileText },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-md font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalUsers?.toLocaleString() || 0}</p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +{stats?.userGrowthPercentage || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalArticles || 0}</p>
                  <p className="text-xs sm:text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +{stats?.articleGrowthPercentage || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalCategories || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Comments</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalComments || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Recent Articles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Articles</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View all
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {recentArticles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-start space-x-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: article.category.color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>{article.author.firstName} {article.author.lastName}</span>
                          <span>•</span>
                          <span>{article.viewCount} views</span>
                          <span>•</span>
                          <span>{formatDate(article.createdAt || new Date().toISOString())}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View all
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {recentUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {user.firstName?.[0] || user.username[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Articles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Articles</h3>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View all
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topArticles.slice(0, 5).map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{article.author.username}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{article.viewCount.toLocaleString()}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{article.likeCount}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{article.commentCount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab !== 'overview' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
