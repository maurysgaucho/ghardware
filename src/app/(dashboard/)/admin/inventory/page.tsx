import React from 'react';
import { Package, Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hardware Inventory</h1>
          <p className="text-sm text-gray-500">Manage your products, stock levels and categories.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">1,240</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600">12</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">KES 4.2M</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Categories</p>
          <p className="text-2xl font-bold text-gray-900">18</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, SKU or barcode..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={18} />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Upload size={18} />
              Import
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU / Barcode</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost Price</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Cement 50kg (Bamburi)', sku: 'CEM-BAM-50', barcode: '1234567890', cat: 'Cement', stock: 450, cost: 850, sell: 950 },
                { name: 'Roofing Sheet 3m (Gauge 32)', sku: 'RFS-G32-3M', barcode: '2345678901', cat: 'Roofing', stock: 120, cost: 1200, sell: 1500 },
                { name: 'Timber 2x4 12ft', sku: 'TMB-24-12', barcode: '3456789012', cat: 'Timber', stock: 85, cost: 400, sell: 600 },
                { name: 'Iron Bar 12mm (Standard)', sku: 'IRN-12-STD', barcode: '4567890123', cat: 'Iron Bars', stock: 210, cost: 1100, sell: 1400 },
                { name: 'Paint White Silk (4L)', sku: 'PNT-WHT-4L', barcode: '5678901234', cat: 'Paint', stock: 45, cost: 2200, sell: 2800 },
              ].map((prod, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{prod.name}</div>
                    <div className="text-xs text-gray-500">{prod.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prod.barcode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prod.cat}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      prod.stock < 100 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    )}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">KES {prod.cost}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">KES {prod.sell}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
