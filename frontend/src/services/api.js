import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://secure-file-sharing-g5mu.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API calls for file operations
export const fileAPI = {
  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          return percentCompleted;
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Get all active files
  getAllFiles: async () => {
    try {
      const response = await api.get('/api/files');
      return response.data;
    } catch (error) {
      console.error('Get files error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Get file info by ID
  getFileInfo: async (fileId) => {
    try {
      const response = await api.get(`/api/file/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Get file info error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Download file
  downloadFile: async (fileId) => {
    try {
      const response = await api.get(`/download/${fileId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Download error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/api/file/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/api/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Get file by code
  getFileByCode: async (code) => {
    try {
      const response = await api.get(`/api/code/${code.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error('Get file by code error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  },

  // Search files
  searchFiles: async (query) => {
    try {
      const response = await api.get('/api/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  }
};

// Utility functions
export const downloadFileFromBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

export const getDownloadLink = (fileId) => {
  return `${API_URL}/download/${fileId}`;
};

export const getPreviewLink = (fileId) => {
  return `${API_URL}/preview/${fileId}`;
};

export const getShareableLink = (fileId) => {
  return `${window.location.origin}/download/${fileId}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const isImageFile = (mimetype) => {
  return mimetype && mimetype.startsWith('image/');
};

export const isPDFFile = (mimetype) => {
  return mimetype === 'application/pdf';
};

export const getFileIcon = (mimetype) => {
  const iconMap = {
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-powerpoint': '🎬',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '🎬',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'application/zip': '📦',
    'image/png': '🖼️',
    'image/jpeg': '🖼️',
    'video/mp4': '🎥',
    'text/plain': '📃'
  };
  return iconMap[mimetype] || '📁';
};

export default api;
