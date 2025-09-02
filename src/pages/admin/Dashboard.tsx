import React from 'react';
import { 
  FileText, 
  Users, 
  FolderOpen, 
  BarChart3, 
  TrendingUp, 
  Eye,
  Calendar,
  Clock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Welcome back, Admin!
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Here's what's happening with your Umunsi platform today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Last updated</p>
            <p className="text-lg font-semibold text-slate-700">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Articles Stats */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Articles</p>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-blue-100 text-sm mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Users Stats */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-2xl shadow-emerald-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold">8,934</p>
              <p className="text-emerald-100 text-sm mt-1">+8% from last month</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Categories Stats */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-2xl shadow-amber-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Categories</p>
              <p className="text-3xl font-bold">24</p>
              <p className="text-amber-100 text-sm mt-1">+2 new this month</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <FolderOpen className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Views Stats */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-2xl shadow-rose-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Page Views</p>
              <p className="text-3xl font-bold">45.2K</p>
              <p className="text-rose-100 text-sm mt-1">+23% from last month</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <Eye className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Articles</h2>
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {[
              { title: "Breaking: New Technology Trends", status: "Published", views: "2.4K", date: "2 hours ago" },
              { title: "Sports Update: Championship Results", status: "Draft", views: "0", date: "4 hours ago" },
              { title: "Entertainment News: Award Show", status: "Published", views: "1.8K", date: "6 hours ago" }
            ].map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm">{article.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.status === 'Published' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {article.status}
                    </span>
                    <span className="text-slate-500 text-xs">{article.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-600 font-semibold">{article.views}</p>
                  <p className="text-slate-400 text-xs">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-blue-700">New Article</p>
              </div>
            </button>

            <button className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-emerald-700">Add User</p>
              </div>
            </button>

            <button className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 hover:from-amber-100 hover:to-amber-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-amber-700">New Category</p>
              </div>
            </button>

            <button className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl border border-rose-200 hover:from-rose-100 hover:to-rose-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-rose-700">View Analytics</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "New article published", user: "John Doe", time: "2 minutes ago", type: "success" },
            { action: "User registration", user: "Jane Smith", time: "15 minutes ago", type: "info" },
            { action: "Category updated", user: "Admin", time: "1 hour ago", type: "warning" },
            { action: "System backup completed", user: "System", time: "2 hours ago", type: "success" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'success' ? 'bg-emerald-500' :
                activity.type === 'warning' ? 'bg-amber-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{activity.action}</p>
                <p className="text-slate-600 text-sm">by {activity.user}</p>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;