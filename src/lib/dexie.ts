import Dexie, { Table } from 'dexie';
import {
  Product,
  Category,
  Customer,
  Sale,
  SaleItem,
  Payment
} from '../types';

export interface SyncQueueItem {
  id?: number;
  clientId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  tableName: string;
  payload: any;
  createdAt: Date;
  syncedAt?: Date;
}

export class GamurDatabase extends Dexie {
  products!: Table<Product>;
  categories!: Table<Category>;
  customers!: Table<Customer>;
  sales!: Table<Sale>;
  saleItems!: Table<SaleItem>;
  payments!: Table<Payment>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('GamurHardwareDB');

    this.version(1).stores({
      products: 'id, sku, barcode, categoryId',
      categories: 'id, name',
      customers: 'id, name, phone',
      sales: 'id, localId, customerId, syncStatus',
      saleItems: 'id, saleId, productId',
      payments: 'id, saleId',
      syncQueue: '++id, tableName, createdAt'
    });
  }
}

export const db = new GamurDatabase();
