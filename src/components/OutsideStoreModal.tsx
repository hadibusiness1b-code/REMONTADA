import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Plus, Minus, Check, Trash2 } from 'lucide-react';
import { InventoryItem, OrderItem, SessionLog } from '../types';

interface OutsideStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onConsumeInventory: (id: string, amount: number) => void;
  onRestoreInventory: (id: string, amount: number) => void;
  onSessionComplete: (log: Omit<SessionLog, 'id'>) => void;
}

export function OutsideStoreModal({ isOpen, onClose, inventory, onConsumeInventory, onRestoreInventory, onSessionComplete }: OutsideStoreModalProps) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const availableInventory = inventory.filter(i => i.stock > 0);

  const handleAddToCart = (item: InventoryItem) => {
    // Consume instantly to prevent double-booking if multiple are added
    onConsumeInventory(item.id, 1);
    setCart(prev => [...prev, { id: Date.now().toString() + Math.random(), inventoryItemId: item.id, name: item.name, price: item.price }]);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(customItemPrice);
    if (!customItemName.trim() || isNaN(price) || price <= 0) return;
    
    // Check if perfectly matches an inventory item
    const matchingInvItem = inventory.find(i => i.name === customItemName.trim());
    const inventoryItemId = matchingInvItem ? matchingInvItem.id : undefined;

    setCart(prev => [...prev, { id: Date.now().toString() + Math.random(), name: customItemName.trim(), price, inventoryItemId }]);
    
    if (inventoryItemId) {
      onConsumeInventory(inventoryItemId, 1);
    }
    
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleRemoveFromCart = (order: OrderItem) => {
    setCart(prev => prev.filter(o => o.id !== order.id));
    if (order.inventoryItemId) {
      onRestoreInventory(order.inventoryItemId, 1);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    onSessionComplete({
      stationNumber: 'outside',
      startTime: Date.now(),
      endTime: Date.now(),
      gameCost: 0,
      orders: cart,
      foodCost: cartTotal,
      totalCost: cartTotal,
    });
    
    setCart([]);
    onClose();
  };

  const handleCancel = () => {
    // Restore all items
    cart.forEach(order => {
      if (order.inventoryItemId) {
        onRestoreInventory(order.inventoryItemId, 1);
      }
    });
    setCart([]);
    onClose();
  };

  function formatMoney(amount: number) {
    return amount.toLocaleString('en-US') + ' ل.س';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl z-50 p-4 max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#050a14] border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)] rounded-none relative overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              
              {/* Left Column - Menu */}
              <div className="flex-1 flex flex-col border-r border-slate-800">
                <div className="p-4 border-b border-yellow-500/30 bg-yellow-900/10 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500 text-black rounded-none skew-x-[-10deg]">
                      <div className="skew-x-[10deg]"><ShoppingCart size={20} /></div>
                    </div>
                    <h2 className="text-xl font-display font-bold italic tracking-widest text-white uppercase mt-1">المبيعات الخارجية</h2>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-slate-400 hover:text-white transition-colors duration-200 block md:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#02040a]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableInventory.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#0a0a0a] border border-slate-800 hover:border-yellow-500/50 p-3 flex flex-col gap-2 relative overflow-hidden group transition-all text-right group skew-x-[-2deg]"
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500/30 group-hover:bg-yellow-500 transition-colors"></div>
                        <div className="skew-x-[2deg] flex flex-col items-start w-full ml-2">
                          <span className="text-white font-display font-bold tracking-wider text-sm">{item.name}</span>
                          <span className="text-yellow-500 font-display italic font-bold text-base mt-2">{formatMoney(item.price)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {availableInventory.length === 0 && (
                    <div className="text-center py-8 text-slate-500 font-display italic font-bold">
                      لا يوجد أصناف متاحة في الجرد
                    </div>
                  )}

                  {/* Add Custom Outside Item */}
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <h4 className="text-yellow-500 text-sm font-display font-bold uppercase mb-4 tracking-widest">إضافة عنصر غير مجرود</h4>
                    <form onSubmit={handleAddCustom} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="اسم العنصر"
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="flex-1 bg-black border border-slate-800 rounded-none px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                      />
                      <input 
                        type="number" 
                        placeholder="السعر"
                        value={customItemPrice}
                        onChange={(e) => setCustomItemPrice(e.target.value)}
                        className="w-24 bg-black border border-slate-800 rounded-none px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-mono"
                      />
                      <button 
                        type="submit"
                        disabled={!customItemName.trim() || !customItemPrice.trim()}
                        className="bg-yellow-600 hover:bg-yellow-500 border border-yellow-500 disabled:opacity-50 disabled:bg-slate-800 disabled:border-slate-700 text-black px-4 skew-x-[-10deg] rounded-none transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        <div className="skew-x-[10deg]"><Plus size={18} strokeWidth={3} /></div>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Cart */}
              <div className="w-full md:w-[350px] flex flex-col bg-[#050505] shrink-0 border-t md:border-t-0 md:border-r border-slate-800">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0a0a0a]">
                   <h3 className="text-white font-display font-bold uppercase tracking-widest">سلة الطلبات</h3>
                   <span className="bg-slate-800 text-slate-300 px-2 py-0.5 text-xs font-bold rounded-sm border border-slate-700">{cart.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
                      <ShoppingCart size={40} className="mb-3" />
                      <p className="font-display font-bold">السلة فارغة</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       {cart.map(item => (
                         <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-[#0a0a0a] border border-slate-800 group hover:border-slate-700">
                           <span className="text-slate-300 text-sm font-display font-bold uppercase">{item.name}</span>
                           <div className="flex items-center gap-2">
                             <span className="text-yellow-500 font-display font-bold italic text-sm">{formatMoney(item.price)}</span>
                             <button
                               onClick={() => handleRemoveFromCart(item)}
                               className="text-slate-500 hover:text-red-500 transition-colors p-1"
                             >
                               <Trash2 size={14} />
                             </button>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
                </div>
                
                <div className="p-5 border-t border-slate-800 bg-black shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-10">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-400 font-display uppercase tracking-widest text-xs font-bold">المجموع</span>
                    <span className="text-3xl font-display font-bold italic text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">{formatMoney(cartTotal)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 skew-x-[-5deg] font-display font-bold uppercase transition-colors"
                    >
                      <div className="skew-x-[5deg]">إلغاء</div>
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                      className="flex-1 h-12 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-yellow-500 border-2 border-yellow-400 text-black font-display font-bold uppercase tracking-widest skew-x-[-5deg] flex justify-center items-center gap-2 transition-transform active:scale-[0.98]"
                    >
                       <div className="skew-x-[5deg] flex items-center gap-2">
                         <Check size={18} strokeWidth={3} />
                         دفع وتصفية
                       </div>
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
