import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import fileRoutes from './routes/fileRoutes.js';
import { apiLimiter, errorHandler, notFoundHandler } from './middleware/validation.js';
import { startCleanupService } from './services/cleanupService.js';
import { ensureUploadDir } from './utils/fileUtils.js';
import { downloadFile, previewFile } from './controllers/fileController.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Ensure upload directory exists
ensureUploadDir();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api', fileRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'running',
    message: 'Secure File Sharing API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: {
      upload: 'POST /api/upload',
      files: 'GET /api/files',
      download: 'GET /download/:id',
      info: 'GET /api/file/:id',
      delete: 'DELETE /api/file/:id',
      stats: 'GET /api/stats/dashboard',
      search: 'GET /api/search?query=filename'
    }
  });
});

// Root-level download and preview routes (not under /api)
app.get('/download/:id', downloadFile);
app.get('/preview/:id', previewFile);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start cleanup service
const cleanupIntervalMs = parseInt(process.env.CLEANUP_INTERVAL_MS) || 60000;
startCleanupService(cleanupIntervalMs);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║    Secure File Sharing API - Production Ready         ║
╚════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
✅ Frontend URL: ${FRONTEND_URL}
✅ Node Environment: ${process.env.NODE_ENV || 'production'}
✅ Cleanup Service: Active (${cleanupIntervalMs}ms interval)

📚 API Documentation:
   - Health Check: GET /
   - Upload File: POST /api/upload
   - Get Files: GET /api/files
   - File Info: GET /api/file/:id
   - Download: GET /download/:id
   - Preview: GET /preview/:id
   - Delete: DELETE /api/file/:id
   - Stats: GET /api/stats/dashboard
   - Search: GET /api/search?query=filename

Press Ctrl+C to stop the server
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Unhandled errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
