import React from 'react';
import { Search, UserCircle, Bell } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-surface/50 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">Rakshak NER</h1>
        <p className="text-xs text-primary">Early Warning System</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <div className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border border-surface"></div>
        </button>
        <button className="text-gray-400 hover:text-white transition-colors ml-1">
          <UserCircle size={28} />
        </button>
      </div>
    </header>
  );
};
