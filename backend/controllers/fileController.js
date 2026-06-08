import { v4 as uuidv4 } from 'uuid';
import { calculateExpiryTime, formatFileSize, getTimeRemaining } from '../utils/fileUtils.js';
import { fileStore, getDashboardStats } from '../services/cleanupService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileId = uuidv4();
    const expiryHours = parseInt(process.env.FILE_EXPIRY_HOURS) || 24;
    const now = new Date();
    const expiresAt = calculateExpiryTime(now, expiryHours);

    const fileData = {
      id: fileId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: now,
      expiresAt: expiresAt,
      downloads: 0,
      downloadUrl: `/download/${fileId}`
    };

    fileStore.add(fileId, fileData);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileId: fileId,
      downloadUrl: `/download/${fileId}`,
      expiresAt: expiresAt,
      fileData: fileData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

export const getAllFiles = (req, res) => {
  try {
    const now = new Date();
    const allFiles = fileStore.getAll();

    // Filter active files (not expired)
    const activeFiles = allFiles
      .filter(file => file.expiresAt > now)
      .map(file => ({
        id: file.id,
        originalName: file.originalName,
        size: formatFileSize(file.size),
        uploadedAt: file.uploadedAt,
        expiresAt: file.expiresAt,
        downloads: file.downloads,
        downloadUrl: file.downloadUrl,
        ...getTimeRemaining(file.expiresAt)
      }))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.status(200).json({
      success: true,
      data: activeFiles,
      count: activeFiles.length
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error.message
    });
  }
};

export const getFileInfo = (req, res) => {
  try {
    const { id } = req.params;

    if (!fileStore.exists(id)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const fileData = fileStore.get(id);
    const now = new Date();

    // Check if file is expired
    if (fileData.expiresAt < now) {
      return res.status(410).json({
        success: false,
        message: 'File has expired'
      });
    }

    const timeRemaining = getTimeRemaining(fileData.expiresAt);

    res.status(200).json({
      success: true,
      data: {
        id: fileData.id,
        originalName: fileData.originalName,
        size: formatFileSize(fileData.size),
        uploadedAt: fileData.uploadedAt,
        expiresAt: fileData.expiresAt,
        downloads: fileData.downloads,
        timeRemaining: timeRemaining.timeString,
        mimetype: fileData.mimetype,
        isImage: fileData.mimetype.startsWith('image/'),
        isPDF: fileData.mimetype === 'application/pdf'
      }
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file info',
      error: error.message
    });
  }
};

export const downloadFile = (req, res) => {
  try {
    const { id } = req.params;

    if (!fileStore.exists(id)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const fileData = fileStore.get(id);
    const now = new Date();

    // Check if file is expired
    if (fileData.expiresAt < now) {
      return res.status(410).json({
        success: false,
        message: 'File has expired'
      });
    }

    const filePath = path.join(__dirname, '../uploads', fileData.filename);

    // Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Increment download counter
    fileStore.update(id, { downloads: fileData.downloads + 1 });

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
    res.setHeader('Content-Type', fileData.mimetype);
    res.setHeader('Content-Length', fileData.size);

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading file'
        });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Download failed',
        error: error.message
      });
    }
  }
};

export const previewFile = (req, res) => {
  try {
    const { id } = req.params;

    if (!fileStore.exists(id)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const fileData = fileStore.get(id);
    const now = new Date();

    // Check if file is expired
    if (fileData.expiresAt < now) {
      return res.status(410).json({
        success: false,
        message: 'File has expired'
      });
    }

    const filePath = path.join(__dirname, '../uploads', fileData.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set headers for inline preview
    res.setHeader('Content-Type', fileData.mimetype);
    res.setHeader('Content-Length', fileData.size);

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error previewing file'
        });
      }
    });
  } catch (error) {
    console.error('Preview error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Preview failed',
        error: error.message
      });
    }
  }
};

export const deleteFile = (req, res) => {
  try {
    const { id } = req.params;

    if (!fileStore.exists(id)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const fileData = fileStore.get(id);
    const filePath = path.join(__dirname, '../uploads', fileData.filename);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from store
    fileStore.delete(id);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      deletedFile: fileData.originalName
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

export const getStats = (req, res) => {
  try {
    const stats = getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

export const searchFiles = (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const now = new Date();
    const searchTerm = query.toLowerCase();
    const allFiles = fileStore.getAll();

    const results = allFiles
      .filter(file => file.expiresAt > now)
      .filter(file =>
        file.originalName.toLowerCase().includes(searchTerm)
      )
      .map(file => ({
        id: file.id,
        originalName: file.originalName,
        size: formatFileSize(file.size),
        uploadedAt: file.uploadedAt,
        expiresAt: file.expiresAt,
        downloads: file.downloads,
        downloadUrl: file.downloadUrl,
        ...getTimeRemaining(file.expiresAt)
      }))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};
