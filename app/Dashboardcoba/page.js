"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Users, Thermometer, Volume2 } from 'lucide-react';
import Link from "next/link";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [kambingCount, setKambingCount] = useState(30);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [kambingData, setKambingData] = useState([
    { id: 'K001', suhu: '38.5°C', time: '14:32', posisi: 'Standing', durasi: '2h 15m', status: 'Normal' },
    { id: 'K002', suhu: '39.1°C', time: '14:30', posisi: 'Standing', durasi: '1h 45m', status: 'Normal' },
    { id: 'K003', suhu: '37.8°C', time: '14:28', posisi: 'Standing', durasi: '3h 20m', status: 'Normal' },
    { id: 'K004', suhu: '40.2°C', time: '14:25', posisi: 'Sitting', durasi: '0h 45m', status: 'Warning' },
    { id: 'K005', suhu: '38.9°C', time: '14:23', posisi: 'Standing', durasi: '1h 30m', status: 'Normal' }
  ]);

  // Simulasi update realtime
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update data kambing secara random
      setKambingData(prev => prev.map(item => ({
        ...item,
        suhu: `${(37 + Math.random() * 3).toFixed(1)}°C`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: Math.random() > 0.8 ? 'Warning' : 'Normal'
      })));
      
      // Update jumlah kambing
      setKambingCount(prev => Math.max(25, Math.min(35, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const StatusCard = ({ title, value, icon: Icon, status = 'normal' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-yellow-800 mb-1">{title}</p>
          <p className="text-2xl font-bold text-yellow-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${status === 'warning' ? 'bg-red-100' : 'bg-green-100'}`}>
          <Icon className={`w-6 h-6 ${status === 'warning' ? 'text-red-600' : 'text-green-600'}`} />
        </div>
      </div>
      <div className="mt-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === 'warning' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {status === 'warning' ? 'Perlu Perhatian' : 'Normal'}
        </span>
      </div>
    </div>
  );

  const DataTable = ({ data }) => (
    <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-900">Data Kambing</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-yellow-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Suhu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Posisi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Durasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-yellow-100">
            {data.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.suhu}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.posisi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.durasi}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Warning' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const LiveCamera = () => (
    <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-900">Live Camera</h3>
      </div>
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Camera Feed</p>
          <div className="flex items-center justify-center mt-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-gray-600">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Komponen Sidebar
  const Sidebar = () => {
    const menuItems = [
      { name: 'Dashboard', href: '/Dashboardcoba' },
      { name: 'Data Kambing', href: '/DataKambing' },
      { name: 'Data THI', href: '/DataTHI' },
      { name: 'Data Suara', href: '/DataSuara' },
      { name: 'Profile', href: '/Profile' }
    ];

    return (
      <div className="fixed left-0 top-0 h-full w-64 bg-yellow-800 text-white shadow-lg z-10">
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-yellow-900">Dashboard</h2>
            <div className="text-sm text-yellow-700">
              Last updated: {currentTime.toLocaleTimeString('id-ID')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {currentTime.toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatusCard
            title="Kambing"
            value={kambingCount}
            icon={Users}
            status="normal"
          />
          <StatusCard
            title="THI"
            value="Normal"
            icon={Thermometer}
            status="normal"
          />
          <StatusCard
            title="Suara"
            value="Normal"
            icon={Volume2}
            status="normal"
          />
        </div>

        {/* Live Camera */}
        <div className="mb-8">
          <LiveCamera />
        </div>

        {/* Data Table */}
        <DataTable data={kambingData} />
      </div>
    </div>
  );
};

export default Dashboard;