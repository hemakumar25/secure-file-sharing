import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { fileAPI } from '../services/api';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      onSearch([]);
      return;
    }

    setSearching(true);
    try {
      const result = await fileAPI.searchFiles(query);
      if (result.success) {
        onSearch(result.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      onSearch([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch([]);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files by name..."
          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={20} />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
