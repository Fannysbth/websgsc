"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DataSuaraPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState('Data Suara');

  // Dummy data untuk suara
  const [suaraData, setSuaraData] = useState([
    { tanggal: '08/09/2024', time: '14:32:15', frekuensi: '125', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:30:22', frekuensi: '340', status: 'Tinggi' },
    { tanggal: '08/09/2024', time: '14:28:45', frekuensi: '89', status: 'Rendah' },
    { tanggal: '08/09/2024', time: '14:25:18', frekuensi: '456', status: 'Sangat Tinggi' },
    { tanggal: '08/09/2024', time: '14:23:33', frekuensi: '234', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:20:10', frekuensi: '67', status: 'Rendah' },
    { tanggal: '08/09/2024', time: '14:18:55', frekuensi: '298', status: 'Tinggi' },
    { tanggal: '08/09/2024', time: '14:15:40', frekuensi: '512', status: 'Sangat Tinggi' },
    { tanggal: '08/09/2024', time: '14:12:25', frekuensi: '145', status: 'Normal' },
    { tanggal: '08/09/2024', time: '14:10:10', frekuensi: '178', status: 'Normal' }
  ]);

  // Data untuk grafik
  const [chartData, setChartData] = useState([
    { time: '14:10', frekuensi: 178, threshold: 300 },
    { time: '14:12', frekuensi: 145, threshold: 300 },
    { time: '14:15', frekuensi: 512, threshold: 300 },
    { time: '14:18', frekuensi: 298, threshold: 300 },
    { time: '14:20', frekuensi: 67, threshold: 300 },
    { time: '14:23', frekuensi: 234, threshold: 300 },
    { time: '14:25', frekuensi: 456, threshold: 300 },
    { time: '14:28', frekuensi: 89, threshold: 300 },
    { time: '14:30', frekuensi: 340, threshold: 300 },
    { time: '14:32', frekuensi: 125, threshold: 300 }
  ]);

  // Data untuk bar chart status distribution
  const [statusDistribution, setStatusDistribution] = useState([
    { status: 'Rendah', count: 2, color: '#10B981' },
    { status: 'Normal', count: 4, color: '#3B82F6' },
    { status: 'Tinggi', count: 2, color: '#F59E0B' },
    { status: 'Sangat Tinggi', count: 2, color: '#EF4444' }
  ]);

  // Simulasi update realtime
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      setSuaraData(prev => prev.map(item => {
        const newFrekuensi = Math.floor(50 + Math.random() * 500);
        let status = 'Normal';
        
        if (newFrekuensi < 100) {
          status = 'Rendah';
        } else if (newFrekuensi >= 100 && newFrekuensi < 250) {
          status = 'Normal';
        } else if (newFrekuensi >= 250 && newFrekuensi < 400) {
          status = 'Tinggi';
        } else {
          status = 'Sangat Tinggi';
        }

        return {
          ...item,
          time: new Date().toLocaleTimeString('id-ID'),
          frekuensi: newFrekuensi.toString(),
          status: status
        };
      }));

      // Update chart data
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const newFrekuensi = Math.floor(50 + Math.random() * 500);
        newData.push({
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          frekuensi: newFrekuensi,
          threshold: 300
        });
        return newData;
      });

    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Update status distribution when data changes
  useEffect(() => {
    const rendah = suaraData.filter(item => item.status === 'Rendah').length;
    const normal = suaraData.filter(item => item.status === 'Normal').length;
    const tinggi = suaraData.filter(item => item.status === 'Tinggi').length;
    const sangatTinggi = suaraData.filter(item => item.status === 'Sangat Tinggi').length;

    setStatusDistribution([
      { status: 'Rendah', count: rendah, color: '#10B981' },
      { status: 'Normal', count: normal, color: '#3B82F6' },
      { status: 'Tinggi', count: tinggi, color: '#F59E0B' },
      { status: 'Sangat Tinggi', count: sangatTinggi, color: '#EF4444' }
    ]);
  }, [suaraData]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Sangat Tinggi':
        return 'bg-red-100 text-red-800';
      case 'Tinggi':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      case 'Rendah':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get frequency color
  const getFrequencyColor = (frekuensi) => {
    const freq = parseInt(frekuensi);
    if (freq >= 400) return 'text-red-600 font-semibold';
    if (freq >= 250) return 'text-orange-600 font-semibold';
    if (freq >= 100) return 'text-blue-600 font-semibold';
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


  // Komponen Stats Cards
  const StatsCards = () => {
    const averageFreq = Math.round(suaraData.reduce((sum, item) => sum + parseInt(item.frekuensi), 0) / suaraData.length);
    const maxFreq = Math.max(...suaraData.map(item => parseInt(item.frekuensi)));
    const minFreq = Math.min(...suaraData.map(item => parseInt(item.frekuensi)));
    const alertCount = suaraData.filter(item => item.status === 'Sangat Tinggi' || item.status === 'Tinggi').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Avg Frekuensi</p>
              <p className={`text-2xl font-bold ${getFrequencyColor(averageFreq.toString())}`}>{averageFreq} Hz</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Max Frekuensi</p>
              <p className={`text-2xl font-bold ${getFrequencyColor(maxFreq.toString())}`}>{maxFreq} Hz</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <div className="w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Min Frekuensi</p>
              <p className={`text-2xl font-bold ${getFrequencyColor(minFreq.toString())}`}>{minFreq} Hz</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Alert Count</p>
              <p className="text-2xl font-bold text-yellow-900">{alertCount}</p>
            </div>
            <div className={`p-3 rounded-full ${alertCount > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
              <div className={`w-6 h-6 rounded-full ${alertCount > 0 ? 'bg-orange-600' : 'bg-green-600'}`}></div>
            </div>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              alertCount > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {alertCount > 0 ? 'Ada Gangguan' : 'Kondisi Normal'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Komponen Charts
  const Charts = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Line Chart - Trend Frekuensi */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Trend Frekuensi Suara</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="frekuensi" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Frekuensi (Hz)"
              />
              <Line 
                type="monotone" 
                dataKey="threshold" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Threshold (300 Hz)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        
      </div>
    );
  };

  // Komponen Suara Table
  const SuaraTable = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
          <h3 className="text-lg font-semibold text-yellow-900">Data Suara</h3>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-600 font-medium">LIVE DATA</span>
          </div>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Categories: Rendah (&lt;100Hz) | Normal (100-249Hz) | Tinggi (250-399Hz) | Sangat Tinggi (≥400Hz)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-yellow-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Frekuensi (Hz)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100">
              {suaraData.map((item, index) => (
                <tr key={`${item.tanggal}-${item.time}-${index}`} className={`${index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-bold ${getFrequencyColor(item.frekuensi)}`}>
                      {item.frekuensi} Hz
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
              Total records: <span className="font-medium text-gray-900">{suaraData.length}</span>
            </span>
            <div className="flex space-x-4">
              <span className="text-red-600">
                Sangat Tinggi: <span className="font-medium">{suaraData.filter(item => item.status === 'Sangat Tinggi').length}</span>
              </span>
              <span className="text-orange-600">
                Tinggi: <span className="font-medium">{suaraData.filter(item => item.status === 'Tinggi').length}</span>
              </span>
              <span className="text-blue-600">
                Normal: <span className="font-medium">{suaraData.filter(item => item.status === 'Normal').length}</span>
              </span>
              <span className="text-green-600">
                Rendah: <span className="font-medium">{suaraData.filter(item => item.status === 'Rendah').length}</span>
              </span>
            </div>
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
            <h2 className="text-3xl font-bold text-yellow-900">Data Suara</h2>
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

        {/* Charts */}
        <Charts />

        {/* Suara Data Table */}
        <div className="mb-8">
          <SuaraTable />
        </div>
      </div>
    </div>
  );
};

export default DataSuaraPage;