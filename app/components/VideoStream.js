import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const VideoStream = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="lg:col-span-2"
    >
      <div className="card-container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-800 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-green-600" />
            Live Camera Feed
          </h2>
          <div className="live-indicator">
            <div className="live-dot"></div>
            <span className="text-sm text-amber-600">LIVE</span>
          </div>
        </div>
        <div className="video-container">
          <div className="video-placeholder">
            <Eye className="w-12 h-12 text-amber-400 mx-auto mb-2" />
            <p className="text-amber-600 font-medium">Camera Stream Placeholder</p>
            <p className="text-sm text-amber-500">Kamera kandang kambing akan ditampilkan di sini</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoStream;