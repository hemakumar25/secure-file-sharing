import React from 'react';
import { FiShare2, FiHome, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition">
          <FiShare2 size={28} />
          <span className="hidden sm:inline">SecureShare</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition font-medium"
          >
            <FiHome size={20} />
            <span className="hidden sm:inline">Send</span>
          </Link>

          <Link
            to="/receive"
            className="flex items-center gap-2 hover:opacity-80 transition font-medium"
          >
            <FiDownload size={20} />
            <span className="hidden sm:inline">Receive</span>
          </Link>

          <a
            href="https://github.com/yourusername/secure-file-sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:opacity-80 transition hidden sm:inline"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
