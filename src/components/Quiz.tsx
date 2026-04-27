import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Timer, CheckCircle2, XCircle, Info, Sparkles, Send } from 'lucide-react';
import { Question, Subject, Session } from '../types';
import { cn, formatTime } from '../lib/utils';
import Swal from 'sweetalert2';

interface QuizProps {
  subject: Subject;
  questions: Question[];
  onComplete: (session: Session) => void;
  onExit: () => void;
  onAskAI: (question: Question, choice: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ subject, questions, onComplete, onExit, onAskAI }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(subject.questionsCount * 60); // 1 min per question
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (choiceIndex: number) => {
    if (isFinished) return;
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: choiceIndex }));
  };

  const handleFinish = () => {
    const correctAnswers = questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const session: Session = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId: subject.id,
      score: correctAnswers,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      date: new Date().toISOString()
    };

    setIsFinished(true);
    
    Swal.fire({
      title: 'Hoàn thành bài thi!',
      html: `
        <div class="text-left space-y-4">
          <p>Điểm của bạn: <b>${correctAnswers}/${questions.length}</b></p>
          <p>Thời gian: <b>${formatTime(session.timeSpent)}</b></p>
          <p>Tỉ lệ chính xác: <b>${Math.round((correctAnswers / questions.length) * 100)}%</b></p>
        </div>
      `,
      icon: correctAnswers / questions.length >= 0.8 ? 'success' : 'info',
      confirmButtonText: 'Xem chi tiết kết quả',
      showCancelButton: true,
      cancelButtonText: 'Về trang chủ',
      confirmButtonColor: '#4A90E2',
    }).then((result) => {
      if (result.isConfirmed) {
        // Detailed view state handled within component
      } else {
        onComplete(session);
      }
    });
  };

  const currentQuestion = questions[currentIndex];
  const hasAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col md:p-6 lg:p-12 overflow-y-auto">
      {/* Quiz Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 flex items-center justify-between shadow-sm rounded-none md:rounded-2xl z-10">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div className="hidden sm:block">
            <h3 className="font-bold text-slate-800">{subject.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thi Thử / Khảo sát đầu vào</p>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold shadow-sm transition-colors",
          timeLeft < 60 ? "bg-rose-50 text-rose-500 animate-pulse" : "bg-slate-50 text-slate-700"
        )}>
          <Timer size={20} />
          {formatTime(timeLeft)}
        </div>

        <button 
          onClick={() => {
            Swal.fire({
              title: 'Kết thúc bài thi?',
              text: 'Bạn có chắc chắn muốn nộp bài ngay bây giờ?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Đồng ý',
              cancelButtonText: 'Hủy',
              confirmButtonColor: '#4A90E2'
            }).then(r => r.isConfirmed && handleFinish());
          }}
          className="px-6 py-2 gradient-bg text-white font-bold rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
        >
          Nộp bài
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100 mt-2">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-3xl space-y-6 pt-4">
          {/* Question View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-slate-100 min-h-[300px]"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 bg-primary/10 text-primary font-bold rounded-lg flex items-center justify-center">
                  {currentIndex + 1}
                </span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Câu hỏi {currentIndex + 1} của {questions.length}
                </span>
              </div>

              <h4 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-8">
                {currentQuestion.content}
              </h4>

              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const isWrong = isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isFinished}
                      className={cn(
                        "w-full text-left p-4 md:p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                        !isFinished && isSelected ? "border-primary bg-blue-50/50" : "border-slate-100 hover:border-slate-300",
                        isFinished && isCorrect ? "border-emerald-500 bg-emerald-50" : "",
                        isFinished && isWrong ? "border-rose-500 bg-rose-50" : ""
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors border",
                          isSelected ? "bg-primary text-white border-primary" : "bg-slate-100 text-slate-400 border-slate-200 group-hover:border-slate-400",
                          isFinished && isCorrect ? "bg-emerald-500 text-white border-emerald-500" : "",
                          isFinished && isWrong ? "bg-rose-500 text-white border-rose-500" : ""
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={cn(
                          "font-semibold",
                          isSelected ? "text-primary" : "text-slate-700",
                          isFinished && isCorrect ? "text-emerald-700" : "",
                          isFinished && isWrong ? "text-rose-700" : ""
                        )}>
                          {option}
                        </span>
                      </div>
                      
                      {isFinished && isCorrect && <CheckCircle2 className="text-emerald-500" />}
                      {isFinished && isWrong && <XCircle className="text-rose-500" />}
                    </button>
                  );
                })}
              </div>

              {isFinished && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-slate-50 rounded-2x border border-slate-200 space-y-4"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Info size={20} />
                    <span className="font-bold">Giải thích chi tiết</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  <button 
                    onClick={() => onAskAI(currentQuestion, currentQuestion.options[answers[currentQuestion.id] || 0])}
                    className="flex items-center gap-2 w-full justify-center py-3 px-4 bg-white border border-primary/20 text-primary rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    <Sparkles size={18} />
                    Hỏi AI Tutor chi tiết hơn
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 text-slate-500 font-bold px-4 py-2 hover:bg-slate-200 rounded-xl disabled:opacity-30 transition-colors"
            >
              <ChevronLeft /> Quay lại
            </button>

            <div className="hidden md:flex gap-1">
              {questions.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    idx === currentIndex ? "bg-primary w-4" : (answers[questions[idx].id] !== undefined ? "bg-primary/40" : "bg-slate-200")
                  )}
                />
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-2 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Tiếp theo <ChevronRight />
              </button>
            ) : !isFinished && (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Kết thúc & Nộp bài <CheckCircle2 />
              </button>
            )}

            {isFinished && currentIndex === questions.length - 1 && (
              <button
                onClick={() => onComplete({
                  id: Math.random().toString(36).substr(2, 9),
                  subjectId: subject.id,
                  score: questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0),
                  totalQuestions: questions.length,
                  correctAnswers: questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0),
                  timeSpent: Math.floor((Date.now() - startTime) / 1000),
                  date: new Date().toISOString()
                })}
                className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-2 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Quay lại Trang chủ <ArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
