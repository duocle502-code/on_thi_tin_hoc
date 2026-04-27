import React from 'react';
import { Settings as SettingsType, AppData } from '../types';
import { Eye, EyeOff, Save, Download, Upload, Shield, Database, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';

interface SettingsProps {
  settings: SettingsType;
  updateSettings: (s: Partial<SettingsType>) => void;
  exportData: () => void;
  importData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, exportData, importData, resetData }) => {
  const [showKey, setShowKey] = React.useState(false);

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Cài đặt hệ thống</h2>
          <p className="text-xs text-slate-500">Quản lý API Key và dữ liệu học tập của bạn</p>
        </div>
      </div>

      {/* AI Config */}
      <section className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Shield size={20} />
          <span>Cấu hình Gemini AI</span>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">Gemini API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={settings.geminiApiKey}
              onChange={(e) => updateSettings({ geminiApiKey: e.target.value })}
              placeholder="Dán API Key của bạn tại đây..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button 
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Lấy API Key miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-semibold text-slate-700 block">AI Model Preference</label>
          <select 
            value={settings.selectedModel}
            onChange={(e) => updateSettings({ selectedModel: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Nhanh nhất)</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ổn định)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Thông minh nhất)</option>
          </select>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-500 font-bold">
          <Database size={20} />
          <span>Quản lý dữ liệu</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            onClick={exportData}
            className="flex items-center justify-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all group"
          >
            <Download size={20} className="text-slate-500 group-hover:text-primary" />
            <div className="text-left leading-tight">
              <span className="block text-sm font-bold text-slate-700">Xuất dữ liệu</span>
              <span className="text-[10px] text-slate-400">Backup (JSON file)</span>
            </div>
          </button>

          <label className="flex items-center justify-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all cursor-pointer group">
            <Upload size={20} className="text-slate-500 group-hover:text-emerald-500" />
            <div className="text-left leading-tight">
              <span className="block text-sm font-bold text-slate-700">Nhập dữ liệu</span>
              <span className="text-[10px] text-slate-400">Khôi phục từ file</span>
            </div>
            <input type="file" className="hidden" accept=".json" onChange={importData} />
          </label>
        </div>

        <button 
          onClick={() => {
            Swal.fire({
              title: 'Xoá tất cả dữ liệu?',
              text: 'Hành động này sẽ xoá sạch tiến trình và cài đặt của bạn. Không thể hoàn tác!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Đồng ý xoá',
              cancelButtonText: 'Huỷ',
              confirmButtonColor: '#ef4444'
            }).then(r => r.isConfirmed && resetData());
          }}
          className="flex items-center justify-center gap-2 w-full p-3 text-rose-500 font-bold text-sm bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
        >
          <Trash2 size={16} />
          Thiết lập lại ứng dụng
        </button>
      </section>

      {/* About */}
      <div className="text-center space-y-2 opacity-50">
        <p className="text-xs font-bold text-slate-500">EduExam Pro v1.0.0</p>
        <p className="text-[10px]">Tạo bởi AI cho tương lai giáo dục</p>
      </div>
    </div>
  );
};
