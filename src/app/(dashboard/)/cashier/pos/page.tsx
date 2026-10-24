import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/hooks/useOfflineCart';
import { db } from '@/lib/dexie';
import { Product, Sale } from '@/types';
import { cn } from '@/lib/utils/cn';

export default function POSPage() {
  const { items, addItem, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MPESA'>('CASH');
  const [mpesaRef, setMpesaRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from IndexedDB/API
    // Mocking product data for the UI demonstration
    setProducts([
      { id: '1', sku: 'CEM-BAM-50', barcode: '123', name: 'Cement 50kg', categoryId: 'cat1', unit: 'PIECE', costPrice: 850, sellingPrice: 950, minStockLevel: 10, currentStock: 400, supplierId: 'sup1', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', sku: 'RFS-G32-3M', barcode: '456', name: 'Roofing Sheet 3m', categoryId: 'cat2', unit: 'PIECE', costPrice: 1200, sellingPrice: 1500, minStockLevel: 10, currentStock: 100, supplierId: 'sup1', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', sku: 'TMB-24-12', barcode: '789', name: 'Timber 2x4 12ft', categoryId: 'cat3', unit: 'PIECE', costPrice: 400, sellingPrice: 600, minStockLevel: 10, currentStock: 80, supplierId: 'sup1', createdAt: new Date(), updatedAt: new Date() },
    ]);
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const sale: Sale = {
        id: crypto.randomUUID(),
        cashierId: 'current-user-id',
        totalAmount: getTotal(),
        paymentStatus: 'PAID',
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'PENDING',
        deviceId: 'device-01',
        localId: `LOC-${Date.now()}`,
      };

      // 1. Save to local IndexedDB
      await db.sales.add(sale);

      // 2. Save items to IndexedDB
      const saleItems = items.map(item => ({ ...item, saleId: sale.id }));
      await db.saleItems.bulkAdd(saleItems);

      // 3. Add to Sync Queue
      await db.syncQueue.add({
        clientId: 'device-01',
        operation: 'INSERT',
        tableName: 'sales',
        payload: sale,
        createdAt: new Date(),
      });

      alert('Sale completed successfully (Saved Offline)!');
      clearCart();
      setMpesaRef('');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('An error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  );

  return (
    <div className="flex h-full gap-6">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products or scan barcode..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addItem(product, 1)}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
            >
              <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</p>
              <p className="text-xs text-gray-500 mb-2">{product.sku} • {product.currentStock} in stock</p>
              <p className="text-lg font-bold text-blue-600">KES {product.sellingPrice}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="w-96 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <ShoppingCart size={20} className="text-gray-600" />
          <h2 className="font-bold text-gray-900">Current Order</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">Product {item.productId}</p>
                  <p className="text-xs text-gray-500">KES {item.unitPrice} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-sm font-bold w-20 text-right">
                  KES {item.subtotal}
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4 bg-gray-50">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>KES {getTotal()}</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-sm font-medium",
                  paymentMethod === 'CASH' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                <Banknote size={16} /> Cash
              </button>
              <button
                onClick={() => setPaymentMethod('MPESA')}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-sm font-medium",
                  paymentMethod === 'MPESA' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                <CreditCard size={16} /> M-Pesa
              </button>
            </div>
          </div>

          {paymentMethod === 'MPESA' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Transaction Reference</p>
              <input
                type="text"
                placeholder="e.g. RKE1234567"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={mpesaRef}
                onChange={(e) => setMpesaRef(e.target.value)}
              />
              <div className="p-2 bg-blue-50 rounded-lg text-[10px] text-blue-700 border border-blue-100">
                Paybill: 512100 | Account: 14131733
              </div>
            </div>
          )}

          <button
            disabled={items.length === 0 || isProcessing || (paymentMethod === 'MPESA' && !mpesaRef)}
            onClick={handleCheckout}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle size={24} /> Complete Sale
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
