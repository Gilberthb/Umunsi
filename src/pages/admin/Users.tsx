import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  Mail,
  Phone, 
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Crown,
  UserCheck,
  UserX,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Plus,
  Key,
  Lock,
  Unlock
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
  isActive: boolean;
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  permissions: string[];
  articleCount: number;
  commentCount: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    console.log('🎯 Users component mounted!');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔍 Component path:', '/admin/users');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch real users from backend
      const response = await apiClient.getUsers();
      if (response && response.users) {
        // Transform the API response to match our interface
        const transformedUsers = response.users.map((user: any) => ({
          ...user,
          articleCount: user._count?.news || 0,
          commentCount: user._count?.posts || 0,
          permissions: getPermissionsForRole(user.role)
        }));
        setUsers(transformedUsers);
      } else {
        console.warn('No users data received from API');
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const getPermissionsForRole = (role: string): string[] => {
    switch (role) {
      case 'ADMIN':
        return ['all'];
      case 'EDITOR':
        return ['create', 'edit', 'publish', 'moderate'];
      case 'AUTHOR':
        return ['create', 'edit'];
      case 'USER':
        return ['read', 'comment'];
      default:
        return ['read'];
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleToggleUserStatus = (id: string, currentStatus: boolean) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !currentStatus } : user
    ));
  };

  const handleToggleVerification = (id: string, currentStatus: boolean) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isVerified: !currentStatus } : user
    ));
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    switch (action) {
      case 'activate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, isActive: true } : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, isActive: false } : user
        ));
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        }
        break;
    }
    setSelectedUsers([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'ADMIN': 'bg-red-100 text-red-700 border-red-200',
      'EDITOR': 'bg-blue-100 text-blue-700 border-blue-200',
      'AUTHOR': 'bg-green-100 text-green-700 border-green-200',
      'USER': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[role as keyof typeof colors] || colors.USER;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4" />;
      case 'EDITOR':
        return <Edit className="w-4 h-4" />;
      case 'AUTHOR':
        return <UserCheck className="w-4 h-4" />;
      case 'USER':
        return <UsersIcon className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return <Ban className="w-4 h-4 text-red-500" />;
    if (!isVerified) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'Inactive';
    if (!isVerified) return 'Unverified';
    return 'Active';
  };

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'bg-red-100 text-red-700 border-red-200';
    if (!isVerified) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Users Management
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Manage user accounts, roles, permissions, and access control for your Umunsi platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                <UserPlus className="w-5 h-5" />
                <span className="font-semibold">Add User</span>
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <UsersIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
          <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.isVerified).length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
        </div>
      </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Crown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
          <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
              </div>
          </div>

            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="AUTHOR">Author</option>
            <option value="USER">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
                <option value="unverified">Unverified</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="role">Role</option>
          </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
          <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
          </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Grid/List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {users.length} Users Found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

          {viewMode === 'list' ? (
            /* List View */
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="group p-6 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="mt-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.firstName} className="w-12 h-12 rounded-full" />
                        ) : (
                          <span>{user.firstName[0]}{user.lastName[0]}</span>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className={`px-3 py-1 text-xs rounded-full border ${getRoleColor(user.role)} flex items-center space-x-1`}>
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(user.isActive, user.isVerified)} flex items-center space-x-1`}>
                            {getStatusIcon(user.isActive, user.isVerified)}
                            <span>{getStatusText(user.isActive, user.isVerified)}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </span>
                          {user.phone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {formatDate(user.createdAt).split(',')[0]}</span>
                          </span>
                        </div>

                        {user.bio && (
                          <p className="text-sm text-gray-600 max-w-md">{user.bio}</p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Articles: {user.articleCount}</span>
                          <span>Comments: {user.commentCount}</span>
                          <span>Last login: {formatDate(user.lastLogin).split(',')[0]}</span>
                      </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit User">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleToggleVerification(user.id, user.isVerified)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isVerified 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title={user.isVerified ? 'Unverify' : 'Verify'}
                      >
                        {user.isVerified ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* User Header */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(user.role)} flex items-center space-x-1`}>
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(user.isActive, user.isVerified)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.firstName} className="w-16 h-16 rounded-full" />
                        ) : (
                          <span>{user.firstName[0]}{user.lastName[0]}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm">@{user.username}</p>
                    </div>
                  </div>

                  {/* User Content */}
                  <div className="p-4 space-y-3">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                      {user.bio && (
                        <p className="text-gray-600 text-xs line-clamp-2">{user.bio}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        Articles: {user.articleCount}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        Comments: {user.commentCount}
                      </span>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                      <span>Joined {formatDate(user.createdAt).split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to {users.length} of {users.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;