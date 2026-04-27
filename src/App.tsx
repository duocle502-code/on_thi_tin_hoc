/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { AITutor } from './components/AITutor';
import { Settings } from './components/Settings';
import { LearningPath } from './components/LearningPath';
import { AppData, Settings as SettingsType, Session, Subject, Question } from './types';
import { INITIAL_SUBJECTS, SAMPLE_QUESTIONS } from './constants';
import { callGeminiAI, PROMPTS } from './services/geminiService';
import { BookOpen, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'eduexam_app_data';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    return {
      subjects: INITIAL_SUBJECTS,
      questions: SAMPLE_QUESTIONS,
      sessions: [],
      progress: {
        totalAttempts: 0,
        averageScore: 0,
        streakDays: 1,
        weakTopics: [],
        learningPaths: {}
      },
      settings: {
        theme: 'light',
        soundEnabled: true,
        autoSave: true,
        geminiApiKey: '',
        selectedModel: 'gemini-2.0-flash'
      }
    };
  });

  // Save data effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateSettings = (partial: Partial<SettingsType>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...partial }
    }));
  };

  const handleCompleteQuiz = (session: Session) => {
    setData(prev => {
      const newSessions = [...prev.sessions, session];
      const totalScorePercent = newSessions.reduce((acc, s) => acc + (s.score / s.totalQuestions), 0);
      
      return {
        ...prev,
        sessions: newSessions,
        progress: {
          ...prev.progress,
          totalAttempts: newSessions.length,
          averageScore: totalScorePercent / newSessions.length,
        }
      };
    });

    // If it's a first attempt for a subject or lower score, suggest learning path
    const subjectSessions = data.sessions.filter(s => s.subjectId === session.subjectId);
    if (subjectSessions.length === 0 || session.score / session.totalQuestions < 0.9) {
      if (data.settings.geminiApiKey) {
        generateLearningPath(session.subjectId, session.score, session.totalQuestions);
      }
    }

    setActiveSubject(null);
  };

  const generateLearningPath = async (subjectId: string, score: number, total: number) => {
    const subject = INITIAL_SUBJECTS.find(s => s.id === subjectId);
    if (!subject) return;

    setAiLoading(true);
    try {
      const prompt = PROMPTS.getLearningPath(subject.name, score, total);
      const path = await callGeminiAI(prompt, data.settings.geminiApiKey);
      if (path) {
        setData(prev => ({
          ...prev,
          progress: {
            ...prev.progress,
            learningPaths: {
              ...prev.progress.learningPaths,
              [subjectId]: path
            }
          }
        }));
        setActiveTab('subjects'); // Switch to learning path view for this subject
      }
    } catch (error: any) {
      Swal.fire('Lỗi AI', error.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskAI = async (question: Question, choice: string) => {
    if (!data.settings.geminiApiKey) {
      Swal.fire('Thông báo', 'Vui lòng cài đặt API Key trong phần Cài đặt để sử dụng tính năng này.', 'info');
      return;
    }

    setActiveTab('ai-tutor');
    // The AITutor handles its own message state for now, but we could pass initial prompt
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduexam_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setData(imported);
        Swal.fire('Thành công', 'Dữ liệu đã được khôi phục!', 'success');
      } catch (err) {
        Swal.fire('Lỗi', 'File không đúng định dạng.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  // Render helpers
  const renderContent = () => {
    if (activeSubject) {
      const subject = INITIAL_SUBJECTS.find(s => s.id === activeSubject);
      const subjectQuestions = SAMPLE_QUESTIONS.filter(q => q.subjectId === activeSubject);
      if (subject) {
        return (
          <Quiz 
            subject={subject} 
            questions={subjectQuestions} 
            onComplete={handleCompleteQuiz}
            onExit={() => setActiveSubject(null)}
            onAskAI={handleAskAI}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} onSelectSubject={setActiveSubject} />;
      case 'subjects':
        return (
          <div className="p-4 space-y-8 pb-24 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800">Lộ trình học của bạn</h2>
            {INITIAL_SUBJECTS.map(subject => (
              <div key={subject.id} className="space-y-4">
                <LearningPath 
                  content={data.progress.learningPaths[subject.id] || ''} 
                  subjectName={subject.name} 
                />
              </div>
            ))}
          </div>
        );
      case 'quiz':
        return (
          <div className="p-4 space-y-6 pb-24 max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Sẵn sàng thi thử?</h2>
              <p className="text-slate-500">Chọn một môn học để bắt đầu bài kiểm tra mô phỏng.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {INITIAL_SUBJECTS.map(subject => (
                <div 
                  key={subject.id}
                  onClick={() => setActiveSubject(subject.id)}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{subject.name}</h4>
                      <p className="text-xs text-slate-400">{subject.questionsCount} câu hỏi • {subject.questionsCount} phút</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    Bắt đầu
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ai-tutor':
        return <AITutor apiKey={data.settings.geminiApiKey} />;
      case 'settings':
        return (
          <Settings 
            settings={data.settings} 
            updateSettings={updateSettings}
            exportData={exportData}
            importData={importData}
            resetData={resetData}
          />
        );
      default:
        return <Dashboard data={data} onSelectSubject={setActiveSubject} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary selection:text-white">
      <Header onOpenSettings={() => setActiveTab('settings')} />
      
      <main className="flex-1 w-full max-w-screen-2xl mx-auto overflow-x-hidden pt-4">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {aiLoading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center border border-white/20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800">AI đang thiết kế lộ trình...</p>
              <p className="text-xs text-slate-400 mt-1">Đang phân tích kết quả bài thi của bạn để tối ưu hóa việc học.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
