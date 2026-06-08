import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadLimiter, validateFileMiddleware } from '../middleware/validation.js';
import {
  uploadFile,
  getAllFiles,
  getFileInfo,
  downloadFile,
  previewFile,
  deleteFile,
  getStats,
  searchFiles
} from '../controllers/fileController.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 104857600 // 100MB
  },
  fileFilter: (req, file, cb) => {
    // Allowed MIME types
    const allowedMimes = [
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

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Routes

// Health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'running',
    message: 'Secure File Sharing API is running',
    timestamp: new Date().toISOString()
  });
});

// Upload file
router.post('/upload', uploadLimiter, upload.single('file'), validateFileMiddleware, uploadFile);

// Get all active files
router.get('/files', getAllFiles);

// Get file info by ID
router.get('/file/:id', getFileInfo);

// Download file
router.get('/download/:id', downloadFile);

// Preview file (inline)
router.get('/preview/:id', previewFile);

// Delete file
router.delete('/file/:id', deleteFile);

// Get dashboard statistics
router.get('/stats/dashboard', getStats);

// Search files
router.get('/search', searchFiles);

export default router;
