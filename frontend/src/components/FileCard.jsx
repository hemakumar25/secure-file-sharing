import React, { useState } from 'react';
import { FiDownload, FiCopy, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';
import { fileAPI, copyToClipboard, getShareableLink } from '../services/api';

const FileCard = ({ file, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopyLink = async () => {
    const link = getShareableLink(file.id);
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
          }`}
          title="Copy link"
        >
          <FiCopy size={16} />
          <span className="hidden sm:inline">
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>

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
