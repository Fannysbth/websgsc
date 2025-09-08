import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const NotificationBadge = ({ notifications }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="notification-badge"
    >
      <div className="flex items-center space-x-2">
        <Bell className="w-5 h-5" />
        <span className="font-bold">{notifications}</span>
      </div>
      {notifications > 0 && (
        <div className="notification-alert">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationBadge;