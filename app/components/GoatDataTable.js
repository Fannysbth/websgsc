import React from 'react';
import { motion } from 'framer-motion';

const GoatDataTable = ({ goatData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="card-container h-fit">
        <h2 className="text-xl font-bold text-amber-800 mb-4">Data Kambing</h2>
        <div className="space-y-3">
          {goatData.map((goat, index) => (
            <motion.div
              key={goat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="goat-card"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-amber-800">{goat.id}</span>
                <span className="text-sm text-red-600 font-medium">
                  {goat.temperature}°C
                </span>
              </div>
              <div className="data-grid">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-amber-700">Duduk: {goat.sitting}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-amber-700">Berdiri: {goat.standing}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GoatDataTable;
