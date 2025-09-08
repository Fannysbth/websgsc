'use client';
import { useState, useEffect } from 'react';

export const useRealtimeData = () => {
  const [goatData, setGoatData] = useState([
    { id: 'G001', sitting: 12, standing: 8, temperature: 38.5 },
    { id: 'G002', sitting: 15, standing: 5, temperature: 39.2 },
    { id: 'G003', sitting: 8, standing: 12, temperature: 38.1 },
    { id: 'G004', sitting: 10, standing: 10, temperature: 38.8 },
    { id: 'G005', sitting: 18, standing: 2, temperature: 39.5 },
  ]);

  const [environmentData, setEnvironmentData] = useState({
    temperature: 28.5,
    humidity: 65,
    thi: 72.3,
  });

  const [notifications, setNotifications] = useState(12);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Update goat data
      setGoatData(prevData => 
        prevData.map(goat => ({
          ...goat,
          sitting: Math.max(0, goat.sitting + (Math.random() > 0.5 ? 1 : -1)),
          standing: Math.max(0, goat.standing + (Math.random() > 0.5 ? 1 : -1)),
          temperature: (38 + Math.random() * 2).toFixed(1)
        }))
      );

      // Update environment data
      setEnvironmentData(prev => ({
        temperature: (25 + Math.random() * 10).toFixed(1),
        humidity: (60 + Math.random() * 20).toFixed(0),
        thi: (70 + Math.random() * 10).toFixed(1)
      }));

      // Random notification increment
      if (Math.random() > 0.7) {
        setNotifications(prev => prev + 1);
      }

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    goatData,
    environmentData,
    notifications,
    lastUpdate
  };
};