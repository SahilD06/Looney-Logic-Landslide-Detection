import React from 'react';
import { Home, Map as MapIcon, Camera, Bell, Settings } from 'lucide-react';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'GIS', icon: MapIcon },
    { id: 'report', label: 'Report', icon: Camera },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full bg-surface/90 backdrop-blur-md border-t border-white/5 p-2 flex items-center justify-around absolute bottom-0 z-50">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-primary' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-lg mb-1 ${isActive ? 'bg-primary/20' : 'transparent'}`}>
              <Icon size={20} />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
