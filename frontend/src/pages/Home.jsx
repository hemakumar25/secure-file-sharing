import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import UploadBox from '../components/UploadBox';
import DashboardCards from '../components/DashboardCards';
import FileCard from '../components/FileCard';
import SearchBar from '../components/SearchBar';
import { fileAPI } from '../services/api';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    try {
      const result = await fileAPI.getAllFiles();
      if (result.success) {
        setFiles(result.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData.fileData);
    fetchFiles();

    // Show success toast and clear after 5 seconds
    setTimeout(() => setUploadedFile(null), 5000);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleDelete = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
    if (searchResults) {
      setSearchResults(searchResults.filter(f => f.id !== fileId));
    }
  };

  const displayFiles = searchResults !== null ? searchResults : files;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Files Instantly
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            No login required. Generate shareable links in seconds.
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <UploadBox onUploadSuccess={handleUploadSuccess} />

        {uploadedFile && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center">
              ✅ File uploaded successfully! Share the link below.
            </p>
            <div className="mt-2 p-3 bg-white rounded border border-green-300 font-mono text-sm break-all text-center text-gray-700">
              {window.location.origin}/download/{uploadedFile.id}
            </div>
          </div>
        )}
      </section>

      {/* Dashboard Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <DashboardCards />
        </div>
      </section>

      {/* Files Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchResults !== null ? 'Search Results' : 'Recent Files'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {displayFiles.length} file{displayFiles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 mb-6">
            <FiAlertCircle className="text-red-600" size={20} />
            <span className="text-red-700">{error}</span>
            <button
              onClick={fetchFiles}
              className="ml-auto px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center gap-2"
            >
              <FiRefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {loading && !uploadedFile ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading files...</p>
          </div>
        ) : displayFiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchResults !== null
                ? 'No files found matching your search'
                : 'No files uploaded yet. Upload one to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2024 SecureShare. Built with React + Node.js</p>
          <p className="text-sm mt-2">
            Share securely. Files auto-delete after 24 hours.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
