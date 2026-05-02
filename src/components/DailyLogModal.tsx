import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, Trash2, CalendarClock } from 'lucide-react';
import { SessionLog } from '../types';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SessionLog[];
  onClearLogs: () => void;
}

export function DailyLogModal({ isOpen, onClose, logs, onClearLogs }: DailyLogModalProps) {
  function formatMoney(amount: number) {
    return amount.toLocaleString('en-US') + ' ل.س';
  }

  function formatTime(timestamp: number) {
    return new Intl.DateTimeFormat('ar-SY', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp));
  }

  function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}س ${minutes}د`;
    return `${minutes}د`;
  }

  const totalGameIncome = logs.reduce((sum, log) => sum + log.gameCost, 0);
  const totalFoodIncome = logs.reduce((sum, log) => sum + log.foodCost, 0);
  const totalIncome = logs.reduce((sum, log) => sum + log.totalCost, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50 p-4 max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#050a14] border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] rounded-none relative overflow-hidden flex flex-col h-full max-h-[85vh]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              
              {/* Header */}
              <div className="p-6 border-b border-red-600/30 bg-red-900/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600 text-white rounded-none skew-x-[-10deg]">
                    <div className="skew-x-[10deg]"><History size={24} /></div>
                  </div>
                  <h2 className="text-2xl font-display font-bold italic tracking-widest text-white uppercase mt-1">السجل اليومي</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Summary Cards */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 bg-[#02040a]">
                <div className="bg-black border border-slate-800 p-4 relative overflow-hidden skew-x-[-5deg]">
                  <div className="skew-x-[5deg]">
                    <p className="text-slate-500 font-display font-bold uppercase tracking-widest text-xs">إجمالي اللعب</p>
                    <p className="text-2xl font-display font-bold italic text-blue-400 mt-1">{formatMoney(totalGameIncome)}</p>
                  </div>
                </div>
                <div className="bg-black border border-slate-800 p-4 relative overflow-hidden skew-x-[-5deg]">
                  <div className="skew-x-[5deg]">
                    <p className="text-slate-500 font-display font-bold uppercase tracking-widest text-xs">إجمالي الطلبات</p>
                    <p className="text-2xl font-display font-bold italic text-yellow-500 mt-1">{formatMoney(totalFoodIncome)}</p>
                  </div>
                </div>
                <div className="bg-[#0a0505] border border-red-900/50 p-4 relative overflow-hidden skew-x-[-5deg]">
                  <div className="absolute left-0 top-0 w-1 h-full bg-red-600"></div>
                  <div className="skew-x-[5deg] ml-2">
                    <p className="text-red-400/80 font-display font-bold uppercase tracking-widest text-xs">الإجمالي الكلي</p>
                    <p className="text-3xl font-display font-bold italic text-red-500 mt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                      {formatMoney(totalIncome)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logs List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                    <CalendarClock size={48} className="mb-4 opacity-50" />
                    <p className="font-display font-bold tracking-widest text-lg">لا يوجد حركات مسجلة اليوم</p>
                  </div>
                ) : (
                  logs.slice().reverse().map((log) => (
                    <div key={log.id} className="bg-[#0a0a0a] border border-slate-800 p-4 relative">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        
                        <div className="flex items-start gap-4">
                          <div className="bg-slate-900 border border-slate-800 px-3 py-2 text-center shrink-0">
                            <span className="block text-xs font-display font-bold text-slate-500 uppercase">جهاز</span>
                            <span className="block text-xl font-display font-bold italic text-white">{log.stationNumber}</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-display font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-none">
                                {formatTime(log.endTime)}
                              </span>
                              <span className="text-sm font-display font-bold text-blue-400/80">
                                {formatDuration(log.elapsedSeconds)}
                              </span>
                              <span className="text-sm font-display font-bold text-slate-500">
                                ({log.playerCount} لاعبين)
                              </span>
                            </div>
                            
                            {log.orders.length > 0 && (
                              <div className="mt-3 space-y-1">
                                <p className="text-xs font-display font-bold text-slate-500 uppercase mb-2">الطلبات:</p>
                                {log.orders.map((order) => (
                                  <div key={order.id} className="flex justify-between items-center text-sm max-w-sm border-b border-slate-800/50 pb-1">
                                    <span className="text-slate-300">{order.name}</span>
                                    <span className="text-slate-400 font-display italic font-bold">{formatMoney(order.price)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 md:border-r md:border-slate-800 md:pr-4">
                          <div className="flex justify-between w-32 text-sm">
                            <span className="text-slate-500">اللعب:</span>
                            <span className="text-blue-400">{formatMoney(log.gameCost)}</span>
                          </div>
                          <div className="flex justify-between w-32 text-sm">
                            <span className="text-slate-500">الطلبات:</span>
                            <span className="text-yellow-500">{formatMoney(log.foodCost)}</span>
                          </div>
                          <div className="w-full h-px bg-slate-800 my-1"></div>
                          <div className="flex justify-between w-32 text-base font-bold">
                            <span className="text-slate-400">الإجمالي:</span>
                            <span className="text-red-500">{formatMoney(log.totalCost)}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {logs.length > 0 && (
                <div className="p-4 border-t border-slate-800 bg-[#02040a] flex justify-end shrink-0">
                  <button
                    onClick={() => {
                      if(confirm('هل أنت متأكد من مسح جميع السجلات؟ لا يمكن التراجع عن هذه الخطوة.')) {
                        onClearLogs();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-950/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 transition-colors border border-red-900/50 font-display font-bold text-sm tracking-widest uppercase"
                  >
                    <Trash2 size={16} />
                    مسح السجل
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
