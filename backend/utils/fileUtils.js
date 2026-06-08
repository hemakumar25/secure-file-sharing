import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPPORTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'image/png',
  'image/jpeg',
  'video/mp4',
  'text/plain'
];

export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  // Check file type
  if (!SUPPORTED_TYPES.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not supported`);
  }

  // Check file size (100MB max)
  const MAX_SIZE = 104857600; // 100MB
  if (file.size > MAX_SIZE) {
    errors.push(`File size exceeds 100MB limit`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const getFileExtension = (filename) => {
  return path.extname(filename).substring(1).toLowerCase();
};

export const getFileTypeIcon = (mimetype) => {
  const typeMap = {
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

  return typeMap[mimetype] || '📁';
};

export const calculateExpiryTime = (createdAt, expiryHours) => {
  const expiryMs = expiryHours * 60 * 60 * 1000;
  return new Date(createdAt.getTime() + expiryMs);
};

export const getTimeRemaining = (expiryTime) => {
  const now = new Date();
  const remaining = expiryTime.getTime() - now.getTime();

  if (remaining <= 0) {
    return { expired: true, timeString: 'Expired' };
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return {
    expired: false,
    timeString: `${hours}h ${minutes}m`,
    milliseconds: remaining
  };
};

export const ensureUploadDir = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
