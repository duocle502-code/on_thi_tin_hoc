import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Zap, Target, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { AppData } from '../types';
import { INITIAL_SUBJECTS } from '../constants';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';

interface DashboardProps {
  data: AppData;
  onSelectSubject: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onSelectSubject }) => {
  const { progress, sessions } = data;

  const chartData = sessions.slice(-7).map(s => ({
    date: new Date(s.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    score: Math.round((s.score / s.totalQuestions) * 100)
  }));

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Icons.Book;
    return <Icon size={24} className="text-white" />;
  };

  return (
    <div className="p-4 space-y-6 pb-24 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h2 className="text-2xl font-bold text-slate-800">Chào học viên! 👋</h2>
        <p className="text-slate-500">Hôm nay bạn muốn bắt đầu ôn luyện kiến thức nào?</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Award className="text-amber-500" />} label="Điểm trung bình" value={`${Math.round(progress.averageScore * 100)}%`} color="bg-amber-50" />
        <StatCard icon={<Zap className="text-indigo-500" />} label="Chuỗi ngày" value={`${progress.streakDays} ngày`} color="bg-indigo-50" />
        <StatCard icon={<Target className="text-emerald-500" />} label="Lượt thi thử" value={`${progress.totalAttempts}`} color="bg-emerald-50" />
        <StatCard icon={<BookOpen className="text-primary" />} label="Môn đang học" value={`${INITIAL_SUBJECTS.length}`} color="bg-blue-50" />
      </div>

      {/* Progress Chart */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Tiến độ 7 ngày qua</h3>
          <span className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer">
            Chi tiết <ArrowRight size={14} />
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="score" fill="#4A90E2" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Subject Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Học phần tiêu biểu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_SUBJECTS.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => onSelectSubject(subject.id)}
              className="group bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 active:scale-95"
            >
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                {getIcon(subject.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{subject.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{subject.description}</p>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3 rounded-full"></div>
                </div>
              </div>
              <div className="p-2 text-slate-300">
                <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={cn("p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2 bg-white")}
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  </motion.div>
);
