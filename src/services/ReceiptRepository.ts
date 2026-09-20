import type {
  Chapter,
  Moment,
  PlaceReceipt,
  PurchaseReceipt,
  Receipt,
  ReceiptType,
} from '../types';
import { getDataset, type Dataset } from '../lib/dataset';

/**
 * ReceiptRepository provides a centralized, read-only data access layer
 * for all 55 life receipts and associated domain entities.
 */
export class ReceiptRepository {
  private static instance: ReceiptRepository | null = null;
  private dataset: Dataset;

  private constructor() {
    this.dataset = getDataset();
  }

  public static getInstance(): ReceiptRepository {
    if (!ReceiptRepository.instance) {
      ReceiptRepository.instance = new ReceiptRepository();
    }
    return ReceiptRepository.instance;
  }

  /** Returns all 55 normalized receipts */
  public getAll(): Receipt[] {
    return this.dataset.receipts;
  }

  /** Lookup a receipt by its unique ID (e.g. "R001") */
  public getById(receiptId: string): Receipt | undefined {
    return this.dataset.receiptsMap.get(receiptId);
  }

  /** Filter receipts by type */
  public getByType<T extends Receipt = Receipt>(type: ReceiptType): T[] {
    return this.dataset.receipts.filter(r => r.type === type) as T[];
  }

  /** Filter receipts by month (1 to 9) */
  public getByMonth(month: number): Receipt[] {
    return this.dataset.receipts.filter(r => r.month === month);
  }

  /** Returns all geocoded place receipts (8 places) */
  public getPlaces(): PlaceReceipt[] {
    return this.dataset.placesWithCoords;
  }

  /** Returns all purchase receipts */
  public getPurchases(): PurchaseReceipt[] {
    return this.getByType<PurchaseReceipt>('purchase');
  }

  /** Returns total expenditure across all purchase receipts (₹1,56,800) */
  public getPurchasesTotal(): number {
    return this.dataset.purchasesTotal;
  }

  /** Returns all 9 monthly chapters */
  public getChapters(): Chapter[] {
    return this.dataset.chapters;
  }

  /** Returns all 12 connected moments */
  public getMoments(): Moment[] {
    return this.dataset.moments;
  }

  /** Returns the underlying raw dataset singleton */
  public getRawDataset(): Dataset {
    return this.dataset;
  }

  /** Returns total receipt count */
  public get count(): number {
    return this.dataset.receipts.length;
  }
}

export const receiptRepository = ReceiptRepository.getInstance();
