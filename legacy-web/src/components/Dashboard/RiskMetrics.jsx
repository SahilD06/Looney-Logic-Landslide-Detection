import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Activity, MapPin, Loader2 } from 'lucide-react';
import { CONNECTIVITY_STATUS } from '../../services/mockData';
import { calculateRisk } from '../../services/aiEngine';
import { fetchLiveTelemetry } from '../../services/api';

export const RiskMetrics = () => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live data for Shillong (25.5788, 91.8933)
    fetchLiveTelemetry(25.5788, 91.8933).then(data => {
      setLiveData(data);
      setLoading(false);
    });
  }, []);

  const currentRisk = calculateRisk('NER', liveData);

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Risk Level Card */}
      <div className="glass-panel p-3 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-danger/10 rounded-full blur-2xl group-hover:bg-danger/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-xs font-medium truncate pr-2">AI Risk Level</h3>
          <AlertTriangle className={currentRisk.color} size={16} />
        </div>
        <div className="flex items-baseline gap-1">
          {loading ? (
            <Loader2 className="animate-spin text-gray-500" size={20} />
          ) : (
            <span className={`text-xl font-bold ${currentRisk.color}`}>{currentRisk.level}</span>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-1 truncate">Based on live data</p>
      </div>

      {/* Weather Card */}
      <div className="glass-panel p-3 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-xs font-medium truncate pr-2">24h Rainfall</h3>
          <CloudRain className="text-blue-400" size={16} />
        </div>
        <div className="flex items-baseline gap-1">
          {loading ? (
            <Loader2 className="animate-spin text-gray-500" size={20} />
          ) : (
            <>
              <span className="text-xl font-bold text-white">{liveData?.rain_24h_sum || 0}</span>
              <span className="text-xs text-gray-400">mm</span>
            </>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-1 truncate">
          {loading ? 'Loading...' : `Soil moisture: ${liveData?.soil_moisture || 0}`}
        </p>
      </div>

      {/* Sensor Activity */}
      <div className="glass-panel p-3 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-xs font-medium truncate pr-2">Sensors</h3>
          <Activity className="text-emerald-400" size={16} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">124</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">+3</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 truncate">Across 8 states</p>
      </div>

      {/* Connectivity Status */}
      <div className="glass-panel p-3 rounded-xl relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-400 text-xs font-medium truncate pr-2">Routes</h3>
          <MapPin className="text-warning" size={16} />
        </div>
        <div className="space-y-2 mt-1 flex-1">
          {CONNECTIVITY_STATUS.slice(0,2).map((route, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-[10px] truncate w-20">{route.route}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${
                  route.status === 'Blocked' ? 'bg-danger/20 text-danger' :
                  route.status === 'Vulnerable' ? 'bg-warning/20 text-warning' :
                  'bg-success/20 text-success'
                }`}>
                  {route.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
