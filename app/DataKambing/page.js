"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const DataKambingPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState('Data Kambing');

  const [realtimeData, setRealtimeData] = useState([
    { id: "K001", suhu: "38.5", time: "14:32:15", posisi: "Sitting", durasi: "2h 15m", status: "Normal" },
    { id: "K002", suhu: "39.1", time: "14:30:22", posisi: "Standing", durasi: "1h 45m", status: "Normal" },
    { id: "K003", suhu: "37.8", time: "14:28:45", posisi: "Sitting", durasi: "3h 20m", status: "Normal" },
    { id: "K004", suhu: "40.2", time: "14:25:18", posisi: "Standing", durasi: "0h 45m", status: "Warning" },
    { id: "K005", suhu: "38.9", time: "14:23:33", posisi: "Sitting", durasi: "1h 30m", status: "Normal" },
    { id: "K006", suhu: "39.5", time: "14:20:10", posisi: "Standing", durasi: "2h 10m", status: "Normal" },
    { id: "K007", suhu: "38.2", time: "14:18:55", posisi: "Sitting", durasi: "1h 25m", status: "Normal" },
    { id: "K008", suhu: "39.8", time: "14:15:40", posisi: "Standing", durasi: "0h 50m", status: "Normal" },
  ])

  const [dailyData] = useState([
  { id: 'K001', tanggal: '08/09/2024', avgSuhu: '38.7', duduk: 1200, berdiri: 600, normal: 18, bahaya: 2 },  // 20m duduk, 10m berdiri
  { id: 'K002', tanggal: '08/09/2024', avgSuhu: '39.2', duduk: 900, berdiri: 300, normal: 16, bahaya: 4 },   // 15m duduk, 5m berdiri
  { id: 'K003', tanggal: '08/09/2024', avgSuhu: '38.1', duduk: 1500, berdiri: 600, normal: 20, bahaya: 0 },  // 25m duduk, 10m berdiri
  { id: 'K004', tanggal: '08/09/2024', avgSuhu: '40.1', duduk: 600, berdiri: 1200, normal: 10, bahaya: 5 },  // 10m duduk, 20m berdiri
  { id: 'K005', tanggal: '08/09/2024', avgSuhu: '39.0', duduk: 300, berdiri: 900, normal: 17, bahaya: 3 },   // 5m duduk, 15m berdiri
  { id: 'K006', tanggal: '08/09/2024', avgSuhu: '38.5', duduk: 600, berdiri: 600, normal: 19, bahaya: 1 },   // 10m duduk, 10m berdiri
  { id: 'K007', tanggal: '08/09/2024', avgSuhu: '38.9', duduk: 1800, berdiri: 300, normal: 18, bahaya: 2 },  // 30m duduk, 5m berdiri
  { id: 'K008', tanggal: '08/09/2024', avgSuhu: '39.6', duduk: 900, berdiri: 600, normal: 15, bahaya: 5 }    // 15m duduk, 10m berdiri
]);


  // Simulasi update realtime
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
    
    setRealtimeData(prev =>
      prev.map(item => {
        // Random suhu
        const newTemp = (37 + Math.random() * 4).toFixed(1);

        // Random status
        const randomStatus = Math.random();
        let status = "Normal";
        if (parseFloat(newTemp) > 40) {
          status = "Warning";
        } else if (randomStatus < 0.2) {
          status = "Normal";
        } else if (randomStatus < 0.4) {
          status = "Warning";
        }

        // Random posisi (Sitting atau Standing)
        const posisi = Math.random() > 0.5 ? "Sitting" : "Standing";

        return {
          ...item,
          suhu: newTemp,
          time: new Date().toLocaleTimeString("id-ID"),
          status: status,
          posisi: posisi,
        };
      })
    );
  }, 3000);

  return () => clearInterval(timer);
}, []);


  // Komponen Sidebar
  const Sidebar = () => {
    const menuItems = [
      { name: 'Dashboard', href: '/Dashboardcoba' },
      { name: 'Data Kambing', href: '/DataKambing' },
      { name: 'Data THI', href: '/data-thi' },
      { name: 'Data Suara', href: '/data-suara' },
      { name: 'Profile', href: '/profile' }
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
  // Komponen Realtime Table
  const RealtimeTable = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
          <h3 className="text-lg font-semibold text-yellow-900">Data Real Time</h3>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-600 font-medium">LIVE DATA</span>
          </div>
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
              {realtimeData.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.suhu}°C</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.posisi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.durasi}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Warning' ? 'bg-red-100 text-red-800'
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
        <div className="px-6 py-3 bg-gray-50 border-t border-yellow-100">
          <p className="text-sm text-gray-600">
            Total: <span className="font-medium text-gray-900">{realtimeData.length}</span> kambing
          </p>
        </div>
      </div>
    );
  };

  // Komponen Daily Summary Table
  const DailySummaryTable = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
          <h3 className="text-lg font-semibold text-yellow-900">Data Harian (Rata-Rata)</h3>
          <p className="text-sm text-yellow-700 mt-1">Ringkasan data harian per kambing</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-yellow-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  Rata-Rata<br/>Suhu
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-800 uppercase tracking-wider">Rata-Rata<br/>Duduk</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-800 uppercase tracking-wider">Rata-Rata<br/>Duduk</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-800 uppercase tracking-wider">Total<br/>Normal</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-800 uppercase tracking-wider">
                  Total<br/>Bahaya
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100">
              {dailyData.map((item, index) => (
                <tr key={`${item.id}-${item.tanggal}`} className={`${index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <span >
                      {item.avgSuhu}°C
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <span >
                      {item.duduk}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <span >
                      {item.berdiri}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {item.normal}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                      item.bahaya > 0 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.bahaya}
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
              Total data: <span className="font-medium text-gray-900">{dailyData.length}</span> entri
            </span>
            <div className="flex space-x-4">
              <span className="text-red-600">
                Total Bahaya: <span className="font-medium">{dailyData.reduce((sum, item) => sum + item.bahaya, 0)}</span>
              </span>
              <span className="text-green-600">
                Total Normal: <span className="font-medium">{dailyData.reduce((sum, item) => sum + item.normal, 0)}</span>
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
            <h2 className="text-3xl font-bold text-yellow-900">Data Kambing</h2>
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

        {/* Realtime Data Table */}
        <div className="mb-8">
          <RealtimeTable />
        </div>

        {/* Daily Summary Table */}
        <div className="mb-8">
          <DailySummaryTable />
        </div>
      </div>
    </div>
  );
};

export default DataKambingPage;