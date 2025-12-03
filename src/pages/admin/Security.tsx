import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Key, Eye, EyeOff, Smartphone, Globe, Clock,
  AlertTriangle, CheckCircle, XCircle, RefreshCw, Copy, Trash2,
  Plus, Settings, Activity, Users, LogIn, LogOut, Monitor,
  Fingerprint, Mail, Bell, ChevronRight, Info, Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface LoginAttempt {
  id: string;
  email: string;
  ip: string;
  status: 'success' | 'failed' | 'blocked';
  timestamp: string;
  location: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
}

const Security: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'login-history' | 'api-keys' | '2fa'>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security settings state
  const [settings, setSettings] = useState({
    // Password Policy
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpireDays: 90,
    preventPasswordReuse: 5,
    
    // Session Settings
    sessionTimeout: 30,
    maxConcurrentSessions: 3,
    rememberMeDays: 30,
    
    // Login Security
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableCaptcha: true,
    captchaThreshold: 3,
    
    // Two-Factor Authentication
    require2FA: false,
    allow2FAMethods: ['app', 'sms', 'email'],
    
    // IP Security
    enableIpWhitelist: false,
    whitelistedIps: [] as string[],
    enableIpBlacklist: true,
    blacklistedIps: ['192.168.1.100', '10.0.0.50'],
    
    // Notifications
    notifyOnNewLogin: true,
    notifyOnPasswordChange: true,
    notifyOnSuspiciousActivity: true
  });

  // Mock data
  const [sessions, setSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      ip: '192.168.1.1',
      location: 'Kigali, Rwanda',
      lastActive: new Date().toISOString(),
      isCurrent: true
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      ip: '192.168.1.45',
      location: 'Kigali, Rwanda',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isCurrent: false
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Firefox 121',
      ip: '10.0.0.25',
      location: 'Musanze, Rwanda',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: false
    }
  ]);

  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([
    { id: '1', email: 'admin@umunsi.com', ip: '192.168.1.1', status: 'success', timestamp: new Date().toISOString(), location: 'Kigali, Rwanda' },
    { id: '2', email: 'admin@umunsi.com', ip: '192.168.1.1', status: 'success', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), location: 'Kigali, Rwanda' },
    { id: '3', email: 'unknown@test.com', ip: '45.33.32.156', status: 'failed', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), location: 'Unknown' },
    { id: '4', email: 'admin@umunsi.com', ip: '192.168.1.45', status: 'success', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'Kigali, Rwanda' },
    { id: '5', email: 'hacker@evil.com', ip: '185.220.101.1', status: 'blocked', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), location: 'Unknown (TOR)' },
  ]);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Mobile App API',
      key: 'umunsi_api_key_1234567890abcdef',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      permissions: ['read:posts', 'read:categories', 'read:users']
    },
    {
      id: '2',
      name: 'Analytics Integration',
      key: 'umunsi_api_key_analytics_xyz123',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      permissions: ['read:analytics', 'write:analytics']
    }
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const handleTerminateAllSessions = () => {
    setSessions(sessions.filter(s => s.isCurrent));
  };

  const handleDeleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== keyId));
  };

  const handleGenerateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `umunsi_api_key_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      permissions: ['read:posts']
    };
    setApiKeys([...apiKeys, newKey]);
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
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'blocked':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
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

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold theme-text-primary flex items-center">
              <Shield className="w-7 h-7 mr-2 text-red-500" />
              Umutekano
            </h1>
            <p className="theme-text-tertiary mt-1">Gucunga umutekano w'urubuga</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-red-500/50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Kuvugurura
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
            >
              <Settings className="w-4 h-4 mr-2" />
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
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${75 * 2.51} ${100 * 2.51}`}
                    className="text-emerald-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold theme-text-primary">75%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold theme-text-primary">Umutekano Score</h3>
                <p className="theme-text-muted text-sm">Umutekano wawe uri mu rwego rwiza</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                    Mwiza
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-lg mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">12</p>
                <p className="text-xs theme-text-muted">Byemejwe</p>
              </div>
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500/10 rounded-lg mx-auto mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">3</p>
                <p className="text-xs theme-text-muted">Iburira</p>
              </div>
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-red-500/10 rounded-lg mx-auto mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">1</p>
                <p className="text-xs theme-text-muted">Ibibazo</p>
              </div>
              <div className="text-center p-3 theme-bg-tertiary rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg mx-auto mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-lg font-bold theme-text-primary">{sessions.length}</p>
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
      {activeTab === 'overview' && (
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
                    type="range"
                    min="6"
                    max="20"
                    value={settings.minPasswordLength}
                    onChange={(e) => setSettings({ ...settings, minPasswordLength: parseInt(e.target.value) })}
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
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Ijambo ry'ibanga rirangira nyuma y'iminsi
                </label>
                <select
                  value={settings.passwordExpireDays}
                  onChange={(e) => setSettings({ ...settings, passwordExpireDays: parseInt(e.target.value) })}
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
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Session irangira nyuma y'iminota
                </label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
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
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Umubare ntarengwa wa sessions
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxConcurrentSessions}
                  onChange={(e) => setSettings({ ...settings, maxConcurrentSessions: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  "Nyibuka" iminsi
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.rememberMeDays}
                  onChange={(e) => setSettings({ ...settings, rememberMeDays: parseInt(e.target.value) })}
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
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Inshuro ntarengwa zo kugerageza
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  Igihe cyo gufungwa (iminota)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={settings.lockoutDuration}
                  onChange={(e) => setSettings({ ...settings, lockoutDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-red-500/50"
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="theme-text-secondary text-sm">Gukoresha CAPTCHA</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.enableCaptcha}
                    onChange={(e) => setSettings({ ...settings, enableCaptcha: e.target.checked })}
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
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
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
            {sessions.map((session) => (
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
                        <span>{session.location}</span>
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
            ))}
          </div>
        </div>
      )}

      {/* Login History Tab */}
      {activeTab === 'login-history' && (
        <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
          <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
            <h3 className="font-semibold theme-text-primary">Amateka yo Kwinjira</h3>
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
                {loginHistory.map((attempt) => (
                  <tr key={attempt.id} className="hover:theme-bg-tertiary transition-colors">
                    <td className="px-4 py-3 text-sm theme-text-secondary whitespace-nowrap">
                      {formatTimeAgo(attempt.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm theme-text-primary">{attempt.email}</td>
                    <td className="px-4 py-3 text-sm theme-text-muted font-mono">{attempt.ip}</td>
                    <td className="px-4 py-3 text-sm theme-text-muted">{attempt.location}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-medium rounded-md border ${getStatusBadge(attempt.status)}`}>
                        {getStatusIcon(attempt.status)}
                        <span className="capitalize">{attempt.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
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
                onClick={handleGenerateApiKey}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Kora API Key</span>
              </button>
            </div>
            <div className="divide-y theme-border-primary">
              {apiKeys.map((apiKey) => (
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
              ))}
            </div>
          </div>

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
      {activeTab === '2fa' && (
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
                      ? 'Konte yawe irinzwe n\'icyemezo cya kabiri. Buri gihe winjira uzasabwa kode.'
                      : 'Ongeraho umutekano ku konte yawe ukoresheje icyemezo cya kabiri.'}
                  </p>
                  <button
                    onClick={() => {
                      if (!twoFactorEnabled) {
                        setShowQRCode(true);
                      } else {
                        setTwoFactorEnabled(false);
                      }
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
                      {/* Placeholder QR Code */}
                      <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500 text-xs">
                          QR Code
                        </div>
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
                        <p className="text-xs theme-text-muted mb-2">Kode y'ibanga:</p>
                        <code className="px-3 py-2 theme-bg-secondary rounded-lg font-mono text-sm theme-text-primary block">
                          UMUN-SI2F-A4S3-CR3T-K3Y1
                        </code>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium theme-text-secondary mb-2">
                          Injiza kode y'imibare 6
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            className="flex-1 px-4 py-2.5 theme-bg-secondary border theme-border-primary rounded-xl theme-text-primary text-center font-mono text-lg tracking-widest focus:outline-none focus:border-red-500/50"
                          />
                          <button
                            onClick={() => {
                              setTwoFactorEnabled(true);
                              setShowQRCode(false);
                            }}
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
                          setSettings({ ...settings, allow2FAMethods: [...settings.allow2FAMethods, method.id] });
                        } else {
                          setSettings({ ...settings, allow2FAMethods: settings.allow2FAMethods.filter(m => m !== method.id) });
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

          {/* Admin 2FA Requirement */}
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
                  onChange={(e) => setSettings({ ...settings, require2FA: e.target.checked })}
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

