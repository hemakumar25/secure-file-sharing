import React, { useState, useEffect } from 'react';
import { FiUpload, FiDownload, FiArchive, FiClock } from 'react-icons/fi';
import { fileAPI } from '../services/api';

const DashboardCards = () => {
  const [stats, setStats] = useState({
    totalUploaded: 0,
    totalDownloads: 0,
    activeFiles: 0,
    expiredFiles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const result = await fileAPI.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Uploaded',
      value: stats.totalUploaded,
      icon: FiUpload,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads,
      icon: FiDownload,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Files',
      value: stats.activeFiles,
      icon: FiArchive,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Expired Files',
      value: stats.expiredFiles,
      icon: FiClock,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`${card.textColor} opacity-20`}>
                <Icon size={32} />
              </div>
            </div>
            <div className={`bg-gradient-to-r ${card.color} h-1 rounded-full mt-4 opacity-30`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
