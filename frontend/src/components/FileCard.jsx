import React, { useState } from 'react';
import { FiDownload, FiCopy, FiTrash2, FiEye, FiCheck } from 'react-icons/fi';
import { fileAPI, copyToClipboard } from '../services/api';

const FileCard = ({ file, onDelete }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopyCode = async () => {
    if (file.code) {
      const success = await copyToClipboard(file.code);
      if (success) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${file.originalName}?`)) return;

    setDeleting(true);
    try {
      const result = await fileAPI.deleteFile(file.id);
      if (result.success) {
        onDelete(file.id);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fileAPI.downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '🎬',
      pptx: '🎬',
      xls: '📊',
      xlsx: '📊',
      zip: '📦',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      mp4: '🎥',
      txt: '📃'
    };
    return iconMap[ext] || '📁';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl mt-1 flex-shrink-0">
            {getFileIcon(file.originalName)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-800 truncate text-sm">
              {file.originalName}
            </h3>
            <p className="text-xs text-gray-500">{file.size}</p>
            <p className="text-xs text-gray-400 mt-1">
              Expires: {file.timeString}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="font-semibold text-blue-600 text-sm">
            ⬇️ {file.downloads}
          </p>
        </div>
      </div>

      {/* Code Display */}
      {file.code && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-700 mb-1">Share Code</p>
            <p className="font-mono font-bold text-blue-600 tracking-widest text-lg">
              {file.code}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className={`p-2 rounded transition flex-shrink-0 ${
              copiedCode
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            title="Copy code"
          >
            {copiedCode ? <FiCheck size={18} /> : <FiCopy size={18} />}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          title="Download file"
        >
          <FiDownload size={16} />
          <span className="hidden sm:inline">Download</span>
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete file"
        >
          <FiTrash2 size={16} />
          <span className="hidden sm:inline">
            {deleting ? 'Deleting...' : 'Delete'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FileCard;
