export type UserRole = 'ADMIN' | 'CASHIER' | 'DELIVERER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId: string;
  unit: 'KG' | 'M' | 'PIECE';
  costPrice: number;
  sellingPrice: number;
  minStockLevel: number;
  currentStock: number;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  cashierId: string;
  customerId?: string;
  totalAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
  deviceId: string;
  localId: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  saleId: string;
  method: 'CASH' | 'MPESA';
  amount: number;
  transactionReference?: string;
  verified: boolean;
  createdAt: Date;
}

export interface StockAdjustment {
  id: string;
  sessionId: string;
  productId: string;
  expectedQty: number;
  actualQty: number;
  adjustmentQty: number;
  reason: string;
  approvedBy: string;
  createdAt: Date;
}

export interface StockSession {
  id: string;
  adminId: string;
  status: 'OPEN' | 'COMPLETED';
  startedAt: Date;
  endedAt?: Date;
}

export interface Delivery {
  id: string;
  saleId: string;
  delivererId: string;
  customerId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  deliveryNoteUrl?: string;
  proofOfDeliveryUrl?: string;
  scheduledDate: Date;
  actualDeliveredAt?: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}
