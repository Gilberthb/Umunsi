import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download, 
  Trash2, 
  Eye, 
  Edit,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  File,
  Calendar,
  User,
  MoreVertical,
  Plus,
  FolderOpen,
  Star,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';
import { apiClient } from '../../services/api';
import MediaLibraryModal from '../../components/MediaLibraryModal';

// Document Viewer Component
const DocumentViewer: React.FC<{ 
  file: MediaFile; 
  getServerBaseUrl: () => string; 
}> = ({ file, getServerBaseUrl }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${getServerBaseUrl()}${file.url}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document content');
        }
        
        if (file.mimeType.startsWith('text/') || 
            file.mimeType === 'application/json' || 
            file.mimeType === 'application/xml') {
          const text = await response.text();
          setContent(text);
        } else {
          throw new Error('Unsupported document type');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [file.url, file.mimeType, getServerBaseUrl]);

  if (loading) {
    return (
      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading document</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col shadow-lg" style={{ minHeight: '90vh' }}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-gray-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">{file.originalName}</h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
          <a
            href={`${getServerBaseUrl()}${file.url}`}
            download={file.originalName}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-md shadow-sm hover:shadow-md"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6" style={{ minHeight: 'calc(90vh - 80px)' }}>
        {file.mimeType === 'application/json' ? (
          <pre className="text-base text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
            {JSON.stringify(JSON.parse(content), null, 2)}
          </pre>
        ) : file.mimeType === 'application/xml' ? (
          <pre className="text-base text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
            {content}
          </pre>
        ) : (
          <pre className="text-base text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};

// Helper function to get server base URL
const getServerBaseUrl = () => {
  // In development, use relative URLs since Vite proxy handles routing
  if (import.meta.env.DEV) {
    return '';
  }
  // In production, use the full server URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
  return apiUrl.replace('/api', '');
};

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  description?: string;
  uploadedBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isFeatured: boolean;
}

const MediaLibrary: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [selectedMediaFile, setSelectedMediaFile] = useState<MediaFile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'documents', label: 'Documents' },
    { value: 'audio', label: 'Audio' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMediaFiles();
      setMediaFiles(response || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    try {
      setUploading(true);
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      await apiClient.uploadMediaFiles(formData);
      await fetchMediaFiles();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFiles = async (fileIds: string[]) => {
    setFilesToDelete(fileIds);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.deleteMediaFiles(filesToDelete);
      await fetchMediaFiles();
      setSelectedFiles([]);
      setShowDeleteConfirm(false);
      setFilesToDelete([]);
    } catch (error) {
      console.error('Error deleting files:', error);
      setShowDeleteConfirm(false);
      setFilesToDelete([]);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFilesToDelete([]);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text') || 
        mimeType === 'application/json' || mimeType === 'application/xml') return FileText;
    return File;
  };

  const isDocument = (mimeType: string) => {
    return mimeType === 'application/pdf' || 
           mimeType.startsWith('text/') || 
           mimeType === 'application/json' || 
           mimeType === 'application/xml' ||
           mimeType.includes('document');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  const handleMediaItemClick = (file: MediaFile, e: React.MouseEvent) => {
    // Don't open modal if clicking on selection checkbox or action buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    
    setSelectedMediaFile(file);
    setShowFullscreenModal(true);
  };

  const closeFullscreenModal = () => {
    setShowFullscreenModal(false);
    setSelectedMediaFile(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMediaFile) return;
    
    const currentIndex = filteredFiles.findIndex(file => file.id === selectedMediaFile.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredFiles.length - 1;
    } else {
      newIndex = currentIndex < filteredFiles.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedMediaFile(filteredFiles[newIndex]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-1">Manage your media files and assets</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowMediaLibraryModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Browse Library
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.mimeType.startsWith('image/')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.mimeType.startsWith('video/')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.mimeType.includes('pdf') || f.mimeType.includes('document')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-green-800 font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleDeleteFiles(selectedFiles)}
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Files */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first media file to get started'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload Files
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'p-6' : 'p-4'}>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <div
                        key={file.id}
                        className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                          selectedFiles.includes(file.id) 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={(e) => handleMediaItemClick(file, e)}
                      >
                        <div className="aspect-square p-4 flex flex-col items-center justify-center">
                          {file.mimeType.startsWith('image/') ? (
                            <img
                              src={`${getServerBaseUrl()}${file.thumbnailUrl || file.url}`}
                              alt={file.originalName}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                // Fallback to file icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${file.mimeType.startsWith('image/') ? 'hidden' : 'flex'}`}>
                            <FileIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMediaItemClick(file, e);
                            }}
                            className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                            title={isDocument(file.mimeType) ? "Read" : "View"}
                          >
                            {isDocument(file.mimeType) ? (
                              <FileText className="w-3 h-3 text-blue-600" />
                            ) : (
                              <Eye className="w-3 h-3 text-gray-600" />
                            )}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFiles([file.id]);
                            }}
                            className="p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(file.id);
                            }}
                            className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <div
                        key={file.id}
                        className={`flex items-center p-3 rounded-lg border transition-all ${
                          selectedFiles.includes(file.id) 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={(e) => handleMediaItemClick(file, e)}
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 ml-3 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.originalName}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{file.uploadedBy.firstName} {file.uploadedBy.lastName}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMediaItemClick(file, e);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title={isDocument(file.mimeType) ? "Read" : "View"}
                          >
                            {isDocument(file.mimeType) ? (
                              <FileText className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFiles([file.id]);
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Select Files
                </label>
              </div>
              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Uploading files...</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Media Modal */}
      {showFullscreenModal && selectedMediaFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeFullscreenModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredFiles.length > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Media Content */}
            <div className="w-full h-full p-2 flex items-center justify-center">
              {selectedMediaFile.mimeType.startsWith('image/') ? (
                <img
                  src={`${getServerBaseUrl()}${selectedMediaFile.thumbnailUrl || selectedMediaFile.url}`}
                  alt={selectedMediaFile.originalName}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : selectedMediaFile.mimeType.startsWith('video/') ? (
                <video
                  src={`${getServerBaseUrl()}${selectedMediaFile.url}`}
                  controls
                  className="max-w-full max-h-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              ) : selectedMediaFile.mimeType.startsWith('audio/') ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <audio
                    src={`${getServerBaseUrl()}${selectedMediaFile.url}`}
                    controls
                    className="w-full max-w-md"
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              ) : selectedMediaFile.mimeType === 'application/pdf' ? (
                <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg relative">
                  {/* PDF Controls */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={() => {
                        const iframe = document.querySelector('iframe[title="' + selectedMediaFile.originalName + '"]') as HTMLIFrameElement;
                        if (iframe) {
                          const currentSrc = iframe.src;
                          const newSrc = currentSrc.replace(/zoom=\d+/, 'zoom=75');
                          iframe.src = newSrc;
                        }
                      }}
                      className="px-3 py-1 bg-black bg-opacity-50 text-white rounded text-sm hover:bg-opacity-70 transition-all"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <button
                      onClick={() => {
                        const iframe = document.querySelector('iframe[title="' + selectedMediaFile.originalName + '"]') as HTMLIFrameElement;
                        if (iframe) {
                          const currentSrc = iframe.src;
                          const newSrc = currentSrc.replace(/zoom=\d+/, 'zoom=125');
                          iframe.src = newSrc;
                        }
                      }}
                      className="px-3 py-1 bg-black bg-opacity-50 text-white rounded text-sm hover:bg-opacity-70 transition-all"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                  <iframe
                    src={`${getServerBaseUrl()}${selectedMediaFile.url}#toolbar=1&navpanes=1&scrollbar=1&zoom=100`}
                    className="w-full h-full border-0"
                    title={selectedMediaFile.originalName}
                    style={{ minHeight: '90vh' }}
                  />
                </div>
              ) : selectedMediaFile.mimeType.startsWith('text/') || 
                selectedMediaFile.mimeType === 'application/json' ||
                selectedMediaFile.mimeType === 'application/xml' ? (
                <DocumentViewer 
                  file={selectedMediaFile} 
                  getServerBaseUrl={getServerBaseUrl}
                />
              ) : (
                <div className="bg-white p-8 rounded-lg text-center max-w-md">
                  <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">{selectedMediaFile.originalName}</p>
                  <p className="text-sm text-gray-500 mb-4">{formatFileSize(selectedMediaFile.size)}</p>
                  <a
                    href={`${getServerBaseUrl()}${selectedMediaFile.url}`}
                    download={selectedMediaFile.originalName}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              )}
            </div>

            {/* Media Info - Only show for non-documents */}
            {!isDocument(selectedMediaFile.mimeType) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedMediaFile.originalName}</h3>
                    <p className="text-sm text-gray-300">
                      {formatFileSize(selectedMediaFile.size)} • {selectedMediaFile.category} • 
                      Uploaded by {selectedMediaFile.uploadedBy.firstName} {selectedMediaFile.uploadedBy.lastName}
                    </p>
                    {selectedMediaFile.description && (
                      <p className="text-sm text-gray-300 mt-1">{selectedMediaFile.description}</p>
                    )}
                    {selectedMediaFile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedMediaFile.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-green-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedMediaFile.isFeatured && (
                      <Star className="w-5 h-5 text-yellow-400" />
                    )}
                    {selectedMediaFile.isPublic ? (
                      <Globe className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Media Counter */}
            {filteredFiles.length > 1 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {filteredFiles.findIndex(f => f.id === selectedMediaFile.id) + 1} of {filteredFiles.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete {filesToDelete.length === 1 ? 'File' : 'Files'}
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete {filesToDelete.length === 1 ? 'this file' : `these ${filesToDelete.length} files`}? 
                This will permanently remove {filesToDelete.length === 1 ? 'it' : 'them'} from the server.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete {filesToDelete.length === 1 ? 'File' : 'Files'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibraryModal}
        onClose={() => setShowMediaLibraryModal(false)}
        title="Media Library"
        mode="manage"
        type="all"
      />
    </div>
  );
};

export default MediaLibrary;
