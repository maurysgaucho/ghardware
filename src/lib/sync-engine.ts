import { db } from '@/lib/dexie';
import { Sale, SaleItem, Payment } from '@/types';

export async function synchronizeOfflineData() {
  const pendingTransactions = await db.syncQueue.where('syncedAt').isNull().toArray();

  if (pendingTransactions.length === 0) return { synced: 0, errors: 0 };

  let syncedCount = 0;
  let errorCount = 0;

  for (const tx of pendingTransactions) {
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: tx.operation,
          table: tx.tableName,
          payload: tx.payload,
          clientId: tx.clientId,
        }),
      });

      if (response.ok) {
        await db.syncQueue.update(tx.id!, { syncedAt: new Date() });
        syncedCount++;
      } else {
        errorCount++;
      }
    } catch (e) {
      console.error(`Failed to sync transaction ${tx.id}:`, e);
      errorCount++;
    }
  }

  return { synced: syncedCount, errors: errorCount };
}
