import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { InventoryItem, InventoryCategory } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onAddStock: (id: string, amount: number) => void;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onRemoveItem: (id: string) => void;
}

const CATEGORIES: { value: InventoryCategory; label: string }[] = [
  { value: 'biscuit', label: 'بسكويت' },
  { value: 'chips', label: 'شيبس' },
  { value: 'cold_drink', label: 'مشروبات باردة' },
  { value: 'hot_drink', label: 'مشروبات ساخنة' },
  { value: 'other', label: 'أخرى' },
];

export function InventoryModal({ isOpen, onClose, inventory, onAddStock, onAddItem, onUpdateItem, onRemoveItem }: InventoryModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>('biscuit');
  const [newItemStock, setNewItemStock] = useState('');

  const [addStockValues, setAddStockValues] = useState<Record<string, string>>({});

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    onAddItem({
      name: newItemName,
      price: parseInt(newItemPrice),
      category: newItemCategory,
      stock: parseInt(newItemStock) || 0,
    });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemStock('');
    setActiveTab('list');
  };

  const submitAddStock = (id: string) => {
    const amount = parseInt(addStockValues[id] || '0');
    if (amount > 0) {
      onAddStock(id, amount);
      setAddStockValues((prev) => ({ ...prev, [id]: '' }));
    }
  };

  function formatMoney(amount: number) {
    return amount.toLocaleString('en-US') + ' ل.س';
  }

  // Filter inventory by category
  const groupedInventory = CATEGORIES.map(cat => ({
    ...cat,
    items: inventory.filter(i => i.category === cat.value)
  })).filter(g => g.items.length > 0);

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
            <div className="bg-[#050a14] border-2 border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-none relative overflow-hidden flex flex-col h-full max-h-[85vh]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
              
              {/* Header */}
              <div className="p-6 border-b border-emerald-600/30 bg-emerald-900/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-none skew-x-[-10deg]">
                    <div className="skew-x-[10deg]"><Package size={24} /></div>
                  </div>
                  <h2 className="text-2xl font-display font-bold italic tracking-widest text-white uppercase mt-1">المستودع والجرد</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#02040a] border-b border-slate-800 p-2 gap-2 shrink-0">
                <button 
                  onClick={() => setActiveTab('list')}
                  className={`flex-1 py-3 text-sm font-display font-bold tracking-widest uppercase transition-colors rounded-none ${activeTab === 'list' ? 'bg-emerald-600 border border-emerald-500 text-white' : 'bg-[#0a0a0a] text-slate-400 border border-slate-800 hover:text-emerald-400 hover:bg-emerald-950/20'}`}
                >
                  قائمة الجرد
                </button>
                <button 
                  onClick={() => setActiveTab('add')}
                  className={`flex-1 py-3 text-sm font-display font-bold tracking-widest uppercase transition-colors rounded-none ${activeTab === 'add' ? 'bg-emerald-600 border border-emerald-500 text-white' : 'bg-[#0a0a0a] text-slate-400 border border-slate-800 hover:text-emerald-400 hover:bg-emerald-950/20'}`}
                >
                  إضافة صنف جديد
                </button>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-[#02040a]">
                {activeTab === 'list' ? (
                  <div className="space-y-8">
                    {groupedInventory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                        <Package size={48} className="mb-4 opacity-50" />
                        <p className="font-display font-bold tracking-widest text-lg">المستودع فارغ، أضف أصناف جديدة أولاً</p>
                      </div>
                    ) : (
                      groupedInventory.map(group => (
                        <div key={group.value} className="space-y-3">
                          <h3 className="text-lg font-display font-bold text-emerald-400 border-b border-slate-800 pb-2 uppercase tracking-widest">
                            {group.label}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.items.map(item => (
                              <div key={item.id} className="bg-[#0a0a0a] border border-slate-800 p-3 flex flex-col gap-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                                <div className="absolute top-0 right-0 w-1 h-full bg-emerald-600/50"></div>
                                
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-white font-display font-bold tracking-wider">{item.name}</h4>
                                    <p className="text-emerald-400/80 font-display italic font-bold tracking-wider text-sm mt-0.5">{formatMoney(item.price)}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-display font-bold uppercase tracking-widest mt-1">الكمية:</span>
                                    <div className={`px-2 py-1 bg-slate-900 border ${item.stock <= 5 ? 'border-red-500 text-red-500' : 'border-slate-700 text-white'} font-display font-bold text-lg min-w-[3rem] text-center`}>
                                      {item.stock}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
                                  <input 
                                    type="number"
                                    placeholder="إضافة للكمية"
                                    min="1"
                                    value={addStockValues[item.id] || ''}
                                    onChange={(e) => setAddStockValues(prev => ({...prev, [item.id]: e.target.value}))}
                                    className="flex-1 bg-black border border-slate-800 px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-600 transition-colors h-9"
                                  />
                                  <button 
                                    onClick={() => submitAddStock(item.id)}
                                    disabled={!addStockValues[item.id] || parseInt(addStockValues[item.id]) <= 0}
                                    className="h-9 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center justify-center transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if(confirm('هل تريد حذف الصنف؟')) onRemoveItem(item.id)
                                    }}
                                    className="h-9 px-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
                                    title="حذف الصنف"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto py-8">
                    <form onSubmit={handleAddSubmit} className="space-y-5 bg-[#0a0a0a] border border-slate-800 p-6">
                      <h3 className="text-emerald-400 font-display font-bold text-xl uppercase tracking-widest border-b border-slate-800 pb-3 mb-5">مواصفات الصنف</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-400 font-display uppercase tracking-widest text-xs font-bold mb-2">اسم الصنف</label>
                          <input
                            type="text"
                            required
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-display font-bold tracking-wider"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-slate-400 font-display uppercase tracking-widest text-xs font-bold mb-2">التصنيف</label>
                          <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value as InventoryCategory)}
                            className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-display font-bold tracking-wider appearance-none"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 font-display uppercase tracking-widest text-xs font-bold mb-2">سعر المبيع (ل.س)</label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-display uppercase tracking-widest text-xs font-bold mb-2">الكمية الافتتاحية</label>
                            <input
                              type="number"
                              min="0"
                              value={newItemStock}
                              onChange={(e) => setNewItemStock(e.target.value)}
                              className="w-full bg-black border border-slate-700 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-6 border-t border-slate-800">
                        <button
                          type="submit"
                          className="w-full relative overflow-hidden flex items-center justify-center gap-2 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold uppercase tracking-widest transition-colors skew-x-[-5deg]"
                        >
                          <div className="skew-x-[5deg] flex items-center gap-2">
                            <Plus size={20} />
                            إضافة الصنف
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
