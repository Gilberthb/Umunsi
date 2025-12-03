import React, { useState, useEffect } from 'react';
import {
  Database, Download, Upload, Clock, HardDrive, Server,
  RefreshCw, CheckCircle, XCircle, AlertTriangle, Play,
  Calendar, FileText, Users, FolderOpen, Image, Trash2,
  Shield, Cloud, Archive, Settings, ChevronRight, Info
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface BackupHistory {
  id: string;
  name: string;
  type: 'full' | 'database' | 'media';
  size: string;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
}

interface SystemStats {
  totalPosts: number;
  totalUsers: number;
  totalCategories: number;
  totalMedia: number;
  totalViews: number;
  databaseSize: string;
}

const Backup: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupType, setBackupType] = useState<'full' | 'database' | 'media'>('full');
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState(30);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupHistory | null>(null);

  // Mock backup history - in production this would come from API
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([
    {
      id: '1',
      name: 'backup_2024_12_03_full.zip',
      type: 'full',
      size: '256 MB',
      createdAt: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: '2',
      name: 'backup_2024_12_02_db.sql',
      type: 'database',
      size: '45 MB',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: '3',
      name: 'backup_2024_12_01_media.zip',
      type: 'media',
      size: '180 MB',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed'
    },
    {
      id: '4',
      name: 'backup_2024_11_30_full.zip',
      type: 'full',
      size: '248 MB',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      status: 'failed'
    }
  ]);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);

      const [postsResponse, usersResponse, categoriesResponse, mediaResponse] = await Promise.all([
        apiClient.getPosts({ limit: 100 }).catch(() => ({ data: [], pagination: { total: 0 } })),
        apiClient.getUsers({ limit: 100 }).catch(() => ({ data: [] })),
        apiClient.getCategories().catch(() => []),
        apiClient.getMediaFiles().catch(() => [])
      ]);

      const allPosts = postsResponse?.data || [];
      const totalViews = allPosts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);

      // Estimate database size based on content
      const estimatedDbSize = (
        allPosts.length * 5 + // ~5KB per post
        ((usersResponse as any)?.data?.length || 0) * 2 + // ~2KB per user
        (categoriesResponse || []).length * 1 // ~1KB per category
      );

      setSystemStats({
        totalPosts: (postsResponse as any)?.pagination?.total || allPosts.length,
        totalUsers: (usersResponse as any)?.pagination?.total || (usersResponse?.data || []).length,
        totalCategories: (categoriesResponse || []).length,
        totalMedia: (mediaResponse || []).length,
        totalViews,
        databaseSize: estimatedDbSize > 1000 ? `${(estimatedDbSize / 1000).toFixed(1)} MB` : `${estimatedDbSize} KB`
      });

    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setBackupInProgress(true);
    
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newBackup: BackupHistory = {
      id: Date.now().toString(),
      name: `backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}_${backupType}.${backupType === 'database' ? 'sql' : 'zip'}`,
      type: backupType,
      size: backupType === 'full' ? '256 MB' : backupType === 'database' ? '45 MB' : '180 MB',
      createdAt: new Date().toISOString(),
      status: 'completed'
    };

    setBackupHistory(prev => [newBackup, ...prev]);
    setBackupInProgress(false);
  };

  const handleDeleteBackup = (id: string) => {
    setBackupHistory(prev => prev.filter(b => b.id !== id));
  };

  const handleRestore = (backup: BackupHistory) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    // Simulate restore
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowRestoreModal(false);
    setSelectedBackup(null);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <Archive className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-blue-400" />;
      case 'media':
        return <Image className="w-5 h-5 text-pink-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#fcd535]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#fcd535] animate-spin"></div>
            <Database className="absolute inset-0 m-auto w-6 h-6 text-[#fcd535] animate-pulse" />
          </div>
          <p className="theme-text-tertiary">Loading backup system...</p>
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
              <Database className="w-7 h-7 mr-2 text-[#fcd535]" />
              Backup & Restore
            </h1>
            <p className="theme-text-tertiary mt-1">Manage your data backups and restore points</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSystemStats}
              className="flex items-center px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-[#fcd535]/50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleCreateBackup}
              disabled={backupInProgress}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] font-semibold rounded-xl hover:from-[#f0b90b] hover:to-[#d4a00a] transition-all disabled:opacity-50"
            >
              {backupInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Create Backup
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-primary">{formatNumber(systemStats?.totalPosts || 0)}</p>
              <p className="text-xs theme-text-muted">Posts</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-primary">{formatNumber(systemStats?.totalUsers || 0)}</p>
              <p className="text-xs theme-text-muted">Users</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#fcd535]/10 rounded-lg">
              <FolderOpen className="w-5 h-5 text-[#fcd535]" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-primary">{systemStats?.totalCategories || 0}</p>
              <p className="text-xs theme-text-muted">Categories</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Image className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-primary">{formatNumber(systemStats?.totalMedia || 0)}</p>
              <p className="text-xs theme-text-muted">Media</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-primary">{systemStats?.databaseSize || '0 KB'}</p>
              <p className="text-xs theme-text-muted">Est. DB Size</p>
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-primary">{backupHistory.filter(b => b.status === 'completed').length}</p>
              <p className="text-xs theme-text-muted">Backups</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Backup Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Backup Options */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center space-x-3">
              <div className="p-2 bg-[#fcd535]/10 rounded-lg">
                <Settings className="w-5 h-5 text-[#fcd535]" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary">Backup Options</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Backup Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'full', label: 'Full Backup', desc: 'Database + Media files', icon: Archive },
                    { value: 'database', label: 'Database Only', desc: 'Posts, users, settings', icon: Database },
                    { value: 'media', label: 'Media Only', desc: 'Images and uploads', icon: Image }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setBackupType(option.value as any)}
                        className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                          backupType === option.value
                            ? 'border-[#fcd535] bg-[#fcd535]/10'
                            : 'theme-border-primary hover:border-[#fcd535]/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${backupType === option.value ? 'text-[#fcd535]' : 'theme-text-muted'}`} />
                        <div className="text-left">
                          <p className={`font-medium ${backupType === option.value ? 'text-[#fcd535]' : 'theme-text-primary'}`}>
                            {option.label}
                          </p>
                          <p className="text-xs theme-text-muted">{option.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Auto Backup Settings */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary">Automatic Backups</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="theme-text-primary font-medium">Enable Auto Backup</p>
                  <p className="text-sm theme-text-muted">Automatically create backups</p>
                </div>
                <button
                  onClick={() => setAutoBackup(!autoBackup)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoBackup ? 'bg-emerald-500' : 'theme-bg-tertiary'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoBackup ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              {autoBackup && (
                <>
                  <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">Frequency</label>
                    <select
                      value={backupFrequency}
                      onChange={(e) => setBackupFrequency(e.target.value)}
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                    >
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">Retention (days)</label>
                    <input
                      type="number"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cloud Storage */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Cloud className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold theme-text-primary">Cloud Storage</h3>
            </div>
            <div className="p-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Coming Soon</p>
                    <p className="text-xs text-blue-400/80">Cloud backup integration with AWS S3, Google Cloud, and Dropbox.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="lg:col-span-2">
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Archive className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold theme-text-primary">Backup History</h3>
              </div>
              <span className="text-sm theme-text-muted">{backupHistory.length} backups</span>
            </div>
            
            <div className="divide-y theme-border-primary">
              {backupHistory.length > 0 ? (
                backupHistory.map((backup) => (
                  <div key={backup.id} className="p-4 hover:theme-bg-tertiary transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 theme-bg-tertiary rounded-lg">
                          {getTypeIcon(backup.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium theme-text-primary">{backup.name}</p>
                            {getStatusIcon(backup.status)}
                          </div>
                          <div className="flex items-center space-x-3 text-sm theme-text-muted mt-1">
                            <span className="capitalize">{backup.type}</span>
                            <span>•</span>
                            <span>{backup.size}</span>
                            <span>•</span>
                            <span>{formatDate(backup.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {backup.status === 'completed' && (
                          <>
                            <button
                              onClick={() => handleRestore(backup)}
                              className="p-2 theme-bg-tertiary rounded-lg theme-text-secondary hover:text-blue-400 transition-colors"
                              title="Restore"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 theme-bg-tertiary rounded-lg theme-text-secondary hover:text-emerald-400 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          className="p-2 theme-bg-tertiary rounded-lg theme-text-secondary hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Archive className="w-16 h-16 theme-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold theme-text-primary mb-2">No Backups Yet</h3>
                  <p className="theme-text-muted mb-4">Create your first backup to protect your data</p>
                  <button
                    onClick={handleCreateBackup}
                    className="px-4 py-2 bg-[#fcd535] text-[#0b0e11] font-medium rounded-lg hover:bg-[#f0b90b] transition-colors"
                  >
                    Create First Backup
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Warning Note */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium">Important Notes</p>
                <ul className="text-xs text-amber-400/80 mt-1 space-y-1">
                  <li>• Always test your backups by restoring to a staging environment</li>
                  <li>• Keep at least 3 recent backups for redundancy</li>
                  <li>• Store backups in multiple locations for safety</li>
                  <li>• Restoring will overwrite existing data - proceed with caution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-bg-secondary rounded-2xl border theme-border-primary w-full max-w-md overflow-hidden">
            <div className="p-6 border-b theme-border-primary">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold theme-text-primary">Confirm Restore</h3>
                  <p className="text-sm theme-text-muted">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="theme-bg-tertiary rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedBackup.type)}
                  <div>
                    <p className="font-medium theme-text-primary">{selectedBackup.name}</p>
                    <p className="text-sm theme-text-muted">{formatDate(selectedBackup.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm theme-text-secondary mb-4">
                Are you sure you want to restore this backup? This will replace all current data with the backup contents.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="flex-1 px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:theme-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRestore}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Restore Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backup;

