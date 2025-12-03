import React, { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Edit, Trash2, Eye, EyeOff, Search,
  RefreshCw, Image, Link as LinkIcon, Calendar, DollarSign,
  BarChart3, TrendingUp, MousePointer, ExternalLink, Copy,
  CheckCircle, XCircle, Clock, Pause, Play, Settings,
  Monitor, Smartphone, Layout, SidebarClose, Square, RectangleVertical
} from 'lucide-react';

interface Ad {
  id: string;
  name: string;
  placement: AdPlacement;
  type: 'image' | 'gif' | 'html';
  imageUrl: string;
  targetUrl: string;
  status: 'active' | 'paused' | 'scheduled' | 'expired';
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  revenue: number;
  priority: number;
  createdAt: string;
}

type AdPlacement = 
  | 'leaderboard_top'      // 970x120 - Top of page
  | 'leaderboard_bottom'   // 970x120 - Bottom of content
  | 'content_banner'       // 728x250 - In content area
  | 'sidebar_rectangle'    // 300x250 - Sidebar rectangle
  | 'sidebar_square'       // 300x300 - Sidebar square
  | 'sidebar_skyscraper';  // 300x600 - Sidebar tall

const AD_PLACEMENTS = {
  leaderboard_top: {
    name: 'Leaderboard (Top)',
    dimensions: '970 x 120 px',
    description: 'Full width banner at top of homepage',
    icon: Layout,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  leaderboard_bottom: {
    name: 'Leaderboard (Bottom)',
    dimensions: '970 x 120 px',
    description: 'Full width banner after main content',
    icon: Layout,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  content_banner: {
    name: 'Content Banner',
    dimensions: '728 x 250 px',
    description: 'Large banner in main content area',
    icon: Monitor,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  sidebar_rectangle: {
    name: 'Sidebar Rectangle',
    dimensions: '300 x 250 px',
    description: 'Medium rectangle in sidebar',
    icon: Square,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10'
  },
  sidebar_square: {
    name: 'Sidebar Square',
    dimensions: '300 x 300 px',
    description: 'Square ad in sidebar',
    icon: Square,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10'
  },
  sidebar_skyscraper: {
    name: 'Sidebar Skyscraper',
    dimensions: '300 x 600 px',
    description: 'Tall vertical ad in sidebar',
    icon: RectangleVertical,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10'
  }
};

const AdsManagement: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    placement: 'leaderboard_top' as AdPlacement,
    type: 'image' as 'image' | 'gif' | 'html',
    imageUrl: '',
    targetUrl: '',
    startDate: '',
    endDate: '',
    priority: 1
  });

  // Mock data - in production this would come from API
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockAds: Ad[] = [
      {
        id: '1',
        name: 'MTN Rwanda Promotion',
        placement: 'leaderboard_top',
        type: 'image',
        imageUrl: 'https://example.com/mtn-banner.jpg',
        targetUrl: 'https://mtn.co.rw',
        status: 'active',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        impressions: 45230,
        clicks: 1250,
        revenue: 500000,
        priority: 1,
        createdAt: '2024-11-28'
      },
      {
        id: '2',
        name: 'Bank of Kigali Services',
        placement: 'sidebar_rectangle',
        type: 'gif',
        imageUrl: 'https://example.com/bok-ad.gif',
        targetUrl: 'https://bk.rw',
        status: 'active',
        startDate: '2024-11-15',
        endDate: '2025-01-15',
        impressions: 32100,
        clicks: 890,
        revenue: 350000,
        priority: 2,
        createdAt: '2024-11-14'
      },
      {
        id: '3',
        name: 'Kigali Convention Centre',
        placement: 'content_banner',
        type: 'image',
        imageUrl: 'https://example.com/kcc-event.jpg',
        targetUrl: 'https://kcc.rw',
        status: 'paused',
        startDate: '2024-12-05',
        endDate: '2024-12-20',
        impressions: 18500,
        clicks: 420,
        revenue: 200000,
        priority: 3,
        createdAt: '2024-12-01'
      },
      {
        id: '4',
        name: 'RwandAir Holiday Deals',
        placement: 'sidebar_skyscraper',
        type: 'image',
        imageUrl: 'https://example.com/rwandair.jpg',
        targetUrl: 'https://rwandair.com',
        status: 'scheduled',
        startDate: '2024-12-15',
        endDate: '2025-01-31',
        impressions: 0,
        clicks: 0,
        revenue: 0,
        priority: 1,
        createdAt: '2024-12-02'
      }
    ];
    
    setAds(mockAds);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAd) {
      // Update existing ad
      setAds(ads.map(ad => 
        ad.id === editingAd.id 
          ? { ...ad, ...formData, status: ad.status }
          : ad
      ));
    } else {
      // Create new ad
      const newAd: Ad = {
        id: Date.now().toString(),
        ...formData,
        status: new Date(formData.startDate) > new Date() ? 'scheduled' : 'active',
        impressions: 0,
        clicks: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAds([newAd, ...ads]);
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      placement: ad.placement,
      type: ad.type,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      startDate: ad.startDate,
      endDate: ad.endDate,
      priority: ad.priority
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Uremeza ko ushaka gusiba iki cyamamazo?')) {
      setAds(ads.filter(ad => ad.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setAds(ads.map(ad => {
      if (ad.id === id) {
        const newStatus = ad.status === 'active' ? 'paused' : 'active';
        return { ...ad, status: newStatus };
      }
      return ad;
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      placement: 'leaderboard_top',
      type: 'image',
      imageUrl: '',
      targetUrl: '',
      startDate: '',
      endDate: '',
      priority: 1
    });
    setEditingAd(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'paused':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'paused':
        return <Pause className="w-3.5 h-3.5" />;
      case 'scheduled':
        return <Clock className="w-3.5 h-3.5" />;
      case 'expired':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return '0%';
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    return matchesSearch && matchesStatus && matchesPlacement;
  });

  // Calculate totals
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);
  const activeAds = ads.filter(ad => ad.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#fcd535]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#fcd535] animate-spin"></div>
            <Megaphone className="absolute inset-0 m-auto w-6 h-6 text-[#fcd535] animate-pulse" />
          </div>
          <p className="theme-text-tertiary">Loading ads...</p>
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
              <Megaphone className="w-7 h-7 mr-2 text-[#fcd535]" />
              Ads Management
            </h1>
            <p className="theme-text-tertiary mt-1">Gucunga ibyamamazo ku rubuga</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAds}
              className="flex items-center px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-secondary hover:border-[#fcd535]/50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] font-semibold rounded-xl hover:from-[#f0b90b] hover:to-[#d4a00a] transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Ad
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-tertiary">Active Ads</p>
              <p className="text-2xl font-bold theme-text-primary">{activeAds}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Play className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-tertiary">Total Impressions</p>
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(totalImpressions)}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-tertiary">Total Clicks</p>
              <p className="text-2xl font-bold theme-text-primary">{formatNumber(totalClicks)}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="theme-bg-secondary rounded-xl border theme-border-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-tertiary">Total Revenue</p>
              <p className="text-2xl font-bold theme-text-primary">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-[#fcd535]/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-[#fcd535]" />
            </div>
          </div>
        </div>
      </div>

      {/* Ad Placements Overview */}
      <div className="mb-6 theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
        <div className="px-6 py-4 border-b theme-border-primary">
          <h2 className="text-lg font-semibold theme-text-primary">Ad Placements</h2>
          <p className="text-sm theme-text-muted">Available ad positions on the website</p>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(AD_PLACEMENTS).map(([key, placement]) => {
            const Icon = placement.icon;
            const adsInPlacement = ads.filter(ad => ad.placement === key && ad.status === 'active').length;
            return (
              <div 
                key={key}
                className="theme-bg-tertiary rounded-xl p-4 border theme-border-primary hover:border-[#fcd535]/30 transition-colors"
              >
                <div className={`p-2 ${placement.bgColor} rounded-lg w-fit mb-2`}>
                  <Icon className={`w-5 h-5 ${placement.color}`} />
                </div>
                <h3 className="font-medium theme-text-primary text-sm">{placement.name}</h3>
                <p className="text-xs theme-text-muted">{placement.dimensions}</p>
                <p className="text-xs text-[#fcd535] mt-1">{adsInPlacement} active</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="theme-bg-secondary rounded-xl border theme-border-primary p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-muted" />
              <input
                type="text"
                placeholder="Search ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="px-3 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
            >
              <option value="all">All Placements</option>
              {Object.entries(AD_PLACEMENTS).map(([key, placement]) => (
                <option key={key} value={key}>{placement.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="theme-bg-secondary rounded-xl border theme-border-primary overflow-hidden">
        <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between">
          <h2 className="text-lg font-semibold theme-text-primary">{filteredAds.length} Ads</h2>
        </div>

        <div className="divide-y theme-border-primary">
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => {
              const placementInfo = AD_PLACEMENTS[ad.placement];
              const PlacementIcon = placementInfo.icon;
              return (
                <div key={ad.id} className="p-4 hover:theme-bg-tertiary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${placementInfo.bgColor} rounded-xl`}>
                        <PlacementIcon className={`w-6 h-6 ${placementInfo.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold theme-text-primary">{ad.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-md border flex items-center space-x-1 ${getStatusBadge(ad.status)}`}>
                            {getStatusIcon(ad.status)}
                            <span className="capitalize">{ad.status}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm theme-text-muted mb-2">
                          <span>{placementInfo.name}</span>
                          <span>•</span>
                          <span>{placementInfo.dimensions}</span>
                          <span>•</span>
                          <span className="capitalize">{ad.type}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1 theme-text-tertiary">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(ad.impressions)}</span>
                          </span>
                          <span className="flex items-center space-x-1 theme-text-tertiary">
                            <MousePointer className="w-4 h-4" />
                            <span>{formatNumber(ad.clicks)}</span>
                          </span>
                          <span className="flex items-center space-x-1 theme-text-tertiary">
                            <TrendingUp className="w-4 h-4" />
                            <span>CTR: {calculateCTR(ad.clicks, ad.impressions)}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-[#fcd535]">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(ad.revenue)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs theme-text-muted mt-2">
                          <Calendar className="w-3 h-3" />
                          <span>{ad.startDate} - {ad.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleStatus(ad.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          ad.status === 'active' 
                            ? 'text-emerald-400 hover:bg-emerald-500/10' 
                            : 'text-amber-400 hover:bg-amber-500/10'
                        }`}
                        title={ad.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {ad.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-2 theme-text-muted hover:text-blue-400 hover:theme-bg-tertiary rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 theme-text-muted hover:text-[#fcd535] hover:theme-bg-tertiary rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 theme-text-muted hover:text-red-400 hover:theme-bg-tertiary rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Megaphone className="w-16 h-16 theme-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold theme-text-primary mb-2">No Ads Found</h3>
              <p className="theme-text-muted mb-4">Start by creating your first advertisement</p>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="px-4 py-2 bg-[#fcd535] text-[#0b0e11] font-medium rounded-lg hover:bg-[#f0b90b] transition-colors"
              >
                Create First Ad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-bg-secondary rounded-2xl border theme-border-primary w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b theme-border-primary flex items-center justify-between sticky top-0 theme-bg-secondary z-10">
              <h3 className="text-lg font-semibold theme-text-primary">
                {editingAd ? 'Edit Ad' : 'Create New Ad'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="theme-text-tertiary hover:theme-text-primary"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Ad Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  placeholder="Enter ad name..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-2">Placement</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as AdPlacement })}
                    className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  >
                    {Object.entries(AD_PLACEMENTS).map(([key, placement]) => (
                      <option key={key} value={key}>
                        {placement.name} ({placement.dimensions})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-2">Ad Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'gif' | 'html' })}
                    className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  >
                    <option value="image">Image (JPG/PNG)</option>
                    <option value="gif">Animated GIF</option>
                    <option value="html">HTML Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  <span className="flex items-center space-x-2">
                    <Image className="w-4 h-4" />
                    <span>Image URL</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  placeholder="https://example.com/ad-image.jpg"
                  required
                />
                <p className="text-xs theme-text-muted mt-1">
                  Recommended size: {AD_PLACEMENTS[formData.placement].dimensions}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  <span className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <span>Target URL</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                  placeholder="https://advertiser-website.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">Priority (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary focus:outline-none focus:border-[#fcd535]/50"
                />
                <p className="text-xs theme-text-muted mt-1">Higher priority ads are shown first</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t theme-border-primary">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2.5 theme-text-tertiary hover:theme-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] font-semibold rounded-xl hover:from-[#f0b90b] hover:to-[#d4a00a] transition-all flex items-center space-x-2"
                >
                  {editingAd ? (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Update Ad</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Ad</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsManagement;

