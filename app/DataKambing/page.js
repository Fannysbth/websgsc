"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const JetsonPage = () => {
  const [currentTime, setCurrentTime] = useState(null); // client-safe
  const [activeMenu, setActiveMenu] = useState("Data Kambing");
  const [jetsonData, setJetsonData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari backend
  const fetchJetsonData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/tables/jetson?limit=50`);
      const json = await res.json();
      if (json.success) {
        const sorted = json.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJetsonData(sorted);
      } else {
        setJetsonData([]);
      }
    } catch (err) {
      console.error("❌ Error fetching Jetson data:", err);
      setJetsonData([]);
    } finally {
      setLoading(false);
    }
  };

  // Set waktu client
  useEffect(() => {
    setCurrentTime(new Date()); // set waktu setelah mount
    fetchJetsonData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sidebar menu
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

  // Tabel Jetson
  const JetsonTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-900">Data Kambing</h3>
        <p className="text-sm text-yellow-700 mt-1">Histori data Jetson terbaru</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-yellow-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Timestamp</th>
              <th className=" py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Current Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Suhu (°C)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-yellow-100">
  {jetsonData.map((item, index) => {
    const d = item.data || {};
    
    // Gunakan timestamp di data, kalau tidak ada pakai createdAt
    const ts = d.timestamp ? new Date(d.timestamp) : item.createdAt ? new Date(item.createdAt) : null;
    const formattedTimestamp = ts ? ts.toLocaleString("id-ID", { year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute:'2-digit' }) : "-";

    return (
      <tr
        key={item._id}
        className={`${index % 2 === 0 ? "bg-white" : "bg-yellow-25"} hover:bg-yellow-50 transition-colors`}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formattedTimestamp}</td>
        <td className="px-1 py-4 w-1/6 text-left whitespace-nowrap text-sm font-medium text-gray-900">{d.id ?? item.sensorId ?? "-"}</td>
        <td className="px-14 py-4 whitespace-nowrap text-sm text-gray-700">{d.current_posture ?? "-"}</td>
        <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-700">{d.avg_temp_proxy != null ? d.avg_temp_proxy.toFixed(1) : "-"}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              d.posture_status === "Warning" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {d.posture_status ?? "-"}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-yellow-100">
        <p className="text-sm text-gray-600">
          Total: <span className="font-medium text-gray-900">{jetsonData.length}</span> entries
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-25">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-900">Data Kambing</h2>
          <div className="text-sm text-yellow-700">
            <div>
              Last updated: {currentTime ? currentTime.toLocaleTimeString("id-ID") : "--:--:--"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentTime
                ? currentTime.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Loading..."}
            </div>
          </div>
        </div>

        {/* Loading / Table */}
        {loading ? <p className="text-gray-700">Loading data...</p> : <JetsonTable />}
      </div>
    </div>
  );
};

export default JetsonPage;
