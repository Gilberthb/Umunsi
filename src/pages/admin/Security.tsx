import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Lock, Key, Eye, EyeOff, Smartphone, Globe, Clock,
  AlertTriangle, CheckCircle, XCircle, RefreshCw, Copy, Trash2,
  Plus, Settings, Activity, Users, LogIn, LogOut, Monitor,
  Fingerprint, Mail, Bell, Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  apiClient, 
  SecuritySettings, 
  SecurityStats, 
  LoginSession, 
  LoginAttempt, 
  ApiKeyData 
} from '../../services/api';

const Security: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'login-history' | 'api-keys' | '2fa'>('overview');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Data from API
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [settingsData, statsData, sessionsData, historyData, keysData] = await Promise.all([
        apiClient.getSecuritySettings().catch(() => null),
        apiClient.getSecurityStats().catch(() => null),
        apiClient.getSessions().catch(() => []),
        apiClient.getLoginHistory({ limit: 50 }).catch(() => ({ data: [] })),
        apiClient.getAllApiKeys().catch(() => [])
      ]);
      
      if (settingsData) setSettings(settingsData);
      if (statsData) setStats(statsData);
      setSessions(sessionsData || []);
      setLoginHistory(historyData.data || []);
      setApiKeys(keysData || []);
      
      // Check if current user has 2FA enabled
      setTwoFactorEnabled(user?.twoFactorEnabled || false);
    } catch (err) {
      console.error('Error fetching security data:', err);
      setError('Failed to load security data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      await apiClient.updateSecuritySettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await apiClient.terminateSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      setError('Failed to terminate session');
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      await apiClient.terminateAllSessions();
      setSessions(sessions.filter(s => s.isCurrent));
    } catch (err) {
      setError('Failed to terminate sessions');
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      const newKey = await apiClient.createApiKey({ 
        name: newKeyName,
        permissions: ['read:posts', 'read:categories']
      });
      setNewlyCreatedKey(newKey.key);
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName('');
    } catch (err) {
      setError('Failed to create API key');
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      await apiClient.deleteApiKey(keyId);
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
    } catch (err) {
      setError('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ubu';
    if (diffMins < 60) return `Iminota ${diffMins} ishize`;
    if (diffHours < 24) return `Amasaha ${diffHours} ashize`;
    return `Iminsi ${diffDays} ishize`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'blocked': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'failed': return <XCircle className="w-3.5 h-3.5" />;
      case 'blocked': return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const updateSetting = (key: keyof SecuritySettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-red-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
            <Shield className="absolute inset-0 m-auto w-6 h-6 text-red-500" />
          </div>
          <p className="theme-text-tertiary">Gutegura umutekano...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary p-6">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span>Igenamiterere ryabitswe neza!</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-2 hover:text-white/80">×</button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold theme-text-primary flex items-center">
              <Shield className="w-7 h-7 mr-2 text-red-500" />
              Umutekano
            </h1>
            <p className="theme-text-tertiary mt-1">Gucunga umutekano w'urubuga • Data from database</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchData}
              className="flex items-center px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-red-500/50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Kuvugurura
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              Bika Igenamiterere
            </button>
          </div>
        </div>
      </div>

      {/* Security Score */}
      <div className="mb-6 theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                    strokeDasharray={`${(stats?.score || 0) * 2.51} ${100 * 2.51}`}
                    className={stats?.score && stats.score >= 70 ? 'text-emerald-500' : stats?.score && stats.score >= 50 ? 'text-amber-500' : 'text-red-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold theme-text-primary">{stats?.score || 0}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold theme-text-primary">Umutekano Score</h3>
                <p className="theme-text-muted text-sm">
                  {stats?.score && stats.score >= 70 ? 'Umutekano wawe uri mu rwego rwiza' : 
                   stats?.score && stats.score >= 50 ? 'Umutekano wawe uri mu rwego rwo hagati' : 
                   'Umutekano wawe ukeneye kunozwa'}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${
                    stats?.score && stats.score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    stats?.score && stats.score >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {stats?.score && stats.score >= 70 ? 'Mwiza' : stats?.score && stats.score >= 50 ? 'Hagati' : 'Gukosora'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-lg mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">{stats?.verified || 0}</p>
                <p className="text-xs theme-text-muted">Byemejwe</p>
              </div>
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500/10 rounded-lg mx-auto mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">{stats?.warnings?.length || 0}</p>
                <p className="text-xs theme-text-muted">Iburira</p>
              </div>
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-red-500/10 rounded-lg mx-auto mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">{stats?.issues?.length || 0}</p>
                <p className="text-xs theme-text-muted">Ibibazo</p>
              </div>
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg mx-auto mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">{stats?.activeSessions || 0}</p>
                <p className="text-xs theme-text-muted">Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Incamake', icon: Shield },
          { id: 'sessions', label: 'Sessions', icon: Monitor },
          { id: 'login-history', label: 'Amateka yo Kwinjira', icon: LogIn },
          { id: 'api-keys', label: 'API Keys', icon: Key },
          { id: '2fa', label: '2FA', icon: Smartphone }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-red-500 text-white'
                : 'theme-bg-secondary theme-text-secondary hover:theme-bg-tertiary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Policy */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
              <h3 className="font-semibold theme-text-primary flex items-center">
                <Lock className="w-5 h-5 mr-2 text-red-500" />
                Politiki y'Ijambo ry'Ibanga
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Uburebure bw'ijambo ry'ibanga
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range" min="6" max="20"
                    value={settings.minPasswordLength}
                    onChange={(e) => updateSetting('minPasswordLength', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <span className="text-lg font-bold text-red-500 w-8">{settings.minPasswordLength}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { key: 'requireUppercase', label: 'Inyuguti nkuru (A-Z)' },
                  { key: 'requireLowercase', label: 'Inyuguti nto (a-z)' },
                  { key: 'requireNumbers', label: 'Imibare (0-9)' },
                  { key: 'requireSpecialChars', label: 'Ibirango bidasanzwe (!@#$)' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer">
                    <span className="theme-text-secondary text-sm">{item.label}</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof SecuritySettings] as boolean}
                        onChange={(e) => updateSetting(item.key as keyof SecuritySettings, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Ijambo ry'ibanga rirangira nyuma y'iminsi</label>
                <select
                  value={settings.passwordExpireDays}
                  onChange={(e) => updateSetting('passwordExpireDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                >
                  <option value={30}>Iminsi 30</option>
                  <option value={60}>Iminsi 60</option>
                  <option value={90}>Iminsi 90</option>
                  <option value={180}>Iminsi 180</option>
                  <option value={0}>Nta gihe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Session Settings */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
              <h3 className="font-semibold theme-text-primary flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Igenamiterere rya Session
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Session irangira nyuma y'iminota</label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                >
                  <option value={15}>Iminota 15</option>
                  <option value={30}>Iminota 30</option>
                  <option value={60}>Isaha 1</option>
                  <option value={120}>Amasaha 2</option>
                  <option value={480}>Amasaha 8</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Umubare ntarengwa wa sessions</label>
                <input
                  type="number" min="1" max="10"
                  value={settings.maxConcurrentSessions}
                  onChange={(e) => updateSetting('maxConcurrentSessions', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">"Nyibuka" iminsi</label>
                <input
                  type="number" min="1" max="90"
                  value={settings.rememberMeDays}
                  onChange={(e) => updateSetting('rememberMeDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>
          </div>

          {/* Login Security */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
              <h3 className="font-semibold theme-text-primary flex items-center">
                <LogIn className="w-5 h-5 mr-2 text-emerald-500" />
                Umutekano wo Kwinjira
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Inshuro ntarengwa zo kugerageza</label>
                <input
                  type="number" min="3" max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Igihe cyo gufungwa (iminota)</label>
                <input
                  type="number" min="5" max="60"
                  value={settings.lockoutDuration}
                  onChange={(e) => updateSetting('lockoutDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="theme-text-secondary text-sm">Gukoresha CAPTCHA</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.enableCaptcha}
                    onChange={(e) => updateSetting('enableCaptcha', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
              <h3 className="font-semibold theme-text-primary flex items-center">
                <Bell className="w-5 h-5 mr-2 text-amber-500" />
                Imenyesha ry'Umutekano
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'notifyOnNewLogin', label: 'Kwinjira gushya', desc: 'Ubutumwa iyo winjiye kuri device nshya' },
                { key: 'notifyOnPasswordChange', label: 'Guhindura ijambo ry\'ibanga', desc: 'Ubutumwa iyo ijambo ry\'ibanga rihindutse' },
                { key: 'notifyOnSuspiciousActivity', label: 'Ibikorwa bitumvikana', desc: 'Ubutumwa ku bikorwa bishishikaje' }
              ].map((item) => (
                <label key={item.key} className="flex items-start justify-between cursor-pointer p-3 theme-bg-tertiary rounded-lg hover:bg-opacity-80 transition-colors">
                  <div>
                    <p className="theme-text-primary font-medium text-sm">{item.label}</p>
                    <p className="theme-text-muted text-xs">{item.desc}</p>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof SecuritySettings] as boolean}
                      onChange={(e) => updateSetting(item.key as keyof SecuritySettings, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
            <h3 className="font-semibold theme-text-primary">Sessions Zikora ({sessions.length})</h3>
            <button
              onClick={handleTerminateAllSessions}
              className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Soza izindi zose</span>
            </button>
          </div>
          <div className="divide-y theme-border-primary">
            {sessions.length > 0 ? sessions.map((session) => (
              <div key={session.id} className="p-4 hover:theme-bg-tertiary transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${session.isCurrent ? 'bg-emerald-500/10' : 'theme-bg-tertiary'}`}>
                      <Monitor className={`w-6 h-6 ${session.isCurrent ? 'text-emerald-500' : 'theme-text-muted'}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium theme-text-primary">{session.device}</h4>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                            Session yawe
                          </span>
                        )}
                      </div>
                      <p className="text-sm theme-text-muted">{session.browser}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs theme-text-tertiary">
                        <span className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{session.ip}</span>
                        </span>
                        <span>{session.location || 'Unknown'}</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(session.lastActive)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Soza session"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center">
                <Monitor className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                <p className="theme-text-muted">Nta sessions zihari</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login History Tab */}
      {activeTab === 'login-history' && (
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
            <h3 className="font-semibold theme-text-primary">Amateka yo Kwinjira ({loginHistory.length})</h3>
            <button className="text-sm text-[#fcd535] hover:underline flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Kuramo CSV</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="theme-bg-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Igihe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Aho</th>
                  <th className="px-4 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">Imiterere</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border-primary">
                {loginHistory.length > 0 ? loginHistory.map((attempt) => (
                  <tr key={attempt.id} className="hover:theme-bg-tertiary transition-colors">
                    <td className="px-4 py-3 text-sm theme-text-secondary whitespace-nowrap">
                      {formatTimeAgo(attempt.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-primary">{attempt.email}</td>
                    <td className="px-4 py-3 text-sm theme-text-muted font-mono">{attempt.ip}</td>
                    <td className="px-4 py-3 text-sm theme-text-muted">{attempt.location || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-medium rounded-md border ${getStatusBadge(attempt.status)}`}>
                        {getStatusIcon(attempt.status)}
                        <span className="capitalize">{attempt.status}</span>
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center theme-text-muted">
                      Nta mateka yo kwinjira ahari
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
              <h3 className="font-semibold theme-text-primary">API Keys ({apiKeys.length})</h3>
              <button
                onClick={() => setShowNewKeyModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Kora API Key</span>
              </button>
            </div>
            <div className="divide-y theme-border-primary">
              {apiKeys.length > 0 ? apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 hover:theme-bg-tertiary transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium theme-text-primary">{apiKey.name}</h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <code className="px-3 py-1.5 theme-bg-tertiary rounded-lg text-sm font-mono theme-text-muted">
                          {showApiKey === apiKey.id ? apiKey.key : '•'.repeat(32)}
                        </code>
                        <button
                          onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                          className="p-1.5 theme-text-muted hover:theme-text-primary transition-colors"
                        >
                          {showApiKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-1.5 theme-text-muted hover:text-[#fcd535] transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs theme-text-muted">
                        <span>Yashizweho: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                        <span>Yakoreshejwe: {apiKey.lastUsed ? formatTimeAgo(apiKey.lastUsed) : 'Ntabwo'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {apiKey.permissions.map((perm) => (
                          <span key={perm} className="px-2 py-0.5 theme-bg-tertiary text-xs rounded-full theme-text-muted">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center">
                  <Key className="w-12 h-12 theme-text-muted mx-auto mb-3" />
                  <p className="theme-text-muted">Nta API keys zihari</p>
                </div>
              )}
            </div>
          </div>

          {/* New API Key Modal */}
          {showNewKeyModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="theme-bg-secondary rounded-2xl border theme-border-primary w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b theme-border-primary">
                  <h3 className="text-lg font-semibold theme-text-primary">Kora API Key Nshya</h3>
                </div>
                <div className="p-6 space-y-4">
                  {newlyCreatedKey ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <p className="text-sm text-emerald-400 mb-2">✓ API Key yarakozwe! Bika iyi key ubu - ntuzongera kuyibona.</p>
                        <code className="block p-3 theme-bg-tertiary rounded-lg text-sm font-mono theme-text-primary break-all">
                          {newlyCreatedKey}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(newlyCreatedKey)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 theme-bg-tertiary rounded-xl theme-text-primary hover:bg-opacity-80"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy to Clipboard</span>
                      </button>
                      <button
                        onClick={() => { setShowNewKeyModal(false); setNewlyCreatedKey(null); }}
                        className="w-full px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600"
                      >
                        Funga
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium theme-text-secondary mb-2">Izina rya Key</label>
                        <input
                          type="text"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder="eg. Mobile App API"
                          className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowNewKeyModal(false)}
                          className="flex-1 px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary"
                        >
                          Hagarika
                        </button>
                        <button
                          onClick={handleCreateApiKey}
                          disabled={!newKeyName.trim()}
                          className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50"
                        >
                          Kora Key
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="theme-bg-secondary rounded-xl border border-amber-500/30 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium theme-text-primary">Icyitonderwa</h4>
                <p className="text-sm theme-text-muted mt-1">
                  API keys zigomba kuzigama neza. Ntuzigabane n'abantu bandi, kandi uzihindure niba wumva bishobora kuba byafashwe.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Tab */}
      {activeTab === '2fa' && settings && (
        <div className="space-y-6">
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary">
              <h3 className="font-semibold theme-text-primary flex items-center">
                <Fingerprint className="w-5 h-5 mr-2 text-purple-500" />
                Two-Factor Authentication (2FA)
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-2xl ${twoFactorEnabled ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <Smartphone className={`w-12 h-12 ${twoFactorEnabled ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold theme-text-primary">
                    {twoFactorEnabled ? '2FA Irakora' : '2FA Ntabwo irakora'}
                  </h4>
                  <p className="theme-text-muted text-sm mt-1">
                    {twoFactorEnabled 
                      ? 'Konte yawe irinzwe n\'icyemezo cya kabiri.'
                      : 'Ongeraho umutekano ku konte yawe.'}
                  </p>
                  <button
                    onClick={() => {
                      if (!twoFactorEnabled) setShowQRCode(true);
                      else setTwoFactorEnabled(false);
                    }}
                    className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                      twoFactorEnabled
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {twoFactorEnabled ? 'Hagarika 2FA' : 'Tangira 2FA'}
                  </button>
                </div>
              </div>

              {showQRCode && !twoFactorEnabled && (
                <div className="mt-6 p-6 theme-bg-tertiary rounded-xl">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="bg-white p-4 rounded-xl">
                      <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500 text-xs">QR Code</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium theme-text-primary mb-2">Gukoresha Authenticator App</h5>
                      <ol className="list-decimal list-inside space-y-2 text-sm theme-text-muted">
                        <li>Kura app nka Google Authenticator cyangwa Authy</li>
                        <li>Scan QR code cyangwa wandike kode hasi</li>
                        <li>Injiza kode y'imibare 6 hano</li>
                      </ol>
                      <div className="mt-4">
                        <label className="block text-sm font-medium theme-text-secondary mb-2">Injiza kode y'imibare 6</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            className="flex-1 px-4 py-2.5 theme-bg-secondary border theme-border-primary rounded-xl theme-text-primary text-center font-mono text-lg tracking-widest focus:outline-none focus:border-red-500/50"
                          />
                          <button
                            onClick={() => { setTwoFactorEnabled(true); setShowQRCode(false); }}
                            className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                          >
                            Emeza
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2FA Methods */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
            <div className="px-6 py-4 border-b theme-border-primary">
              <h3 className="font-semibold theme-text-primary">Uburyo bwa 2FA bwemewe</h3>
            </div>
            <div className="p-6 space-y-3">
              {[
                { id: 'app', icon: Smartphone, label: 'Authenticator App', desc: 'Kode za OTP ziva muri app' },
                { id: 'sms', icon: Mail, label: 'SMS', desc: 'Kode zoherezwa kuri telefone' },
                { id: 'email', icon: Mail, label: 'Email', desc: 'Kode zoherezwa kuri email' }
              ].map((method) => (
                <label key={method.id} className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl cursor-pointer hover:bg-opacity-80 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <method.icon className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium theme-text-primary">{method.label}</p>
                      <p className="text-xs theme-text-muted">{method.desc}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.allow2FAMethods.includes(method.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateSetting('allow2FAMethods', [...settings.allow2FAMethods, method.id]);
                        } else {
                          updateSetting('allow2FAMethods', settings.allow2FAMethods.filter(m => m !== method.id));
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Require 2FA for all */}
          <div className="theme-bg-secondary rounded-xl border theme-border-primary p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold theme-text-primary">Gusaba 2FA ku bakozi bose</h4>
                  <p className="text-sm theme-text-muted">Abakozi bose bazasabwa gukoresha 2FA</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.require2FA}
                  onChange={(e) => updateSetting('require2FA', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </div>
            </label>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Security;
