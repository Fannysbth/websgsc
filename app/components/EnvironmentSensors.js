import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Activity, Wind } from 'lucide-react';
import EnvironmentCard from './EnvironmentCard';

const EnvironmentSensors = ({ environmentData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-container"
    >
      <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
        <Wind className="w-5 h-5 mr-2 text-green-600" />
        Sensor Lingkungan
      </h2>
      <div className="environment-grid">
        <EnvironmentCard
          icon={Thermometer}
          label="Suhu Lingkungan"
          value={environmentData.temperature}
          unit="°C"
          bgColor="bg-red-50"
        />
        <EnvironmentCard
          icon={Droplets}
          label="Kelembapan"
          value={environmentData.humidity}
          unit="%"
          bgColor="bg-blue-50"
        />
        <EnvironmentCard
          icon={Activity}
          label="THI Index"
          value={environmentData.thi}
          unit=""
          bgColor="bg-amber-50"
        />
      </div>
    </motion.div>
  );
};

export default EnvironmentSensors;