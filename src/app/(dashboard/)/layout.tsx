import React from 'react';
import { UserCircle, LayoutDashboard, Package, ShoppingCart, Truck, BarChart3, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const SidebarItem = ({ item, active = false }: { item: { label: string, href: string, icon: any }, active?: boolean }) => (
  <Link
    href={item.href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
      active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
    )}
  >
    {item.icon}
    <span className="text-sm font-medium">{item.label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">GAMUR Hardware</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Main</p>
          <SidebarItem item={{ label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> }} />

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-4 px-3">Operations</p>
          <SidebarItem item={{ label: 'Inventory', href: '/dashboard/admin/inventory', icon: <Package size={20} /> }} />
          <SidebarItem item={{ label: 'POS', href: '/dashboard/cashier/pos', icon: <ShoppingCart size={20} /> }} />
          <SidebarItem item={{ label: 'Deliveries', href: '/dashboard/deliverer/shipments', icon: <Truck size={20} /> }} />

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-4 px-3">Analysis</p>
          <SidebarItem item={{ label: 'Reports', href: '/dashboard/admin/reports', icon: <BarChart3 size={20} /> }} />
          <SidebarItem item={{ label: 'Stocktake', href: '/dashboard/admin/stocktake', icon: <Package size={20} /> }} />
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <SidebarItem item={{ label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> }} />
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="text-sm text-gray-500">Welcome, <span className="font-medium text-gray-900">Admin User</span></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
            <UserCircle size={32} className="text-gray-400" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
