import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiAlertCircle, FiCheck } from 'react-icons/fi';
import QRCodeComponent from '../components/QRCodeComponent';
import { fileAPI, getShareableLink, copyToClipboard, formatFileSize, isImageFile, isPDFFile } from '../services/api';

const Download = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchFileInfo();
  }, [id]);

  const fetchFileInfo = async () => {
    try {
      const result = await fileAPI.getFileInfo(id);
      if (result.success) {
        setFileData(result.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching file info:', err);
      if (err.message === 'File has expired') {
        setError('This file has expired and is no longer available.');
      } else {
        setError(err.message || 'File not found');
      }
      setFileData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await fileAPI.downloadFile(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh file info to show updated download count
      fetchFileInfo();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const link = getShareableLink(id);
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading file information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium"
          >
            <FiArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <FiAlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              File Not Available
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Upload New File
            </Link>
          </div>
        ) : fileData ? (
          <>
            {/* File Info Card */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">📄</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 break-words">
                    {fileData.originalName}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Size: <span className="font-semibold">{fileData.size}</span>
                  </p>
                </div>
              </div>

              {/* File Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 py-6 border-t border-b border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Downloads</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ⬇️ {fileData.downloads}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Time Remaining</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ⏱️ {fileData.timeRemaining}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Uploaded</p>
                  <p className="text-sm text-gray-700">
                    {new Date(fileData.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full mb-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                <FiDownload size={24} />
                {downloading ? 'Downloading...' : 'Download File'}
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } flex items-center justify-center gap-2`}
              >
                {copied ? (
                  <>
                    <FiCheck size={20} />
                    Link Copied!
                  </>
                ) : (
                  'Copy Share Link'
                )}
              </button>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Share with QR Code
              </h2>
              <div className="flex justify-center">
                <QRCodeComponent
                  fileId={id}
                  downloadLink={getShareableLink(id)}
                />
              </div>
            </div>

            {/* Preview Section */}
            {(fileData.isImage || fileData.isPDF) && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition mb-4"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>

                {showPreview && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 min-h-96 flex items-center justify-center">
                    {fileData.isImage ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/preview/${id}`}
                        alt={fileData.originalName}
                        className="max-w-full max-h-96 object-contain"
                      />
                    ) : (
                      <iframe
                        src={`${import.meta.env.VITE_API_URL}/preview/${id}`}
                        className="w-full h-96"
                        title="PDF Preview"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Download;
