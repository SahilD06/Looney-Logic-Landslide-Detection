import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AlertTriangle, CloudRain, Activity, MapPin } from 'lucide-react-native';
import { CONNECTIVITY_STATUS } from '../../services/mockData';
import { calculateRisk } from '../../services/aiEngine';
import { fetchLiveTelemetry } from '../../services/api';

export const RiskMetrics = () => {
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveTelemetry(25.5788, 91.8933).then((data) => {
      setLiveData(data);
      setLoading(false);
    });
  }, []);

  const currentRisk = calculateRisk('NER', liveData);

  // Helper to map color strings to tailwind text classes in React Native
  const getRiskColor = (colorClass: string) => {
    if (colorClass.includes('danger')) return 'text-danger';
    if (colorClass.includes('warning')) return 'text-warning';
    if (colorClass.includes('success')) return 'text-success';
    return 'text-white';
  };

  const riskColor = getRiskColor(currentRisk.color);

  return (
    <View className="flex-row flex-wrap justify-between mb-4">
      {/* Risk Level Card */}
      <View className="w-[48%] bg-surface/80 p-3 rounded-xl border border-white/10 mb-3 overflow-hidden">
        <View className="absolute top-0 right-0 w-24 h-24 bg-danger/10 rounded-full" />
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-400 text-xs font-medium pr-2">AI Risk Level</Text>
          <AlertTriangle color={riskColor === 'text-danger' ? '#ef4444' : riskColor === 'text-warning' ? '#f59e0b' : '#10b981'} size={16} />
        </View>
        <View className="flex-row items-baseline gap-1">
          {loading ? (
            <ActivityIndicator color="#6b7280" size="small" />
          ) : (
            <Text className={`text-xl font-bold ${riskColor}`}>{currentRisk.level}</Text>
          )}
        </View>
        <Text className="text-[10px] text-gray-500 mt-1">Based on live data</Text>
      </View>

      {/* Weather Card */}
      <View className="w-[48%] bg-surface/80 p-3 rounded-xl border border-white/10 mb-3 overflow-hidden">
        <View className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full" />
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-400 text-xs font-medium pr-2">24h Rainfall</Text>
          <CloudRain color="#60a5fa" size={16} />
        </View>
        <View className="flex-row items-baseline gap-1">
          {loading ? (
            <ActivityIndicator color="#6b7280" size="small" />
          ) : (
            <>
              <Text className="text-xl font-bold text-white">{liveData?.rain_24h_sum || 0}</Text>
              <Text className="text-xs text-gray-400">mm</Text>
            </>
          )}
        </View>
        <Text className="text-[10px] text-gray-500 mt-1">
          {loading ? 'Loading...' : `Soil moisture: ${liveData?.soil_moisture || 0}`}
        </Text>
      </View>

      {/* Sensor Activity */}
      <View className="w-[48%] bg-surface/80 p-3 rounded-xl border border-white/10 overflow-hidden">
        <View className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full" />
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-400 text-xs font-medium pr-2">Sensors</Text>
          <Activity color="#34d399" size={16} />
        </View>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-xl font-bold text-white">124</Text>
          <View className="bg-emerald-400/10 px-1.5 py-0.5 rounded-full ml-1">
            <Text className="text-[10px] text-emerald-400">+3</Text>
          </View>
        </View>
        <Text className="text-[10px] text-gray-500 mt-1">Across 8 states</Text>
      </View>

      {/* Connectivity Status */}
      <View className="w-[48%] bg-surface/80 p-3 rounded-xl border border-white/10 overflow-hidden">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-gray-400 text-xs font-medium pr-2">Routes</Text>
          <MapPin color="#f59e0b" size={16} />
        </View>
        <View className="mt-1 flex-1">
          {CONNECTIVITY_STATUS.slice(0, 2).map((route, i) => {
            const isBlocked = route.status === 'Blocked';
            const isVulnerable = route.status === 'Vulnerable';
            const statusBg = isBlocked ? 'bg-danger/20' : isVulnerable ? 'bg-warning/20' : 'bg-success/20';
            const statusText = isBlocked ? 'text-danger' : isVulnerable ? 'text-warning' : 'text-success';

            return (
              <View key={i} className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-300 text-[10px] w-16" numberOfLines={1}>{route.route}</Text>
                <View className={`${statusBg} px-1.5 py-0.5 rounded`}>
                  <Text className={`text-[8px] font-medium ${statusText}`}>
                    {route.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
