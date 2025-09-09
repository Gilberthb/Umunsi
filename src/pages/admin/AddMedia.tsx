import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  File,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Tag,
  Globe,
  Lock,
  Star,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  category: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  isFeatured: boolean;
}

const AddMedia: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    return File;
  };

  const getFileCategory = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'images';
    if (mimeType.startsWith('video/')) return 'videos';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'documents';
    return 'other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    const invalidFiles: { name: string; reason: string }[] = [];

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isDocument = file.type === 'application/pdf' || 
                        file.type.startsWith('text/') || 
                        file.type === 'application/json' || 
                        file.type === 'application/xml' ||
                        file.type.includes('document');
      
      if (isImage && file.size > 3 * 1024 * 1024) { // 3MB for images
        invalidFiles.push({ name: file.name, reason: 'Image file size cannot exceed 3MB' });
      } else if (isVideo && file.size > 20 * 1024 * 1024) { // 20MB for videos
        invalidFiles.push({ name: file.name, reason: 'Video file size cannot exceed 20MB' });
      } else if (isDocument && file.size > 10 * 1024 * 1024) { // 10MB for documents
        invalidFiles.push({ name: file.name, reason: 'Document file size cannot exceed 10MB' });
      } else {
        validFiles.push(file);
      }
    });

    // Show error message for invalid files
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles.map(f => `${f.name}: ${f.reason}`).join('\n');
      alert(`Some files were rejected:\n${errorMessage}`);
    }

    // Process valid files
    if (validFiles.length > 0) {
      const newFiles: UploadedFile[] = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'pending',
        category: getFileCategory(file.type),
        description: '',
        tags: [],
        isPublic: true,
        isFeatured: false
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const updateFileProperty = (id: string, property: keyof UploadedFile, value: any) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === id ? { ...file, [property]: value } : file
    ));
  };

  const addTag = (fileId: string) => {
    if (newTag.trim()) {
      updateFileProperty(fileId, 'tags', [...uploadedFiles.find(f => f.id === fileId)?.tags || [], newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      const newTags = file.tags.filter((_, index) => index !== tagIndex);
      updateFileProperty(fileId, 'tags', newTags);
    }
  };

  const uploadFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    // Add files to FormData
    uploadedFiles.forEach(file => {
      formData.append('files', file.file);
    });

    try {
      // Update status to uploading
      setUploadedFiles(prev => prev.map(file => ({ ...file, status: 'uploading', progress: 50 })));

      const response = await apiClient.uploadMediaFiles(formData);
      
      // Update status to success
      setUploadedFiles(prev => prev.map(file => ({ ...file, status: 'success', progress: 100 })));

      // Update file metadata for each uploaded file
      for (let i = 0; i < response.length; i++) {
        const uploadedFile = uploadedFiles[i];
        const serverFile = response[i];
        
        if (uploadedFile.description || uploadedFile.tags.length > 0 || !uploadedFile.isPublic || uploadedFile.isFeatured) {
          try {
            await apiClient.updateMediaFile(serverFile.id, {
              description: uploadedFile.description,
              tags: uploadedFile.tags,
              isPublic: uploadedFile.isPublic,
              isFeatured: uploadedFile.isFeatured,
              category: uploadedFile.category
            });
          } catch (updateError) {
            console.error('Error updating file metadata:', updateError);
            // Continue with other files even if one fails
          }
        }
      }

      // Navigate to media library after successful upload
      setTimeout(() => {
        navigate('/admin/media/library');
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => prev.map(file => ({ 
        ...file, 
        status: 'error', 
        error: 'Upload failed' 
      })));
    } finally {
      setIsUploading(false);
    }
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/media/library')}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Media Files</h1>
              <p className="text-gray-600 mt-1">Upload and manage your media files</p>
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="flex items-center space-x-3">
              <button
                onClick={clearAllFiles}
                className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={uploadFiles}
                disabled={isUploading || uploadedFiles.some(f => f.status === 'error')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      {uploadedFiles.length === 0 && (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-gray-600 mb-2">
            Support for images, videos, documents (PDF, TXT, JSON, XML), and audio files
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Max file sizes: Images (3MB), Videos (20MB), Documents (10MB)
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Select Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file.file.type);
            return (
              <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {file.file.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.file.size)} • {file.category}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === 'success' && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                          {file.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          {file.status === 'uploading' && (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                          )}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {file.status === 'error' && file.error && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                      )}

                      {/* File Settings */}
                      {file.status === 'pending' && (
                        <div className="mt-4 space-y-4">
                          {/* Description */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={file.description}
                              onChange={(e) => updateFileProperty(file.id, 'description', e.target.value)}
                              placeholder="Add a description for this file..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>

                          {/* Tags */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {file.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                  <button
                                    onClick={() => removeTag(file.id, index)}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTag(file.id)}
                                placeholder="Add a tag..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => addTag(file.id)}
                                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {/* Settings */}
                          <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={file.isPublic}
                                onChange={(e) => updateFileProperty(file.id, 'isPublic', e.target.checked)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-xs text-gray-700 flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={file.isFeatured}
                                onChange={(e) => updateFileProperty(file.id, 'isFeatured', e.target.checked)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-xs text-gray-700 flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Summary */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Ready to upload {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Total size: {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.file.size, 0))}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {uploadedFiles.filter(f => f.status === 'success').length > 0 && (
                <span className="text-xs text-green-600">
                  {uploadedFiles.filter(f => f.status === 'success').length} uploaded successfully
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedia;
