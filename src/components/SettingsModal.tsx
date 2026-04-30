import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Settings as SettingsIcon } from 'lucide-react';
import { PlayerCount, HourlyRates } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: HourlyRates;
  onSave: (rates: HourlyRates) => void;
}

export function SettingsModal({ isOpen, onClose, rates, onSave }: SettingsModalProps) {
  const [localRates, setLocalRates] = useState<HourlyRates>(rates);

  useEffect(() => {
    if (isOpen) {
      setLocalRates(rates);
    }
  }, [isOpen, rates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localRates);
  };

  const handleRateChange = (playerCount: PlayerCount, value: string) => {
    const num = parseInt(value, 10);
    setLocalRates(prev => ({
      ...prev,
      [playerCount]: isNaN(num) ? 0 : num
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="bg-[#050a14] border-2 border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.2)] rounded-none relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              
              <div className="p-6 border-b border-blue-600/30 bg-blue-900/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-none skew-x-[-10deg]">
                    <div className="skew-x-[10deg]"><SettingsIcon size={20} /></div>
                  </div>
                  <h2 className="text-2xl font-display font-bold italic tracking-widest text-white uppercase mt-1">الإعدادات</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-300 tracking-wider mb-4 border-b border-slate-800 pb-2">تسعيرة الساعات (ل.س)</h3>
                  <div className="space-y-4">
                    {(Object.keys(localRates) as unknown as PlayerCount[]).map(count => (
                      <div key={count} className="flex items-center justify-between gap-4">
                        <label className="text-slate-400 font-display font-bold tracking-widest uppercase">
                          {count} {count === 1 ? 'لاعب' : 'لاعبين'}
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            value={localRates[count] || ''}
                            onChange={(e) => handleRateChange(count, e.target.value)}
                            className="bg-black border border-slate-700 focus:border-blue-500 w-32 px-3 py-2 text-white font-mono text-lg text-left skew-x-[-5deg] transition-all outline-none"
                            dir="ltr"
                            min="0"
                            step="500"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="relative overflow-hidden flex items-center justify-center gap-2 h-12 px-6 rounded-none bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white font-display uppercase tracking-widest italic font-bold text-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all skew-x-[-5deg]"
                  >
                    <div className="flex items-center gap-2 skew-x-[5deg]">
                      <Save size={18} />
                      حفظ التغييرات
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
