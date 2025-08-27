import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  FileText, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  totalViews: number;
  uniqueVisitors: number;
  newUsers: number;
  returningUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  topCategories: Array<{
    name: string;
    views: number;
    color: string;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
  articleGrowth: Array<{
    date: string;
    articles: number;
  }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        period: '30d',
        totalViews: 45678,
        uniqueVisitors: 12345,
        newUsers: 2345,
        returningUsers: 10000,
        averageSessionDuration: 245, // seconds
        bounceRate: 35.2,
        topArticles: [
          { id: '1', title: 'Umunsi wa Kinyarwanda 2024', views: 1250 },
          { id: '2', title: 'Imyemeramikire yo mu Rwanda', views: 856 },
          { id: '3', title: 'Umuziki wa Kinyarwanda 2024', views: 654 },
          { id: '4', title: 'Technology Trends in Rwanda', views: 543 },
          { id: '5', title: 'Sports News Update', views: 432 }
        ],
        topCategories: [
          { name: 'Siporo', views: 4500, color: '#EF4444' },
          { name: 'Iyobokamana', views: 3800, color: '#3B82F6' },
          { name: 'Umuziki', views: 3200, color: '#EC4899' },
          { name: 'Politiki', views: 2800, color: '#DC2626' },
          { name: 'Ubuzima', views: 2200, color: '#10B981' }
        ],
        userGrowth: [
          { date: '2024-01-01', users: 1000 },
          { date: '2024-01-08', users: 1200 },
          { date: '2024-01-15', users: 1350 },
          { date: '2024-01-22', users: 1500 },
          { date: '2024-01-29', users: 1650 }
        ],
        articleGrowth: [
          { date: '2024-01-01', articles: 50 },
          { date: '2024-01-08', articles: 65 },
          { date: '2024-01-15', articles: 78 },
          { date: '2024-01-22', articles: 85 },
          { date: '2024-01-29', articles: 92 }
        ]
      };

      setAnalyticsData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Monitor website performance and user behavior</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.totalViews || 0)}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.uniqueVisitors || 0)}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.3%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(analyticsData?.averageSessionDuration || 0)}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.2%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(analyticsData?.bounceRate || 0).toFixed(1)}%</p>
              <p className="text-sm text-red-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -2.1%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Articles */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Articles</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData?.topArticles.map((article, index) => (
                <div key={article.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500">{formatNumber(article.views)} views</p>
                    </div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(article.views / analyticsData.topArticles[0].views) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Popular Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData?.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{formatNumber(category.views)} views</p>
                    </div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(category.views / analyticsData.topCategories[0].views) * 100}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analyticsData?.userGrowth.map((data, index) => (
                <div key={data.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(data.date).toLocaleDateString('rw-RW', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">{formatNumber(data.users)}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(data.users / analyticsData.userGrowth[analyticsData.userGrowth.length - 1].users) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Article Growth */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Article Growth</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analyticsData?.articleGrowth.map((data, index) => (
                <div key={data.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(data.date).toLocaleDateString('rw-RW', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">{data.articles}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(data.articles / analyticsData.articleGrowth[analyticsData.articleGrowth.length - 1].articles) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
