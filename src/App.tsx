import { useState, useEffect } from 'react';
import { StationCard } from './components/StationCard';
import { SettingsModal } from './components/SettingsModal';
import { DailyLogModal } from './components/DailyLogModal';
import { Gamepad2, Settings, History } from 'lucide-react';
import { motion } from 'motion/react';
import { HourlyRates, SessionLog } from './types';

const DEFAULT_RATES: HourlyRates = {
  1: 4000,
  2: 6000,
  3: 8000,
  4: 10000,
};

export default function App() {
  const [rates, setRates] = useState<HourlyRates>(DEFAULT_RATES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDailyLogOpen, setIsDailyLogOpen] = useState(false);
  const [dailyLogs, setDailyLogs] = useState<SessionLog[]>([]);

  useEffect(() => {
    const savedRates = localStorage.getItem('remontada_rates');
    if (savedRates) {
      try {
        setRates(JSON.parse(savedRates));
      } catch (e) {}
    }
    
    const savedLogs = localStorage.getItem('remontada_daily_logs');
    if (savedLogs) {
      try {
        setDailyLogs(JSON.parse(savedLogs));
      } catch (e) {}
    }
  }, []);

  const handleSaveRates = (newRates: HourlyRates) => {
    setRates(newRates);
    localStorage.setItem('remontada_rates', JSON.stringify(newRates));
    setIsSettingsOpen(false);
  };
  
  const handleSessionComplete = (log: Omit<SessionLog, 'id'>) => {
    const newLog: SessionLog = { ...log, id: Date.now().toString() + Math.random().toString() };
    const newLogs = [...dailyLogs, newLog];
    setDailyLogs(newLogs);
    localStorage.setItem('remontada_daily_logs', JSON.stringify(newLogs));
  };
  
  const handleClearLogs = () => {
    setDailyLogs([]);
    localStorage.removeItem('remontada_daily_logs');
    setIsDailyLogOpen(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mt-2 md:mt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 relative flex items-center justify-center flex-shrink-0 group skew-x-[-15deg] overflow-hidden border-b-4 border-slate-900 shadow-2xl">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_30px_rgba(220,38,38,0.6)]"></div>
                <div className="w-1/2 h-full bg-gradient-to-bl from-blue-500 to-blue-700 shadow-[0_0_30px_rgba(37,99,235,0.6)]"></div>
              </div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute left-1/2 top-[-20%] bottom-[-20%] w-[2px] -translate-x-1/2 bg-white/40 skew-x-[15deg] shadow-[0_0_10px_rgba(255,255,255,0.8)] z-0"></div>
              <div className="skew-x-[15deg] relative z-10 flex text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                 <Gamepad2 size={42} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="text-5xl md:text-7xl font-display font-black italic tracking-widest uppercase mb-1"
              >
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ef4444_50%,#3b82f6_50%)] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  REMONTADA
                </span>
              </motion.h1>
              <p className="text-slate-400 font-display uppercase tracking-[0.3em] font-bold text-sm mt-1">نظام إدارة الصالة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDailyLogOpen(true)}
              className="relative overflow-hidden flex items-center justify-center gap-2 h-10 px-4 rounded-none border border-red-900/50 bg-[#0a0a0a] hover:bg-red-950/30 text-red-400 hover:text-red-300 transition-all skew-x-[-10deg]"
            >
              <div className="flex items-center gap-2 skew-x-[10deg]">
                <History size={18} />
                <span className="font-display font-bold tracking-widest uppercase text-sm">السجل</span>
              </div>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="relative overflow-hidden flex items-center justify-center gap-2 h-10 px-4 rounded-none border border-slate-700 bg-[#0a0a0a] hover:bg-slate-800 text-slate-300 hover:text-white transition-all skew-x-[-10deg]"
            >
              <div className="flex items-center gap-2 skew-x-[10deg]">
                <Settings size={18} />
                <span className="font-display font-bold tracking-widest uppercase text-sm">الإعدادات</span>
              </div>
            </button>
            <div className="hidden md:flex gap-2 opacity-80">
               <div className="h-1.5 w-12 bg-red-600 skew-x-[-20deg]"></div>
               <div className="h-1.5 w-12 bg-blue-600 skew-x-[-20deg]"></div>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StationCard stationNumber={1} rates={rates} onSessionComplete={handleSessionComplete} />
          <StationCard stationNumber={2} rates={rates} onSessionComplete={handleSessionComplete} />
          <StationCard stationNumber={3} rates={rates} onSessionComplete={handleSessionComplete} />
          <StationCard stationNumber={4} rates={rates} onSessionComplete={handleSessionComplete} />
        </div>

        <footer className="mt-16 pt-8 pb-4 border-t border-slate-800/80 text-center opacity-60 hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <p className="text-slate-300 font-display tracking-widest text-sm">
              تم التطوير بواسطة <span className="text-white font-bold mx-1">هادي حسن</span>
            </p>
            <span className="hidden md:block text-slate-700 skew-x-[-15deg] font-bold">/</span>
            <p className="font-display font-bold italic tracking-[0.2em] text-sm text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 skew-x-[-5deg] drop-shadow-sm">
              HADI HASAN
            </p>
          </div>
        </footer>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        rates={rates} 
        onSave={handleSaveRates} 
      />
      <DailyLogModal
        isOpen={isDailyLogOpen}
        onClose={() => setIsDailyLogOpen(false)}
        logs={dailyLogs}
        onClearLogs={handleClearLogs}
      />
    </div>
  );
}
