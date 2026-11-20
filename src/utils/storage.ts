import { DEFAULT_PRODUCTS, DEFAULT_STORE_SETTINGS } from '../data/defaultMenu';
import { Product, StoreSettings } from '../types/menu';

const PRODUCTS_STORAGE_KEY = 'snacklmdina_products_v1';
const SETTINGS_STORAGE_KEY = 'snacklmdina_settings_v1';

export function isAdminRoute(search: string, hash: string): boolean {
  const params = new URLSearchParams(search);
  if (params.get('admin') === '1' || params.get('admin') === 'true') {
    return true;
  }
  const normalizedHash = hash.toLowerCase().trim();
  return normalizedHash === '#admin' || normalizedHash.startsWith('#admin/') || normalizedHash.startsWith('#admin?');
}

export function loadProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_PRODUCTS;
    }
    return parsed as Product[];
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function resetProductsToDemo(): Product[] {
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

export function loadStoreSettings(): StoreSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    return {
      brandName: parsed.brandName?.trim() || DEFAULT_STORE_SETTINGS.brandName,
      whatsappNumber: parsed.whatsappNumber?.trim() || DEFAULT_STORE_SETTINGS.whatsappNumber,
      adminPin: parsed.adminPin?.trim() || DEFAULT_STORE_SETTINGS.adminPin,
      deliveryNote: parsed.deliveryNote?.trim() || DEFAULT_STORE_SETTINGS.deliveryNote,
    };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors gracefully
  }
}
