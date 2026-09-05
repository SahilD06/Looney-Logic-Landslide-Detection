import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { RiskMetrics } from '../../components/Dashboard/RiskMetrics';
import { GISMap } from '../../components/Map/GISMap';
import { Header } from '../../legacy-web/src/components/Header'; // We need to port this or skip it

export default function DashboardScreen() {
  const [sosStatus, setSosStatus] = useState('none');

  const handleSOS = () => {
    setSosStatus('needs_help');
    console.log("SOS Broadcast: User needs immediate assistance at Lat: 25.5788, Lon: 91.8933");
  };

  const handleSafe = () => {
    setSosStatus('safe');
    console.log("Status Broadcast: User marked as SAFE.");
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {sosStatus === 'triggered' && (
        <View className="absolute z-50 top-0 bottom-0 left-0 right-0 bg-black/80 items-center justify-center p-6">
          <View className="bg-surface/90 border border-danger/50 p-6 rounded-2xl w-full items-center shadow-2xl">
            <View className="w-16 h-16 bg-danger/20 rounded-full items-center justify-center mb-4">
              <ShieldAlert color="#ef4444" size={32} />
            </View>
            <Text className="text-xl font-bold text-white mb-2">Emergency Alert!</Text>
            <Text className="text-sm text-gray-300 mb-6 text-center">A landslide has been reported in your immediate vicinity (East Khasi Hills). Are you safe?</Text>
            
            <View className="w-full gap-3">
              <TouchableOpacity 
                onPress={handleSOS}
                className="w-full bg-danger py-4 rounded-xl items-center flex-row justify-center gap-2"
              >
                <ShieldAlert color="#ffffff" size={24} />
                <Text className="text-white font-bold text-lg">SOS / NEED HELP</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSafe}
                className="w-full bg-surface border border-white/10 py-3 rounded-xl items-center flex-row justify-center gap-2"
              >
                <CheckCircle2 color="#10b981" size={20} />
                <Text className="text-gray-200 font-medium">I am safe for now</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-[10px] text-gray-500 mt-4 text-center">Your status will be broadcast to disaster management officials and emergency contacts via SMS.</Text>
          </View>
        </View>
      )}

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header equivalent */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-white">Raksha App</Text>
            <Text className="text-xs text-gray-400">Landslide Monitoring System</Text>
          </View>
        </View>

        {sosStatus === 'needs_help' ? (
          <View className="bg-danger/20 border-2 border-danger rounded-xl p-3 mb-5 flex-row gap-3 items-start">
            <View className="bg-danger p-2 rounded-lg">
              <ShieldAlert color="#ffffff" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-danger text-sm">SOS Broadcast Active</Text>
              <Text className="text-xs text-red-200/80 mt-0.5">Emergency teams have been dispatched to your location.</Text>
            </View>
          </View>
        ) : sosStatus === 'safe' ? (
          <View className="bg-success/10 border border-success/30 rounded-xl p-3 mb-5 flex-row gap-3 items-start">
            <View className="bg-success/20 p-2 rounded-lg">
              <CheckCircle2 color="#10b981" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-success text-sm">Status: Safe</Text>
              <Text className="text-xs text-green-200/80 mt-0.5">Your safe status has been logged. Stay alert.</Text>
            </View>
          </View>
        ) : (
          <View className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-5">
            <View className="flex-row gap-3 items-start mb-2">
              <View className="bg-warning/20 p-2 rounded-lg">
                <AlertCircle color="#f59e0b" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-warning text-sm">High Risk Area</Text>
                <Text className="text-xs text-yellow-200/80 mt-0.5">You are currently in a high risk zone.</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setSosStatus('triggered')}
              className="w-full bg-warning/80 py-2 rounded-lg items-center mt-1"
            >
              <Text className="text-gray-900 text-xs font-bold">Simulate Local Danger (Demo)</Text>
            </TouchableOpacity>
          </View>
        )}

        <RiskMetrics />

        <View className="mb-4 mt-2 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white tracking-tight">Map</Text>
          <TouchableOpacity className="px-3 py-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
            <Text className="text-white text-xs font-medium">Sync</Text>
          </TouchableOpacity>
        </View>

        <View className="h-[300px] w-full rounded-2xl overflow-hidden shadow-lg border border-white/5">
          <GISMap />
        </View>
      </ScrollView>
    </View>
  );
}
