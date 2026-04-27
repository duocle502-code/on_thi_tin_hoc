import React from 'react';
import { Settings as SettingsIcon, Bell, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-50 glass-morphism px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">E</span>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EduExam Pro
          </h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">AI Learning Assistant</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
        >
          <SettingsIcon size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
          <User size={16} className="text-slate-500" />
        </div>
      </div>
    </header>
  );
};
