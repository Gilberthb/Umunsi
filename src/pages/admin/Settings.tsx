import { useState, useEffect } from 'react';
import { 
  Save, 
  Settings as SettingsIcon,
  Globe,
  Shield,
  Mail,
  Database,
  Palette,
  Bell,
  Users,
  FileText,
  Sparkles,
  Check,
  ChevronRight,
  RefreshCw,
  HardDrive,
  Activity,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Info
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsData {
  site: {
    name: string;
    description: string;
    language: string;
    timezone: string;
    maintenance: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletterEnabled: boolean;
  };
}

interface SystemStats {
  totalPosts: number;
  totalUsers: number;
  totalCategories: number;
  totalMedia: number;
  totalViews: number;
  databaseSize: string;
  lastBackup: string;
}

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('site');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [settings, setSettings] = useState<SettingsData>({
    site: {
      name: 'Umunsi News',
      description: 'Amakuru ya buri munsi - Rwanda News Portal',
      language: 'rw',
      timezone: 'Africa/Kigali',
      maintenance: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUser: '',
      smtpPass: '',
      fromEmail: 'noreply@umunsi.com',
      fromName: 'Umunsi News'
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      requireEmailVerification: true,
      enableTwoFactor: false
    },
    appearance: {
      theme: theme,
      primaryColor: '#fcd535',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      newsletterEnabled: true
    }
  });

  const tabs = [
    { id: 'site', name: 'Site Settings', icon: Globe },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System Info', icon: Database }
  ];

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      
      const [postsResponse, usersResponse, categoriesResponse, mediaResponse] = await Promise.all([
        apiClient.getPosts({ limit: 1 }).catch(() => ({ pagination: { total: 0 }, data: [] })),
        apiClient.getUsers({ limit: 1 }).catch(() => ({ data: [] })),
        apiClient.getCategories().catch(() => []),
        apiClient.getMediaFiles().catch(() => [])
      ]);

      // Calculate total views
      const allPostsResponse = await apiClient.getPosts({ limit: 100 }).catch(() => ({ data: [] }));
      const totalViews = (allPostsResponse?.data || []).reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);

      setSystemStats({
        totalPosts: (postsResponse as any)?.pagination?.total || (postsResponse?.data || []).length,
        totalUsers: (usersResponse as any)?.pagination?.total || (usersResponse?.data || []).length,
        totalCategories: (categoriesResponse || []).length,
        totalMedia: (mediaResponse || []).length,
        totalViews,
        databaseSize: 'Calculating...',
        lastBackup: 'Never'
      });

    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Apply theme change
    if (settings.appearance.theme !== theme) {
      setTheme(settings.appearance.theme as 'light' | 'dark');
    }
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSettings = (category: keyof SettingsData, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen theme-bg-primary p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold theme-text-primary flex items-center">
              <SettingsIcon className="w-7 h-7 mr-2 text-[#fcd535]" />
              Settings
            </h1>
            <p className="theme-text-tertiary mt-1">Manage your platform settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#fcd535] text-[#0b0e11] font-semibold rounded-xl hover:bg-[#f0b90b] disabled:opacity-50 transition-all flex items-center space-x-2"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-[#0b0e11]/20 border-t-[#0b0e11] rounded-full animate-spin"></div><span>Saving...</span></>
            ) : saved ? (
              <><Check className="w-4 h-4" /><span>Saved!</span></>
            ) : (
              <><Save className="w-4 h-4" /><span>Save Changes</span></>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="theme-bg-secondary rounded-xl border theme-border-primary p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#fcd535]/10 text-[#fcd535]'
                      : 'theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </div>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="theme-bg-secondary rounded-xl border theme-border-primary">
            {/* Site Settings */}
          {activeTab === 'site' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b theme-border-primary">
                  <div className="p-2 bg-[#fcd535]/10 rounded-lg">
                    <Globe className="w-5 h-5 text-[#fcd535]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold theme-text-primary">Site Settings</h2>
                    <p className="text-sm theme-text-muted">Configure your site details</p>
                  </div>
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.site.name}
                    onChange={(e) => updateSettings('site', 'name', e.target.value)}
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">Language</label>
                  <select
                    value={settings.site.language}
                    onChange={(e) => updateSettings('site', 'language', e.target.value)}
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  >
                    <option value="rw">Kinyarwanda</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium theme-text-secondary mb-2">Description</label>
                    <textarea
                      value={settings.site.description}
                      onChange={(e) => updateSettings('site', 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50 resize-none"
                    />
                  </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">Timezone</label>
                  <select
                    value={settings.site.timezone}
                    onChange={(e) => updateSettings('site', 'timezone', e.target.value)}
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  >
                      <option value="Africa/Kigali">Africa/Kigali (CAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
                  <div className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl">
                    <div>
                      <p className="theme-text-primary font-medium">Maintenance Mode</p>
                      <p className="text-sm theme-text-muted">Disable site for visitors</p>
                    </div>
                    <button
                      onClick={() => updateSettings('site', 'maintenance', !settings.site.maintenance)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.site.maintenance ? 'bg-amber-500' : 'theme-bg-secondary'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.site.maintenance ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b theme-border-primary">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Palette className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold theme-text-primary">Appearance</h2>
                    <p className="text-sm theme-text-muted">Customize the look and feel</p>
                </div>
              </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-3">Theme</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { value: 'dark', label: 'Dark', bg: 'bg-[#0b0e11]', text: 'text-white' },
                        { value: 'light', label: 'Light', bg: 'bg-white', text: 'text-gray-900' }
                      ].map((t) => (
                        <button
                          key={t.value}
                          onClick={() => updateSettings('appearance', 'theme', t.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            settings.appearance.theme === t.value
                              ? 'border-[#fcd535]'
                              : 'theme-border-primary hover:border-[#fcd535]/50'
                          }`}
                        >
                          <div className={`h-20 ${t.bg} rounded-lg mb-2 flex items-center justify-center border theme-border-primary`}>
                            <div className={`w-8 h-8 rounded-full bg-[#fcd535]`}></div>
                          </div>
                          <p className="theme-text-primary font-medium text-center">{t.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">Logo URL</label>
                      <input
                        type="text"
                        value={settings.appearance.logoUrl}
                        onChange={(e) => updateSettings('appearance', 'logoUrl', e.target.value)}
                        className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">Favicon URL</label>
                <input
                        type="text"
                        value={settings.appearance.faviconUrl}
                        onChange={(e) => updateSettings('appearance', 'faviconUrl', e.target.value)}
                        className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b theme-border-primary">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold theme-text-primary">Security Settings</h2>
                    <p className="text-sm theme-text-muted">Configure security options</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">Session Timeout (hours)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium theme-text-secondary mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl">
                    <div>
                      <p className="theme-text-primary font-medium">Require Email Verification</p>
                      <p className="text-sm theme-text-muted">Users must verify email to login</p>
                    </div>
                    <button
                      onClick={() => updateSettings('security', 'requireEmailVerification', !settings.security.requireEmailVerification)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.security.requireEmailVerification ? 'bg-emerald-500' : 'theme-bg-secondary'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.security.requireEmailVerification ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl">
                    <div>
                      <p className="theme-text-primary font-medium">Two-Factor Authentication</p>
                      <p className="text-sm theme-text-muted">Enable 2FA for extra security</p>
                    </div>
                    <button
                      onClick={() => updateSettings('security', 'enableTwoFactor', !settings.security.enableTwoFactor)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.security.enableTwoFactor ? 'bg-emerald-500' : 'theme-bg-secondary'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.security.enableTwoFactor ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
              </div>
            </div>
          )}

            {/* Email Settings */}
          {activeTab === 'email' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b theme-border-primary">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold theme-text-primary">Email Settings</h2>
                    <p className="text-sm theme-text-muted">Configure SMTP and email preferences</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-400 font-medium">SMTP Configuration</p>
                    <p className="text-xs text-blue-400/80">Configure your email server settings to enable email notifications and password resets.</p>
                  </div>
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSettings('email', 'smtpPort', e.target.value)}
                      placeholder="587"
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">SMTP User</label>
                  <input
                    type="text"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">SMTP Password</label>
                  <input
                    type="password"
                    value={settings.email.smtpPass}
                    onChange={(e) => updateSettings('email', 'smtpPass', e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">From Email</label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                      placeholder="noreply@umunsi.com"
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium theme-text-secondary mb-2">From Name</label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                      placeholder="Umunsi News"
                      className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                  />
                </div>
              </div>

                <button className="px-4 py-2 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-blue-500/50 transition-colors">
                  Test Email Connection
                </button>
            </div>
          )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b theme-border-primary">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Bell className="w-5 h-5 text-amber-400" />
                  </div>
                <div>
                    <h2 className="text-lg font-semibold theme-text-primary">Notifications</h2>
                    <p className="text-sm theme-text-muted">Manage notification preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl">
                <div>
                      <p className="theme-text-primary font-medium">Email Notifications</p>
                      <p className="text-sm theme-text-muted">Receive notifications via email</p>
                </div>
                    <button
                      onClick={() => updateSettings('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.notifications.emailNotifications ? 'bg-emerald-500' : 'theme-bg-secondary'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
              </div>

                  <div className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl">
                    <div>
                      <p className="theme-text-primary font-medium">Push Notifications</p>
                      <p className="text-sm theme-text-muted">Receive browser push notifications</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.notifications.pushNotifications ? 'bg-emerald-500' : 'theme-bg-secondary'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                </div>

                  <div className="flex items-center justify-between p-4 theme-bg-tertiary rounded-xl">
                    <div>
                      <p className="theme-text-primary font-medium">Newsletter</p>
                      <p className="text-sm theme-text-muted">Enable newsletter subscription</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'newsletterEnabled', !settings.notifications.newsletterEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.notifications.newsletterEnabled ? 'bg-emerald-500' : 'theme-bg-secondary'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications.newsletterEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}></div>
                    </button>
                </div>
              </div>
            </div>
          )}

            {/* System Info */}
            {activeTab === 'system' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b theme-border-primary">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                <div>
                    <h2 className="text-lg font-semibold theme-text-primary">System Information</h2>
                    <p className="text-sm theme-text-muted">Database statistics and system status</p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-[#fcd535]/20 border-t-[#fcd535] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="theme-bg-tertiary rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xl font-bold theme-text-primary">{formatNumber(systemStats?.totalPosts || 0)}</p>
                            <p className="text-xs theme-text-muted">Total Posts</p>
                          </div>
                        </div>
                      </div>
                      <div className="theme-bg-tertiary rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xl font-bold theme-text-primary">{formatNumber(systemStats?.totalUsers || 0)}</p>
                            <p className="text-xs theme-text-muted">Total Users</p>
                          </div>
                        </div>
                      </div>
                      <div className="theme-bg-tertiary rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-[#fcd535]/10 rounded-lg">
                            <Database className="w-5 h-5 text-[#fcd535]" />
                          </div>
                <div>
                            <p className="text-xl font-bold theme-text-primary">{systemStats?.totalCategories || 0}</p>
                            <p className="text-xs theme-text-muted">Categories</p>
                          </div>
                        </div>
                      </div>
                      <div className="theme-bg-tertiary rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-pink-500/10 rounded-lg">
                            <HardDrive className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                            <p className="text-xl font-bold theme-text-primary">{formatNumber(systemStats?.totalMedia || 0)}</p>
                            <p className="text-xs theme-text-muted">Media Files</p>
                          </div>
                        </div>
                      </div>
                      <div className="theme-bg-tertiary rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                            <p className="text-xl font-bold theme-text-primary">{formatNumber(systemStats?.totalViews || 0)}</p>
                            <p className="text-xs theme-text-muted">Total Views</p>
                          </div>
                </div>
              </div>
            </div>

                    {/* System Actions */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-medium theme-text-secondary">System Actions</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={fetchSystemStats}
                          className="flex items-center justify-center space-x-2 px-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Refresh Stats</span>
                        </button>
                        
                        <button className="flex items-center justify-center space-x-2 px-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-blue-500/50 hover:text-blue-400 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Export Data</span>
                        </button>
                </div>

                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-amber-400 font-medium">Danger Zone</p>
                            <p className="text-xs text-amber-400/80 mb-3">These actions are irreversible. Please proceed with caution.</p>
                            <button className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/20 transition-colors">
                              <Trash2 className="w-4 h-4" />
                              <span>Clear Cache</span>
                            </button>
                </div>
                </div>
              </div>
                    </div>
                  </>
                )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
