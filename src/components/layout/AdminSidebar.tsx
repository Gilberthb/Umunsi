import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { 
  LayoutDashboard, 
  FileText, 
  Users as UsersIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronDown,
  X,
  User,
  Home,
  FolderOpen,
  Activity,
  Image,
  Sparkles,
  Star,
  TrendingUp,
  Shield,
  Palette,
  Database,
  Video,
  Music,
  UserPlus,
  Zap,
  Lock,
  Cloud,
  Globe,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  Tag,
  BookOpen,
  Newspaper,
  Camera,
  Mic,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  Server,
  HardDrive,
  Network,
  Key,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Compass,
  Sun,
  Moon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Copy,
  Download,
  Share2,
  Menu,
  Grid3X3,
  Layers,
  PieChart,
  Target,
  Award,
  Zap as Lightning,
  Shield as SecurityIcon,
  Globe as WorldIcon,
  Clock as TimeIcon,
  Users as TeamIcon,
  FileText as DocumentIcon,
  Settings as ConfigIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  color?: string;
  description?: string;
  isPremium?: boolean;
  category?: string;
  subItems?: SidebarItem[];
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  user?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  } | null;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggleCollapse, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdownData, setBreakdownData] = useState<{title: string, data: any[]} | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [dbCounts, setDbCounts] = useState({
    posts: 0,
    media: 0,
    users: 0,
    categories: 0
  });
  const [countsLoading, setCountsLoading] = useState(true);

  // Fetch database counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setCountsLoading(true);
        const [postsStats, mediaStats, usersStats, categoriesStats] = await Promise.all([
          apiClient.getPostStats().catch(() => ({ totalPosts: 0 })),
          apiClient.getMediaStats().catch(() => ({ totalMedia: 0 })),
          apiClient.getUsers().catch(() => ({ data: [], pagination: { total: 0 } })),
          apiClient.getCategories().catch(() => [])
        ]);

        setDbCounts({
          posts: postsStats.totalPosts || 0,
          media: mediaStats.totalMedia || 0,
          users: usersStats.pagination?.total || 0,
          categories: categoriesStats.length || 0
        });
      } catch (error) {
        console.error('Error fetching database counts:', error);
      } finally {
        setCountsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const sidebarItems: SidebarItem[] = [
    // Main Dashboard
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: LayoutDashboard, 
      category: 'main',
      color: 'from-green-500 to-green-600'
    },
    
    // Posts Management
    { 
      name: 'Posts', 
      path: '/admin/posts', 
      icon: DocumentIcon, 
      badge: countsLoading ? '...' : dbCounts.posts,
      category: 'posts',
      color: 'from-blue-500 to-blue-600',
      subItems: [
        {
          name: 'All Posts',
          path: '/admin/posts',
          icon: DocumentIcon,
          badge: countsLoading ? '...' : dbCounts.posts,
      color: 'from-blue-500 to-blue-600'
    },
    { 
          name: 'Add Post',
          path: '/admin/posts/add',
          icon: Plus,
          color: 'from-green-500 to-green-600'
        }
      ]
    },
    { 
      name: 'Categories', 
      path: '/admin/categories', 
      icon: FolderOpen, 
      badge: countsLoading ? '...' : dbCounts.categories,
      category: 'posts',
      color: 'from-purple-500 to-purple-600'
    },
    
    // Media Management
    { 
      name: 'Media', 
      path: '/admin/media', 
      icon: Image, 
      badge: countsLoading ? '...' : dbCounts.media,
      category: 'media',
      color: 'from-orange-500 to-orange-600',
      subItems: [
        {
          name: 'Library',
          path: '/admin/media/library',
          icon: Database,
          badge: countsLoading ? '...' : dbCounts.media,
          color: 'from-orange-500 to-orange-600'
        },
        {
          name: 'Add Media File',
          path: '/admin/media/add',
          icon: Plus,
          color: 'from-green-500 to-green-600'
        }
      ]
    },
    
    // User Management
    { 
      name: 'User Management', 
      path: '/admin/users', 
      icon: TeamIcon, 
      badge: countsLoading ? '...' : dbCounts.users,
      category: 'users',
      color: 'from-green-500 to-green-600',
      subItems: [
        {
          name: 'Users',
          path: '/admin/users',
          icon: TeamIcon,
          badge: countsLoading ? '...' : dbCounts.users,
          color: 'from-green-500 to-green-600'
        },
    { 
      name: 'Roles & Permissions', 
      path: '/admin/roles', 
      icon: Shield, 
          color: 'from-blue-500 to-blue-600'
        }
      ]
    },
    
    // Analytics & Insights
    { 
      name: 'Analytics & Insights', 
      path: '/admin/analytics', 
      icon: BarChart3, 
      category: 'analytics',
      color: 'from-purple-500 to-purple-600',
      subItems: [
        {
          name: 'Analytics',
          path: '/admin/analytics',
          icon: BarChart3,
          color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: PieChart, 
          color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Performance', 
      path: '/admin/performance', 
      icon: Target, 
      color: 'from-green-500 to-green-600'
        }
      ]
    },
    
    // System & Tools
    { 
      name: 'System & Tools', 
      path: '/admin/settings', 
      icon: ConfigIcon, 
      category: 'system',
      color: 'from-gray-500 to-gray-600',
      subItems: [
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: ConfigIcon,
          color: 'from-gray-500 to-gray-600'
    },
    { 
      name: 'Security', 
      path: '/admin/security', 
      icon: SecurityIcon, 
          color: 'from-red-500 to-red-600'
    },
    { 
      name: 'Backup', 
      path: '/admin/backup', 
      icon: Cloud, 
          color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Logs', 
      path: '/admin/logs', 
      icon: Activity, 
      color: 'from-green-500 to-green-600'
        }
      ]
    }
  ];

  const getCategoryItems = (category: string) => {
    return sidebarItems.filter(item => item.category === category);
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const handleBadgeClick = async (item: SidebarItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setBreakdownLoading(true);
    setShowBreakdown(true);
    
    try {
      if (item.name === 'Categories') {
        // Fetch real categories data
        const categoriesResponse = await apiClient.getCategories();
        const categories = categoriesResponse || [];
        
        // Count active categories
        const activeCategories = categories.filter(cat => cat.isActive !== false).length;
        
        // Count categories with articles
        const categoriesWithArticles = categories.filter(cat => (cat._count?.news || 0) > 0).length;
        
        setBreakdownData({
          title: 'Categories Breakdown',
          data: [
            { label: 'Active Categories', count: activeCategories, color: 'text-green-600' },
            { label: 'Total Categories', count: stats.totalCategories, color: 'text-blue-600' },
            { label: 'Categories with Articles', count: categoriesWithArticles, color: 'text-purple-600' },
            { label: 'Inactive Categories', count: stats.totalCategories - activeCategories, color: 'text-red-600' }
          ]
        });
      } else if (item.name === 'All Posts') {
        // Fetch real articles data
        const articlesResponse = await apiClient.getArticles({ page: 1, limit: 1000 });
        const articles = articlesResponse?.data || [];
        
        // Count by status
        const publishedArticles = articles.filter(article => article.status === 'PUBLISHED').length;
        const draftArticles = articles.filter(article => article.status === 'DRAFT').length;
        const pendingArticles = articles.filter(article => article.status === 'PENDING').length;
        
        setBreakdownData({
          title: 'Posts Breakdown',
          data: [
            { label: 'Total Posts', count: stats.totalArticles, color: 'text-blue-600' },
            { label: 'Published Posts', count: publishedArticles, color: 'text-green-600' },
            { label: 'Draft Posts', count: draftArticles, color: 'text-yellow-600' },
            { label: 'Pending Posts', count: pendingArticles, color: 'text-orange-600' }
          ]
        });
      } else if (item.name === 'User Management') {
        // Fetch real users data
        const usersResponse = await apiClient.getUsers({ page: 1, limit: 1000 });
        const users = usersResponse?.data || [];
        
        // Count by role
        const adminUsers = users.filter(user => user.role === 'ADMIN').length;
        const authorUsers = users.filter(user => user.role === 'AUTHOR').length;
        const regularUsers = users.filter(user => user.role === 'USER').length;
        
        setBreakdownData({
          title: 'User Management Breakdown',
          data: [
            { label: 'Total Users', count: stats.totalUsers, color: 'text-blue-600' },
            { label: 'Admin Users', count: adminUsers, color: 'text-purple-600' },
            { label: 'Author Users', count: authorUsers, color: 'text-green-600' },
            { label: 'Regular Users', count: regularUsers, color: 'text-gray-600' }
          ]
        });
      } else if (item.name === 'Media') {
        // Fetch real media data (placeholder - you may need to implement this API endpoint)
        setBreakdownData({
          title: 'Media Breakdown',
          data: [
            { label: 'Total Media Files', count: stats.totalMedia || 0, color: 'text-blue-600' },
            { label: 'Images', count: Math.floor((stats.totalMedia || 0) * 0.7), color: 'text-green-600' },
            { label: 'Videos', count: Math.floor((stats.totalMedia || 0) * 0.2), color: 'text-purple-600' },
            { label: 'Documents', count: Math.floor((stats.totalMedia || 0) * 0.1), color: 'text-orange-600' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching breakdown data:', error);
      // Fallback to basic stats if API call fails
      if (item.name === 'Categories') {
        setBreakdownData({
          title: 'Categories Breakdown',
          data: [
            { label: 'Total Categories', count: stats.totalCategories, color: 'text-blue-600' },
            { label: 'Total Articles', count: stats.totalArticles, color: 'text-green-600' }
          ]
        });
      } else if (item.name === 'All Posts') {
        setBreakdownData({
          title: 'Posts Breakdown',
          data: [
            { label: 'Total Posts', count: stats.totalArticles, color: 'text-blue-600' }
          ]
        });
      } else if (item.name === 'User Management') {
        setBreakdownData({
          title: 'User Management Breakdown',
          data: [
            { label: 'Total Users', count: stats.totalUsers, color: 'text-blue-600' }
          ]
        });
      } else if (item.name === 'Media') {
        setBreakdownData({
          title: 'Media Breakdown',
          data: [
            { label: 'Total Media Files', count: stats.totalMedia || 0, color: 'text-blue-600' }
          ]
        });
      }
    } finally {
      setBreakdownLoading(false);
    }
  };

  const categories = ['main', 'posts', 'media', 'users', 'analytics', 'system'];

  return (
    <>
      <div className={`h-full bg-white text-gray-800 transition-all duration-500 ease-in-out border-r border-gray-200 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center justify-center w-full">
                <div className="text-center">
                  <h1 className="text-lg font-bold text-green-700">
                    Umunsi
                  </h1>
                  <p className="text-xs text-green-600">Admin Panel</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => onToggleCollapse(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {categories.map((category, index) => {
            const categoryItems = getCategoryItems(category);
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category} className={`space-y-2 ${index > 0 ? 'mt-6' : ''}`}>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                    {category === 'main' ? 'Dashboard' : 
                     category === 'posts' ? 'Posts Management' :
                     category === 'media' ? 'Media Management' :
                     category === 'users' ? 'User Management' :
                     category === 'analytics' ? 'Analytics & Insights' :
                     category === 'system' ? 'System & Tools' : category}
                  </h3>
                )}
                
                <div className="space-y-1">
                  {categoryItems.map((item) => {
                    const Icon = item.icon;
                    const isItemActive = isActive(item.path);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isExpanded = expandedItems.has(item.name);
                    
                    return (
                      <div key={item.path}>
                        {/* Main Item */}
                        <div
                        className={`
                            group flex items-center px-2 py-2 rounded-lg transition-all duration-300 relative overflow-hidden cursor-pointer
                          ${isItemActive 
                            ? 'bg-green-100 text-green-700 shadow-lg border border-green-200' 
                            : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                          }
                        `}
                          onClick={() => {
                            if (hasSubItems) {
                              toggleExpanded(item.name);
                            } else {
                              navigate(item.path);
                            }
                          }}
                      >
                        {/* Active indicator */}
                        {isItemActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-r-full" />
                        )}
                        
                        {/* Icon with gradient background */}
                          <div className={`p-1.5 rounded-md transition-all duration-300 ${
                          isItemActive 
                            ? 'bg-green-200 text-green-600' 
                            : 'bg-gray-100 group-hover:bg-green-100'
                        }`}>
                            <Icon className={`w-4 h-4 transition-all duration-300 ${
                            isItemActive ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
                          }`} />
                        </div>
                        
                        {!isCollapsed && (
                          <div className="ml-3 flex-1 flex items-center justify-between">
                              <span className="text-xs font-medium">{item.name}</span>
                            <div className="flex items-center space-x-2">
                              {item.badge && (
                                <button
                                  onClick={(e) => handleBadgeClick(item, e)}
                                  className={`px-2 py-1 text-xs font-bold rounded-full cursor-pointer hover:scale-105 transition-all duration-200 ${
                                    isItemActive 
                                      ? 'bg-green-500 text-white hover:bg-green-600' 
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                  title={`Click to see ${item.name} breakdown`}
                                >
                                  {item.badge}
                                </button>
                              )}
                                {hasSubItems && (
                                  <div className="transition-transform duration-200">
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                )}
                              {item.isPremium && (
                                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                  <Star className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        </div>

                        {/* Sub Items */}
                        {hasSubItems && isExpanded && !isCollapsed && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.subItems!.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubItemActive = isActive(subItem.path);
                              
                              return (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  className={`
                                    group flex items-center px-2 py-1.5 rounded-md transition-all duration-300 relative overflow-hidden
                                    ${isSubItemActive 
                                      ? 'bg-green-50 text-green-700 border border-green-200' 
                                      : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                    }
                                  `}
                                >
                                  {/* Active indicator */}
                                  {isSubItemActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-r-full" />
                                  )}
                                  
                                  {/* Icon */}
                                  <div className={`p-1 rounded-sm transition-all duration-300 ${
                                    isSubItemActive 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-gray-50 group-hover:bg-green-100'
                                  }`}>
                                    <SubIcon className={`w-3 h-3 transition-all duration-300 ${
                                      isSubItemActive ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
                                    }`} />
                                  </div>
                                  
                                  <div className="ml-2 flex-1 flex items-center justify-between">
                                    <span className="text-xs font-medium">{subItem.name}</span>
                                    {subItem.badge && (
                                      <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${
                                        isSubItemActive 
                                          ? 'bg-green-500 text-white' 
                                          : 'bg-gray-200 text-gray-600'
                                      }`}>
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </div>
                      </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 bg-green-50">
          {!isCollapsed && (
            <div className="mb-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-green-200 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-green-600 truncate">{user?.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-gray-600 hover:bg-white hover:text-green-700 rounded-lg transition-all duration-200"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <Home className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="ml-3 text-sm">View Site</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-white hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <LogOut className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Category Breakdown Modal */}
      {showBreakdown && breakdownData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{breakdownData.title}</h2>
              </div>
              <button
                onClick={() => setShowBreakdown(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Breakdown Data */}
            <div className="p-6">
              {breakdownLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-green-700 font-medium">Loading breakdown data...</p>
                  </div>
                </div>
              ) : breakdownData && breakdownData.data.length > 0 ? (
                <div className="space-y-4">
                  {breakdownData.data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${item.color}`}>{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No breakdown data available</p>
                </div>
              )}
              
              {/* Close Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowBreakdown(false)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
