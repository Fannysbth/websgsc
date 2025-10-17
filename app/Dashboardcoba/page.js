"use client";

import React, { useState, useEffect } from 'react';
import { Users, Thermometer, Volume2 } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from "next/link";
import io from 'socket.io-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");

const DashboardCharts = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sensorData, setSensorData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [jetsonData, setJetsonData] = useState([]);

  const fetchChartData = async () => {
    try {
      const [sensorRes, audioRes, jetsonRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/chart/sensors`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/chart/audio`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/chart/jetson`),
      ]);

      const sensorJson = await sensorRes.json();
      const audioJson = await audioRes.json();
      const jetsonJson = await jetsonRes.json();

      if (sensorJson.success) setSensorData(sensorJson.data.reverse());
      if (audioJson.success) setAudioData(audioJson.data.reverse());
      if (jetsonJson.success) setJetsonData(jetsonJson.data.reverse());
    } catch (err) {
      console.error("❌ Error fetching chart data:", err);
    }
  };

  useEffect(() => {
    fetchChartData();

    socket.on('sensors', (data) => setSensorData(prev => [...prev.slice(-49), data]));
    socket.on('audio', (data) => setAudioData(prev => [...prev.slice(-49), data]));
    socket.on('jetson', (data) => setJetsonData(prev => [...prev.slice(-49), data]));

    return () => {
      socket.off('sensors');
      socket.off('audio');
      socket.off('jetson');
    };
  }, []);

  // --- Total kambing ---
  const allGoats = [...new Set(jetsonData.map(d => d.data?.id || d.sensorId))].filter(Boolean);
  const totalGoats = allGoats.length;

  // --- Hanya kambing sitting ---
  const sittingGoats = [...new Set(jetsonData.filter(d => d.data?.current_posture === 'sitting').map(d => d.data?.id || d.sensorId))];

  const sittingDurationPerGoat = sittingGoats.map(id => {
    const records = jetsonData.filter(d => (d.data?.id || d.sensorId) === id);
    let duration = 0;
    for (let i = 1; i < records.length; i++) {
      const prev = records[i - 1];
      const curr = records[i];
      const prevTime = new Date(prev.data?.timestamp || prev.createdAt).getTime();
      const currTime = new Date(curr.data?.timestamp || curr.createdAt).getTime();
      if (prev.data?.current_posture === 'sitting') {
        duration += (currTime - prevTime) / 1000; // detik
      }
    }
    // Jika cuma 1 record sitting
    if (records.length === 1 && records[0].data?.current_posture === 'sitting') {
      duration = 1;
    }
    return duration;
  });



  const latestSensor = sensorData[sensorData.length - 1] || {};
  const latestAudio = audioData[audioData.length - 1] || {};

  // --- Perbaikan StatusCard ---
const StatusCard = ({ title, value, icon: Icon, status = 'normal', className }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-yellow-100 p-6 hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-yellow-800 mb-1">{title}</p>
        <p className="text-2xl font-bold text-yellow-900">{value}</p>
      </div>
      {Icon && (
        <div className={`p-3 rounded-full ${status === 'warning' ? 'bg-red-100' : 'bg-green-100'}`}>
          <Icon className={`w-6 h-6 ${status === 'warning' ? 'text-red-600' : 'text-green-600'}`} />
        </div>
      )}
    </div>
    <div className="mt-2">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        status === 'warning' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        {status === 'warning' ? 'Perlu Perhatian' : 'Normal'}
      </span>
    </div>
  </div>
);


  const Sidebar = () => {
    const menuItems = [
      { name: 'Dashboard', href: '/Dashboardcoba' },
      { name: 'Data Kambing', href: '/DataKambing' },
      { name: 'Data THI', href: '/DataTHI' },
      { name: 'Data Suara', href: '/DataSuara' },
      { name: 'Profile', href: '/Profile' }
    ];
    return (
      <div className="fixed left-0 top-0 h-full w-64 bg-[#004b00] text-white shadow-lg z-10">
        <div className="p-6 border-b border-yellow-700">
          <h1 className="text-2xl font-bold text-yellow-100">SCSC</h1>
          <p className="text-sm text-yellow-300 mt-1">Monitoring System</p>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveMenu(item.name)}
              className={`block px-6 py-3 cursor-pointer transition-colors ${
                activeMenu === item.name
                  ? "bg-yellow-900 border-r-4 border-yellow-400 text-yellow-100"
                  : "text-yellow-200 hover:bg-yellow-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-yellow-25">
      <Sidebar />
      <div className="ml-64 p-8">
        <h2 className="text-3xl font-bold text-yellow-900 mb-6">Dashboard</h2>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
  <StatusCard className="w-80" title="Total Kambing" value={totalGoats} icon={Users} />
  <StatusCard className="w-80" title="THI Terakhir" value={latestSensor.data?.thi ?? 0} icon={Thermometer} status={latestSensor.data?.thi > 75 ? 'warning' : 'normal'} />
  <StatusCard className="w-80" title="Frekuensi Terakhir" value={latestAudio.data?.db_level ?? 0} icon={Volume2} status={latestAudio.data?.db_level > 70 ? 'warning' : 'normal'} />
</div>


        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">THI Chart</h3>
            <Line
              data={{
                labels: sensorData.map(d => new Date(d.createdAt || d.data?.timestamp).toLocaleTimeString()),
                datasets: [
                  {
                    label: 'THI',
                    data: sensorData.map(d => d.data?.thi ?? 0),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                  }
                ]
              }}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Audio Chart</h3>
            <Line
              data={{
                labels: audioData.map(d => new Date(d.createdAt || d.data?.timestamp).toLocaleTimeString()),
                datasets: [
                  {
                    label: 'Frekuensi (dB)',
                    data: audioData.map(d => d.data?.db_level ?? 0),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  }
                ]
              }}
            />
          </div>

          


        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
