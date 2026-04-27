import React from 'react';
import { Home, BookOpen, FileCheck, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'subjects', label: 'Khóa học', icon: BookOpen },
    { id: 'quiz', label: 'Thi thử', icon: FileCheck },
    { id: 'ai-tutor', label: 'AI Tutor', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-slate-200 px-2 pt-2 pb-6 flex justify-around items-center z-50 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300",
              isActive ? "text-primary transform -translate-y-1" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "bg-primary/10 shadow-sm" : ""
            )}>
              <Icon size={24} />
            </div>
            <span className="text-[10px] font-semibold">{tab.label}</span>
            {isActive && (
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};
