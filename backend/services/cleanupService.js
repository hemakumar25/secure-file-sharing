import { deleteFile } from '../utils/fileUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let files = {}; // In-memory file storage
let codes = {}; // Map of code -> fileId

export const fileStore = {
  add: (fileId, fileData) => {
    files[fileId] = fileData;
    // Add code mapping if code exists (store with uppercase key for case-insensitive lookup)
    if (fileData.code) {
      codes[fileData.code.toUpperCase()] = fileId;
    }
  },
  get: (fileId) => {
    return files[fileId];
  },
  getAll: () => {
    return Object.values(files);
  },
  update: (fileId, updates) => {
    if (files[fileId]) {
      const oldCode = files[fileId].code;
      files[fileId] = { ...files[fileId], ...updates };
      // Update code mapping if code changed
      if (oldCode && updates.code && oldCode !== updates.code) {
        delete codes[oldCode];
        codes[updates.code] = fileId;
      } else if (updates.code && !oldCode) {
        codes[updates.code] = fileId;
      }
    }
  },
  delete: (fileId) => {
    const fileData = files[fileId];
    if (fileData && fileData.code) {
      delete codes[fileData.code.toUpperCase()];
    }
    delete files[fileId];
  },
  exists: (fileId) => {
    return fileId in files;
  },
  getByCode: (code) => {
    const fileId = codes[code];
    return fileId ? files[fileId] : null;
  },
  getIdByCode: (code) => {
    return codes[code] || null;
  },
  getAllCodes: () => {
    return Object.keys(codes);
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
