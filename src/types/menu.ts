export type MenuCategory =
  | 'Tacos & Wraps'
  | 'Burgers'
  | 'Sandwiches & Paninis'
  | 'Boxes & Sides'
  | 'Drinks & Desserts';

export type CategoryFilter = 'All' | MenuCategory;

export interface Product {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
}

export type SpiceLevel = 'Sans piment' | 'Normal' | 'Piquant';

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface ItemCustomization {
  sauce: string;
  spicy: SpiceLevel;
  extras: string[];
  note: string;
}

export interface CartItem {
  cartKey: string;
  productId: string;
  name: string;
  unitPrice: number;
  extrasPrice: number;
  quantity: number;
  image: string;
  sauce?: string;
  spicy?: SpiceLevel;
  extras?: string[];
  note?: string;
}

export type OrderType = 'delivery' | 'pickup';

export interface StoreSettings {
  brandName: string;
  whatsappNumber: string;
  adminPin: string;
  deliveryNote: string;
}
