import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Wand2, RefreshCcw, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { callGeminiAI } from '../services/geminiService';
import { cn } from '../lib/utils';

interface AITutorProps {
  apiKey: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AITutor: React.FC<AITutorProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '# Chào mừng đến với EduExam AI Tutor! 👋\nTôi có thể giúp bạn giải đáp thắc mắc về các kỹ năng Word, Excel hay kiến thức IC3. Hãy đặt câu hỏi cho tôi bên dưới nhé.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const prompt = `Bạn là một trợ lý ảo chuyên về tin học văn phòng (MOS) và chứng chỉ IC3. Hãy trả lời câu hỏi sau bằng tiếng Việt một cách chi tiết và dễ hiểu: \n${userMsg}`;
      const response = await callGeminiAI(prompt, apiKey);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Có lỗi xảy ra: ' + error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] p-4 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <h2 className="font-bold text-slate-800">EduExam AI Tutor</h2>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: 'Hệ thống đã sẵn sàng cho câu hỏi mới của bạn.' }])}
          className="text-slate-400 hover:text-primary transition-colors"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-4 scrollbar-hide">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%] md:max-w-[75%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200",
              msg.role === 'user' ? "bg-slate-100" : "bg-primary/10"
            )}>
              {msg.role === 'user' ? <User size={16} className="text-slate-500" /> : <Bot size={16} className="text-primary" />}
            </div>
            
            <div className={cn(
              "p-4 rounded-2xl shadow-sm overflow-x-auto",
              msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
            )}>
              <div className={cn(
                "markdown-body text-sm leading-relaxed",
                msg.role === 'user' ? "text-white prose-invert" : ""
              )}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 border border-slate-200">
              <Loader2 size={16} className="text-primary animate-spin" />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary/40"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative group">
        <textarea
          autoFocus
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi tại đây..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-4 pr-14 shadow-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none overflow-hidden"
          style={{ height: 'auto', minHeight: '56px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 bottom-2 p-2.5 gradient-bg text-white rounded-xl shadow-lg disabled:opacity-30 disabled:scale-100 active:scale-90 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-400 font-medium">
        AI có thể đưa ra câu trả lời không hoàn toàn chính xác. Vui lòng kiểm tra lại kiến thức thực tế.
      </p>
    </div>
  );
};
