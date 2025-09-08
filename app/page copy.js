"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Volume2,
  Activity,
  TrendingUp,
} from "lucide-react";


import StatCard from "../components/StatCard";
import VideoStream from "../components/VideoStream";
import GoatDataTable from "../components/GoatDataTable";
import EnvironmentSensors from "../components/EnvironmentSensors";
import NotificationBadge from "../components/NotificationBadge";

import { useRealtimeData } from "../hooks/useRealtimeData";
import { calculateSummaryStats } from "../utils/calculations";

const Dashboard = () => {
  const { goatData, environmentData, notifications, lastUpdate } = useRealtimeData();
  const { avgSitting, avgStanding, avgTemperature } = calculateSummaryStats(goatData);

  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    if (lastUpdate) {
      setTimeString(lastUpdate.toLocaleTimeString());
    }
  }, [lastUpdate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">
            Dashboard IoT Deteksi Perilaku Kambing
          </h1>
          <p className="dashboard-subtitle">
            Pemantauan realtime • Terakhir diperbarui: {timeString}
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <StatCard
            icon={Activity}
            title="Rata-rata Duduk"
            value={avgSitting}
            unit="kali"
            colorType="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Rata-rata Berdiri"
            value={avgStanding}
            unit="kali"
            colorType="green"
          />
          <StatCard
            icon={Thermometer}
            title="THI Index"
            value={environmentData.thi}
            unit=""
            colorType="amber"
          />
          <StatCard
            icon={Volume2}
            title="Notifikasi Suara"
            value={notifications}
            unit="total"
            colorType="blue"
          />
          <StatCard
            icon={Thermometer}
            title="Rata-rata Suhu"
            value={avgTemperature}
            unit="°C"
            colorType="red"
          />
        </div>

        {/* Main Content */}
        <div className="main-grid">
          <VideoStream />
          <GoatDataTable goatData={goatData} />
        </div>

        {/* Environment Sensors */}
        <EnvironmentSensors environmentData={environmentData} />

        {/* Notification Badge */}
        <NotificationBadge notifications={notifications} />
      </div>
    </div>
  );
};

export default Dashboard;
