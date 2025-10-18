"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';

const DataTHIPage = () => {
    const [currentTime, setCurrentTime] = useState(null);
    const [activeMenu, setActiveMenu] = useState('Data THI');
    const [thiData, setThiData] = useState([]);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Fetch sensor table dari BE - PERBAIKAN: hapus karakter 'x'
    const fetchTHIData = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/tables/sensors?limit=50`, {
                withCredentials: true // TAMBAHKAN INI JUGA
            });
            
            if (!res.data.success) return;

            const sensors = Array.isArray(res.data.data) ? res.data.data : [];

            // Filter dulu elemen valid
            const validSensors = sensors.filter(d => d && typeof d === 'object' && d.data);

            const data = validSensors.map(d => {
                // Tangani createdAt
                let created = null;
                if (d.createdAt) {
                    created = d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt);
                    if (isNaN(created)) created = null;
                }

                // Ambil field aman
                const temp = d.data?.temp ?? null;
                const hum = d.data?.hum ?? null;
                const thi = d.data?.thi ?? 0;
                const status = d.data?.thi_status ?? 'Unknown';

                return {
                    id: d._id ?? '-',
                    tanggal: created ? created.toLocaleDateString('id-ID') : '-',
                    time: created ? created.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
                    suhu: temp != null ? String(temp) : '-',
                    kelembapan: hum != null ? String(hum) : '-',
                    thi: thi,
                    status: status
                };
            });

            setThiData(data);
        } catch (err) {
            console.error('Error fetching sensor data:', err);
        }
    };

    useEffect(() => {
        fetchTHIData();
        const interval = setInterval(fetchTHIData, 5000);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Danger': return 'bg-red-100 text-red-800';
            case 'Stress': return 'bg-orange-100 text-orange-800';
            case 'Moderate': return 'bg-yellow-100 text-yellow-800';
            case 'Normal': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTHIColor = (thi) => {
        if (thi >= 89) return 'text-red-600 font-semibold';
        if (thi >= 84) return 'text-orange-600 font-semibold';
        if (thi >= 72) return 'text-yellow-600 font-semibold';
        return 'text-green-600 font-semibold';
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

    const StatsCards = () => {
        if (!thiData.length) return null;
        const validTHIData = thiData.filter(d => d.thi != null);
        const averageTHI = (validTHIData.reduce((sum, item) => sum + item.thi, 0) / validTHIData.length || 0).toFixed(1);
        const averageTemp = (validTHIData.reduce((sum, item) => sum + parseFloat(item.suhu || 0), 0) / validTHIData.length || 0).toFixed(1);
        const averageHumidity = Math.round(validTHIData.reduce((sum, item) => sum + parseInt(item.kelembapan || 0), 0) / (validTHIData.length || 1));
        const dangerCount = validTHIData.filter(item => item.status === 'Danger' || item.status === 'Stress').length;

        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Avg THI</p>
                    <p className={`text-2xl font-bold ${getTHIColor(averageTHI)}`}>{averageTHI}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Avg Suhu</p>
                    <p className="text-2xl font-bold text-yellow-900">{averageTemp}°C</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Avg Kelembapan</p>
                    <p className="text-2xl font-bold text-yellow-900">{averageHumidity}%</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-yellow-100 p-6">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Alert Status</p>
                    <p className="text-2xl font-bold text-yellow-900">{dangerCount}</p>
                </div>
            </div>
        );
    };

    const THITable = () => (
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
                            <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'} hover:bg-yellow-50 transition-colors`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggal}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.suhu}°C</td>
                                <td className="px-14 py-4 whitespace-nowrap text-sm text-gray-700">{item.kelembapan}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`font-bold ${getTHIColor(item.thi)}`}>{item.thi}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
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
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-yellow-900">Data THI</h2>
                        <div className="text-sm text-yellow-700">
                            <div>
                                Last updated: {currentTime ? currentTime.toLocaleTimeString('id-ID') : '--:--:--'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {currentTime ? currentTime.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'Loading...'}
                            </div>
                        </div>
                    </div>
                </div>
                <StatsCards />
                <div className="mb-8"><THITable /></div>
            </div>
        </div>
    );
};

export default DataTHIPage;