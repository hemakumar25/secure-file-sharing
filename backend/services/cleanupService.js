import { deleteFile } from '../utils/fileUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let files = {}; // In-memory file storage

export const fileStore = {
  add: (fileId, fileData) => {
    files[fileId] = fileData;
  },
  get: (fileId) => {
    return files[fileId];
  },
  getAll: () => {
    return Object.values(files);
  },
  update: (fileId, updates) => {
    if (files[fileId]) {
      files[fileId] = { ...files[fileId], ...updates };
    }
  },
  delete: (fileId) => {
    delete files[fileId];
  },
  exists: (fileId) => {
    return fileId in files;
  }
};

export const startCleanupService = (intervalMs = 60000) => {
  console.log(`Cleanup service started (interval: ${intervalMs}ms)`);

  const cleanupInterval = setInterval(() => {
    const now = new Date();
    const expiredFiles = [];

    for (const [fileId, fileData] of Object.entries(files)) {
      if (fileData.expiresAt < now) {
        expiredFiles.push(fileId);
      }
    }

    if (expiredFiles.length > 0) {
      expiredFiles.forEach((fileId) => {
        const fileData = files[fileId];
        const filePath = path.join(__dirname, '../uploads', fileData.filename);

        deleteFile(filePath);
        delete files[fileId];

        console.log(`[Cleanup] Deleted expired file: ${fileId} (${fileData.originalName})`);
      });

      console.log(`[Cleanup] Removed ${expiredFiles.length} expired file(s)`);
    }
  }, intervalMs);

  return cleanupInterval;
};

export const getDashboardStats = () => {
  const now = new Date();
  const allFiles = Object.values(files);

  const stats = {
    totalUploaded: allFiles.length,
    totalDownloads: allFiles.reduce((sum, file) => sum + file.downloads, 0),
    activeFiles: allFiles.filter(file => file.expiresAt > now).length,
    expiredFiles: allFiles.filter(file => file.expiresAt <= now).length
  };

  return stats;
};
