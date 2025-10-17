"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DataSuaraPage = () => {
  const [activeMenu, setActiveMenu] = useState('Data Suara');
  const [suaraData, setSuaraData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
  const interval = setInterval(() => setCurrentTime(new Date()), 1000);
  return () => clearInterval(interval);
}, []);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchSoundData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/tables/audio?limit=50`, { withCredentials: true });
      if (res.data.success) {
        const data = res.data.data.map(d => {
          const created = new Date(d.timestamp || d.createdAt);
          return {
            id: d._id,
            tanggal: created.toLocaleDateString('id-ID'),
            time: created.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            frekuensi: d.data?.db_level ?? 0,
            status: d.data?.sound_status ?? "Unknown"
          };
        });
        setSuaraData(data);

        setChartData(data.slice(-10).map(d => ({
          time: d.time,
          frekuensi: d.frekuensi,
          threshold: 300
        })));
      }
    } catch (err) {
      console.error('Error fetching audio data:', err);
    }
  };

  useEffect(() => {
    fetchSoundData();
    const interval = setInterval(() => {
      fetchSoundData();
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sangat Tinggi': return 'bg-red-100 text-red-800';
      case 'Tinggi': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      case 'Rendah': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          {menuItems.map(item => (
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

  const SuaraTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-900">Data Suara</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-yellow-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Frekuensi (db)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-yellow-100">
            {suaraData.map((item, idx) => (
              <tr key={item.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                <td className="px-14 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.frekuensi}</td>
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
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-25">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-900">Data Suara</h2>
          <div className="text-sm text-yellow-700">
  <div>
    Last updated: {currentTime ? currentTime.toLocaleTimeString('id-ID') : '--:--:--'}
  </div>
  <div className="text-xs text-gray-500 mt-1">
    {currentTime ? currentTime.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'Loading...'}
  </div>
</div>
        </div>
        <SuaraTable />
      </div>
    </div>
  );
};

export default DataSuaraPage;
