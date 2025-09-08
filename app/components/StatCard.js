import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, unit, colorType = "green" }) => {
  const colorClasses = {
    green: "text-green-600 icon-green",
    amber: "text-amber-600 icon-amber", 
    blue: "text-blue-600 icon-blue",
    red: "text-red-500 icon-red"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-container"
    >
      <div className="stat-card">
        <div>
          <p className="stat-title">{title}</p>
          <p className={`stat-value ${colorClasses[colorType].split(' ')[0]}`}>
            {value} <span className="text-sm font-normal">{unit}</span>
          </p>
        </div>
        <div className={`icon-wrapper ${colorClasses[colorType].split(' ')[1]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[colorType].split(' ')[0]}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;