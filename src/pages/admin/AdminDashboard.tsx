import React from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Eye,
  Clock,
  Star,
  Settings,
  Plus,
  Calendar,
  Target,
  Zap,
  Award
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Total Users', 
      value: '1,234', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600', 
      bgColor: 'bg-blue-50',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Articles Published', 
      value: '567', 
      icon: FileText, 
      color: 'from-green-500 to-green-600', 
      bgColor: 'bg-green-50',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'Page Views', 
      value: '89.2K', 
      icon: Eye, 
      color: 'from-purple-500 to-purple-600', 
      bgColor: 'bg-purple-50',
      change: '+23%',
      trend: 'up'
    },
    { 
      title: 'Active Sessions', 
      value: '234', 
      icon: Activity, 
      color: 'from-orange-500 to-orange-600', 
      bgColor: 'bg-orange-50',
      change: '+5%',
      trend: 'up'
    },
  ];

  const recentActivities = [
    { action: 'New article published', user: 'John Doe', time: '2 minutes ago', type: 'article', icon: FileText, color: 'text-green-600' },
    { action: 'User registered', user: 'Jane Smith', time: '5 minutes ago', type: 'user', icon: Users, color: 'text-blue-600' },
    { action: 'Category updated', user: 'Admin', time: '10 minutes ago', type: 'category', icon: Settings, color: 'text-purple-600' },
    { action: 'Analytics report generated', user: 'System', time: '15 minutes ago', type: 'analytics', icon: BarChart3, color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'New Article', description: 'Create a new article', icon: Plus, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { title: 'Manage Users', description: 'View and edit users', icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Analytics', description: 'View site analytics', icon: BarChart3, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Settings', description: 'Configure site settings', icon: Settings, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your site today.</p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Target className="w-4 h-4" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold">
              <Zap className="w-4 h-4 inline mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-semibold">{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">from last month</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600 mt-1">Latest updates and actions</p>
            </div>
            <button className="px-4 py-2 text-green-600 hover:text-green-700 text-sm font-semibold hover:bg-green-50 rounded-lg transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  <div className={`p-3 rounded-xl bg-gray-100 group-hover:bg-white transition-colors`}>
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600 mt-1">Common tasks and shortcuts</p>
          </div>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button key={index} className={`w-full p-4 border border-gray-200 rounded-xl hover:border-transparent transition-all duration-200 text-left group ${action.bgColor} hover:shadow-lg transform hover:-translate-y-0.5`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                      <Icon className={`w-5 h-5 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
              <p className="text-gray-600 mt-1">Site performance metrics</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Load Speed</p>
                <p className="text-2xl font-bold text-gray-900">1.2s</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">A+</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">99.9%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">92/100</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">92</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Recent Achievements</h2>
            <p className="text-green-100 mt-1">Celebrating your success</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
              <Star className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="font-semibold">1000+ Users Milestone</p>
                <p className="text-green-100 text-sm">Reached yesterday</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-200" />
              <div>
                <p className="font-semibold">50% Traffic Increase</p>
                <p className="text-green-100 text-sm">This month</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
              <Award className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="font-semibold">Perfect Uptime</p>
                <p className="text-green-100 text-sm">30 days running</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;