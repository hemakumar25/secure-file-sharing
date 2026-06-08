import React, { useState } from 'react';
import { FiAlertCircle, FiDownload, FiEye, FiCopy, FiCheck } from 'react-icons/fi';
import { fileAPI } from '../services/api';

const ReceiveFile = () => {
  const [code, setCode] = useState('');
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
  };

  const handleRetrieveFile = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    if (code.length !== 6) {
      setError('Code must be 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    setFileData(null);

    try {
      const result = await fileAPI.getFileByCode(code);
      if (result.success) {
        setFileData(result.data);
      } else {
        setError(result.message || 'File not found');
      }
    } catch (err) {
      console.error('Retrieve error:', err);
      setError(err.message || 'Invalid code or file not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileData) return;
    
    setDownloading(true);
    try {
      const blob = await fileAPI.downloadFile(fileData.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.originalName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = () => {
    if (!fileData) return;
    const previewUrl = `${window.location.origin}/preview/${fileData.id}`;
    window.open(previewUrl, '_blank');
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Receive File
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Enter the code to download the file
          </p>
        </div>
      </section>

      {/* Code Input Section */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleRetrieveFile} className="bg-white p-8 rounded-lg shadow-lg">
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-3">
            Enter File Code
          </label>
          <div className="flex gap-2 mb-4">
            <input
              id="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="e.g., ABC123"
              maxLength="6"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase font-mono text-lg tracking-widest text-center"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
            >
              {loading ? 'Searching...' : 'Retrieve'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <FiAlertCircle size={20} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </section>

      {/* File Display Section */}
      {fileData && (
        <section className="max-w-2xl mx-auto px-4 pb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">📄</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{fileData.originalName}</h3>
                  <p className="text-sm text-gray-600">{fileData.size}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-700">Downloads</p>
                  <p>{fileData.downloads}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Time Remaining</p>
                  <p>{fileData.timeRemaining}</p>
                </div>
              </div>
            </div>

            {/* Code Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-700 mb-2">File Code</p>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-white rounded border border-blue-300 font-mono text-lg font-bold text-blue-600 tracking-widest">
                  {fileData.code}
                </div>
                <button
                  onClick={copyCodeToClipboard}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  title="Copy code"
                >
                  {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`flex-1 py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                  downloading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                }`}
              >
                <FiDownload size={20} />
                {downloading ? 'Downloading...' : 'Download File'}
              </button>

              {fileData.isImage && (
                <button
                  onClick={handlePreview}
                  className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300 active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiEye size={20} />
                  Preview
                </button>
              )}
            </div>

            {fileData.isPDF && (
              <p className="text-sm text-blue-600 text-center mt-3">
                💡 Tip: Click Preview to view the PDF in your browser
              </p>
            )}
          </div>

          {/* File Details */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Uploaded: {new Date(fileData.uploadedAt).toLocaleString()}</p>
            <p>Expires: {new Date(fileData.expiresAt).toLocaleString()}</p>
          </div>
        </section>
      )}

      {!fileData && !error && (
        <section className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg">
              Enter a code above to retrieve the file
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReceiveFile;
