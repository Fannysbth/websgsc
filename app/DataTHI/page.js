"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const DataTHIPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState('Data THI');

  // Dummy data untuk THI
  const [thiData, setThiData] = useState([
    { tanggal: '08/09/2024', time: '14:32:15', suhu: '32.5', kelembapan: '75', thi: '82.3', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:30:22', suhu: '33.2', kelembapan: '78', thi: '84.1', status: 'Moderate' },
    { tanggal: '08/09/2024', time: '14:28:45', suhu: '31.8', kelembapan: '72', thi: '80.5', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:25:18', suhu: '34.5', kelembapan: '82', thi: '87.2', status: 'Stress' },
    { tanggal: '08/09/2024', time: '14:23:33', suhu: '32.9', kelembapan: '76', thi: '83.1', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:20:10', suhu: '33.8', kelembapan: '80', thi: '85.6', status: 'Moderate' },
    { tanggal: '08/09/2024', time: '14:18:55', suhu: '31.2', kelembapan: '70', thi: '79.8', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:15:40', suhu: '35.1', kelembapan: '85', thi: '89.4', status: 'Danger' },
    { tanggal: '08/09/2024', time: '14:12:25', suhu: '32.1', kelembapan: '73', thi: '81.2', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:10:10', suhu: '33.5', kelembapan: '77', thi: '84.8', status: 'Moderate' }
  ]);

  // Simulasi update realtime
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      setThiData(prev => prev.map(item => {
        const newTemp = (30 + Math.random() * 6).toFixed(1);
        const newHumidity = Math.floor(65 + Math.random() * 25);
        const newTHI = (parseFloat(newTemp) * 1.8 + 32 - (0.55 - 0.0055 * newHumidity) * (parseFloat(newTemp) * 1.8 + 32 - 58)).toFixed(1);
        
        let status = 'Normal';
        if (parseFloat(newTHI) >= 89) {
          status = 'Danger';
        } else if (parseFloat(newTHI) >= 84) {
          status = 'Stress';
        } else if (parseFloat(newTHI) >= 72) {
          status = 'Moderate';
        }

        return {
          ...item,
          time: new Date().toLocaleTimeString('id-ID'),
          suhu: newTemp,
          kelembapan: newHumidity.toString(),
          thi: newTHI,
          status: status
        };
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Danger':
        return 'bg-red-100 text-red-800';
      case 'Stress':
        return 'bg-orange-100 text-orange-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get THI color based on value
  const getTHIColor = (thi) => {
    const thiValue = parseFloat(thi);
    if (thiValue >= 89) return 'text-red-600 font-semibold';
    if (thiValue >= 84) return 'text-orange-600 font-semibold';
    if (thiValue >= 72) return 'text-yellow-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

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

  // Komponen THI Table
  const THITable = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
          <h3 className="text-lg font-semibold text-yellow-900">Data THI (Temperature Humidity Index)</h3>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-600 font-medium">LIVE DATA</span>
          </div>
          <div className="mt-2 text-sm text-yellow-700">
            <p>THI Categories: Normal (&lt;72) | Moderate (72-83) | Stress (84-88) | Danger (≥89)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-yellow-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Suhu (°C)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Kelembapan (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">THI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100">
              {thiData.map((item, index) => (
                <tr key={`${item.tanggal}-${item.time}-${index}`} className={`${index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.suhu}°C</td>
                  <td className="px-15 py-4 whitespace-nowrap text-sm text-gray-700">{item.kelembapan}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-bold ${getTHIColor(item.thi)}`}>
                      {item.thi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-yellow-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Total records: <span className="font-medium text-gray-900">{thiData.length}</span>
            </span>
            <div className="flex space-x-4">
              <span className="text-red-600">
                Danger: <span className="font-medium">{thiData.filter(item => item.status === 'Danger').length}</span>
              </span>
              <span className="text-orange-600">
                Stress: <span className="font-medium">{thiData.filter(item => item.status === 'Stress').length}</span>
              </span>
              <span className="text-yellow-600">
                Moderate: <span className="font-medium">{thiData.filter(item => item.status === 'Moderate').length}</span>
              </span>
              <span className="text-green-600">
                Normal: <span className="font-medium">{thiData.filter(item => item.status === 'Normal').length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stats Cards Component
  const StatsCards = () => {
    const averageTHI = (thiData.reduce((sum, item) => sum + parseFloat(item.thi), 0) / thiData.length).toFixed(1);
    const averageTemp = (thiData.reduce((sum, item) => sum + parseFloat(item.suhu), 0) / thiData.length).toFixed(1);
    const averageHumidity = Math.round(thiData.reduce((sum, item) => sum + parseInt(item.kelembapan), 0) / thiData.length);
    const dangerCount = thiData.filter(item => item.status === 'Danger' || item.status === 'Stress').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Avg THI</p>
              <p className={`text-2xl font-bold ${getTHIColor(averageTHI)}`}>{averageTHI}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Avg Suhu</p>
              <p className="text-2xl font-bold text-yellow-900">{averageTemp}°C</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <div className="w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Avg Kelembapan</p>
              <p className="text-2xl font-bold text-yellow-900">{averageHumidity}%</p>
            </div>
            <div className="p-3 rounded-full bg-cyan-100">
              <div className="w-6 h-6 bg-cyan-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Alert Status</p>
              <p className="text-2xl font-bold text-yellow-900">{dangerCount}</p>
            </div>
            <div className={`p-3 rounded-full ${dangerCount > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <div className={`w-6 h-6 rounded-full ${dangerCount > 0 ? 'bg-red-600' : 'bg-green-600'}`}></div>
            </div>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              dangerCount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {dangerCount > 0 ? 'Perlu Perhatian' : 'Kondisi Baik'}
            </span>
          </div>
        </div>
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
            <h2 className="text-3xl font-bold text-yellow-900">Data THI</h2>
            <div className="text-sm text-yellow-700">
              <div>Last updated: {currentTime.toLocaleTimeString('id-ID')}</div>
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
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* THI Data Table */}
        <div className="mb-8">
          <THITable />
        </div>
      </div>
    </div>
  );
};

export default DataTHIPage;