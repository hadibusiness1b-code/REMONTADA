import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Plus, Utensils, Gamepad2, Receipt, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { PlayerCount, HourlyRates } from '../types';

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

interface StationCardProps {
  stationNumber: number;
  rates: HourlyRates;
}

export function StationCard({ stationNumber, rates }: StationCardProps) {
  const [status, setStatus] = useState<'available' | 'playing' | 'billing'>('available');
  const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Timer effect using Date.now() for accurate interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'playing' && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, startTime]);

  const handleStart = () => {
    if (!playerCount) return;
    setStatus('playing');
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  const handleStop = () => {
    setStatus('billing');
  };

  const handleReset = () => {
    setStatus('available');
    setPlayerCount(null);
    setStartTime(null);
    setElapsedSeconds(0);
    setOrders([]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(newItemPrice);
    if (!newItemName.trim() || isNaN(price) || price <= 0) return;
    
    setOrders((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random().toString(), name: newItemName.trim(), price }
    ]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const currentRate = playerCount ? rates[playerCount] : 0;
  // Calculate cost on the fly for exact accuracy in SYP
  const gameCost = Math.ceil((elapsedSeconds / 3600) * currentRate);
  const foodCost = orders.reduce((total, order) => total + order.price, 0);
  const totalCost = gameCost + foodCost;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  function formatMoney(amount: number) {
    return amount.toLocaleString('en-US') + ' ل.س';
  }

  return (
    <motion.div 
      layout
      transition={{ duration: 0.3 }}
      className={`relative min-h-[500px] overflow-hidden flex flex-col rounded-sm border-2 transition-colors duration-300 ${
        status === 'playing' 
          ? 'border-red-600 bg-[#0f0505] shadow-[0_0_20px_rgba(220,38,38,0.15)]' 
          : status === 'billing' 
            ? 'border-blue-600 bg-[#050a14] shadow-[0_0_20px_rgba(37,99,235,0.15)]'
            : 'border-slate-800/80 bg-[#0a0a0a] hover:bg-[#111] hover:border-slate-700/80'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-sm text-white transition-colors duration-300 skew-x-[-10deg] ${
            status === 'playing' ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : status === 'billing' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800'
          }`}>
            <div className="skew-x-[10deg]">
              <Gamepad2 size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold italic tracking-wider text-slate-100 uppercase">جهاز {stationNumber}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`w-2 h-2 rounded-none skew-x-[-10deg] shadow-sm ${
                status === 'playing' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : status === 'billing' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              }`} />
              <span className="text-xs font-display font-bold tracking-widest text-slate-400 uppercase">
                {status === 'playing' ? 'قيد الاستخدام' : status === 'billing' ? 'الحساب' : 'متاح'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Play Time Display */}
        <div className="text-right flex flex-col items-end">
          <div className={`font-display text-4xl font-bold tracking-widest italic transition-colors duration-300 ${
            status === 'available' ? 'text-slate-700' : status === 'playing' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
          }`}>
            {formatTime(elapsedSeconds)}
          </div>
          {(status === 'playing' || status === 'billing') && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="text-[13px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded mt-1 shadow-inner"
            >
              {formatMoney(gameCost)} 
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 relative z-0">
        <AnimatePresence mode="wait">
          {/* AVAILABLE STATE CONTROLS */}
          {status === 'available' && (
            <motion.div 
              key="available"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              className="flex flex-col flex-1 justify-center gap-8"
            >
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Users size={16} className="text-blue-400" /> عدد اللاعبين
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {(Object.keys(rates) as unknown as PlayerCount[]).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPlayerCount(Number(num) as PlayerCount)}
                      className={`h-16 rounded-none font-display font-bold italic tracking-widest text-3xl transition-all duration-200 relative group overflow-hidden skew-x-[-10deg] ${
                        playerCount == num 
                          ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400' 
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <div className="skew-x-[10deg] relative z-10">{num}</div>
                      {playerCount == num && <div className="absolute inset-0 bg-blue-400/20 blur-md z-0" />}
                    </button>
                  ))}
                </div>
                <div className="py-2 px-3 bg-[#0a0a0a] border border-slate-800 rounded-none text-center h-16 flex flex-col justify-center relative skew-x-[-5deg]">
                  <div className="skew-x-[5deg]">
                    <p className="text-xs text-slate-500 font-display font-medium uppercase tracking-widest">السعر بالساعة</p>
                    <p className="text-blue-400 font-display text-xl font-bold italic tracking-wide mt-0.5">
                      {playerCount ? formatMoney(rates[playerCount]) : <span className="text-slate-700 text-sm">اختر عدد اللاعبين</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleStart}
                  disabled={!playerCount}
                  className={`relative overflow-hidden flex items-center justify-center gap-2 w-full h-14 rounded-none font-display uppercase tracking-widest italic font-bold text-xl transition-all skew-x-[-5deg] ${
                    playerCount 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-[0.98] border border-blue-400' 
                      : 'bg-slate-900 text-slate-600 cursor-not-allowed shadow-none border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 skew-x-[5deg]">
                    <Play fill="currentColor" size={20} />
                    بدء الجلسة
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* PLAYING STATE */}
          {status === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              className="flex flex-col flex-1 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Utensils size={18} className="text-red-400" />
                  <h3 className="font-semibold">المأكولات والمشروبات</h3>
                </div>
                <div className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700/50">
                  {orders.length} عناصر
                </div>
              </div>

              {/* Orders List */}
              <div className="flex-1 bg-[#050505] border-2 border-slate-800 rounded-none overflow-hidden flex flex-col mb-4 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800/50"></div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 relative min-h-[120px]">
                  {orders.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-600 font-medium">
                      لا توجد إضافات
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -10, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, scale: 0.9, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex justify-between items-center py-2.5 px-3 bg-[#0a0a0a] rounded-none text-sm border border-slate-800 group hover:border-slate-700 transition-colors"
                        >
                          <span className="text-slate-200 font-display font-bold tracking-wider uppercase">{order.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-display font-bold italic text-slate-300 tracking-wider tooltip">{formatMoney(order.price)}</span>
                            <button 
                              onClick={() => setOrders(orders.filter(o => o.id !== order.id))}
                              className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100"
                              title="إزالة العنصر"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Add Item Form */}
                <form onSubmit={handleAddOrder} className="flex gap-2 p-3 bg-[#0a0a0a] border-t border-slate-800/80">
                  <input 
                    type="text" 
                    placeholder="اسم العنصر"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 bg-black border border-slate-800 rounded-none px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all min-w-0"
                  />
                  <input 
                    type="number" 
                    placeholder="السعر"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-24 bg-black border border-slate-800 rounded-none px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono"
                  />
                  <button 
                    type="submit"
                    disabled={!newItemName.trim() || !newItemPrice.trim()}
                    className="bg-red-600 hover:bg-red-500 border border-red-500 disabled:opacity-50 disabled:bg-slate-800 disabled:border-slate-700 text-white px-4 skew-x-[-10deg] rounded-none transition-colors flex items-center justify-center flex-shrink-0"
                  >
                    <div className="skew-x-[10deg]"><Plus size={18} strokeWidth={3} /></div>
                  </button>
                </form>
              </div>

              {/* Live Cost Summary */}
              <div className="bg-[#0a0a0a] rounded-none p-4 border-2 border-slate-800 flex justify-between items-center mb-4 relative overflow-hidden skew-x-[-2deg]">
                <div className="absolute top-0 left-0 w-1 bg-red-600 h-full"></div>
                <div className="skew-x-[2deg] flex justify-between items-center w-full ml-1">
                  <span className="text-slate-400 font-display uppercase tracking-widest font-bold">التكلفة التقديرية</span>
                  <span className="text-2xl font-bold italic text-white font-display tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {formatMoney(totalCost)}
                  </span>
                </div>
              </div>

              {/* Stop Play Action */}
              <button
                onClick={handleStop}
                className="mt-auto relative overflow-hidden flex-shrink-0 w-full flex items-center justify-center gap-2 h-14 rounded-none bg-red-600 border border-red-400 text-white font-display uppercase italic tracking-widest font-bold text-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-500 transition-all active:scale-[0.98] skew-x-[-5deg]"
              >
                <div className="flex items-center justify-center gap-2 skew-x-[5deg]">
                  <Square fill="currentColor" size={18} />
                  إنهاء اللعب
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BILLING OVERLAY - Rendered over everything else using AnimatePresence absolute */}
      <AnimatePresence>
        {status === 'billing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-20 bg-[#050a14] border-x-2 border-b-2 border-blue-600 flex flex-col justify-between"
          >
            {/* Overlay Header */}
            <div className="flex items-center gap-3 p-6 border-b border-blue-600/30 bg-blue-900/10">
              <div className="p-3 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white rounded-none skew-x-[-10deg]">
                <div className="skew-x-[10deg]"><Receipt size={24} /></div>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold italic text-white tracking-widest uppercase">الفاتورة النهائية</h3>
                <p className="text-sm font-display tracking-widest text-blue-400 uppercase">ملخص جهاز {stationNumber}</p>
              </div>
            </div>

            {/* Bill Details */}
            <div className="flex-1 p-6 overflow-y-auto w-full custom-scrollbar">
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-5">
                
                {/* Game Time Summary */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-slate-300 font-display font-bold tracking-widest mb-1 uppercase">وقت اللعب</div>
                    <div className="flex flex-col gap-1">
                       <span className="text-sm font-display font-bold italic tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-none w-fit pb-1">
                         {formatTime(elapsedSeconds)}
                       </span>
                       <span className="text-xs text-slate-500 font-display font-bold tracking-widest px-0.5 uppercase">
                         {playerCount} لاعبين ({formatMoney(currentRate)}/ساعة)
                       </span>
                    </div>
                  </div>
                  <div className="font-display font-bold italic text-xl tracking-wider text-slate-200 mt-1">
                    {formatMoney(gameCost)}
                  </div>
                </div>
                
                {/* Orders Summary (only show if any) */}
                {orders.length > 0 && (
                  <div className="pt-5 border-t border-slate-800 border-dashed space-y-3">
                    <div className="text-slate-300 font-display font-bold uppercase tracking-widest text-sm">المأكولات والمشروبات</div>
                    {orders.map(order => (
                      <div key={order.id} className="flex justify-between items-center text-sm py-0.5">
                        <span className="text-slate-400 font-display font-bold uppercase tracking-wider">{order.name}</span>
                        <span className="font-display italic font-bold tracking-wider text-slate-300">{formatMoney(order.price)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-sm pt-2">
                       <span className="text-slate-500 font-display font-bold uppercase tracking-widest">إجمالي المأكولات والمشروبات</span>
                       <span className="font-display italic font-bold tracking-wider text-slate-400">{formatMoney(foodCost)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer Total */}
            <div className="p-6 bg-[#03060c] border-t border-blue-600/30 z-10 w-full shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <div className="flex justify-between items-end mb-5">
                <span className="text-slate-400 font-display font-bold tracking-widest uppercase text-sm pb-1">المبلغ الإجمالي</span>
                <span className="text-5xl font-bold italic text-blue-500 font-display tracking-widest drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  {formatMoney(totalCost)}
                </span>
              </div>

              <button
                onClick={handleReset}
                className="w-full relative overflow-hidden flex items-center justify-center gap-2 h-14 rounded-none bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white font-display uppercase tracking-widest italic font-bold text-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all skew-x-[-5deg]"
              >
                <div className="flex items-center gap-2 skew-x-[5deg]">
                  <RotateCcw size={20} />
                  تأكيد وتصفية
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
