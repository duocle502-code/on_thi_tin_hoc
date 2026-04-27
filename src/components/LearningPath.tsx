import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, Flag, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface LearningPathProps {
  content: string;
  subjectName: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({ content, subjectName }) => {
  if (!content) return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
        <BookOpen size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-800">Chưa có lộ trình học</h3>
        <p className="text-sm text-slate-400">Hãy thực hiện bài kiểm tra đầu vào để AI thiết kế lộ trình cho bạn!</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg p-6 md:p-8 rounded-[40px] text-white shadow-xl flex flex-col md:flex-row gap-6 items-center"
      >
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-inner">
          <Sparkles size={40} />
        </div>
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider">
            AI Customized Path
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Lộ trình ôn thi {subjectName}</h2>
          <p className="text-white/80 text-sm">Đưa ra dựa trên năng lực thực tế và mục tiêu ngắn hạn của bạn.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-slate-100"
      >
        <div className="markdown-body prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StepCard icon={<Calendar />} title="Thời gian" desc="30 ngày tập trung" />
        <StepCard icon={<CheckCircle />} title="Mục tiêu" desc="Đạt chứng chỉ 900+" />
        <StepCard icon={<Flag />} title="Hỗ trợ" desc="AI Mentor 24/7" />
      </div>
    </div>
  );
};

const StepCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{desc}</p>
    </div>
  </div>
);
