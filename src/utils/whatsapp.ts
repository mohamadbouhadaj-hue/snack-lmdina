import { EXTRA_OPTIONS } from '../data/defaultMenu';
import { CartItem, OrderType, SpiceLevel } from '../types/menu';

export function formatMoroccanWhatsAppNumber(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, '');
  if (!digits) {
    return '212717288651';
  }
  if (digits.startsWith('00212')) {
    return digits.slice(2);
  }
  if (digits.startsWith('212')) {
    return digits;
  }
  if (digits.startsWith('0') && digits.length >= 9) {
    return `212${digits.slice(1)}`;
  }
  return digits;
}

export function calculateExtrasPrice(extras: string[] = []): number {
  return extras.reduce((sum, label) => {
    const found = EXTRA_OPTIONS.find((opt) => opt.label === label);
    return sum + (found ? found.price : 0);
  }, 0);
}

export function buildCartItemKey(
  productId: string,
  sauce?: string,
  spicy?: SpiceLevel,
  extras?: string[],
  note?: string
): string {
  const normalizedExtras = [...(extras || [])].sort().join('|');
  const normalizedNote = (note || '').trim().toLowerCase();
  return `${productId}::${sauce || ''}::${spicy || ''}::${normalizedExtras}::${normalizedNote}`;
}

export function calculateCartTotals(items: CartItem[]): {
  itemCount: number;
  subtotal: number;
} {
  let itemCount = 0;
  let subtotal = 0;
  for (const item of items) {
    itemCount += item.quantity;
    subtotal += (item.unitPrice + item.extrasPrice) * item.quantity;
  }
  return { itemCount, subtotal };
}

export interface WhatsAppOrderParams {
  brandName: string;
  items: CartItem[];
  orderType: OrderType;
  address?: string;
  customerPhone?: string;
  orderNote?: string;
  deliveryNote?: string;
}

export function buildWhatsAppOrderMessage(params: WhatsAppOrderParams): string {
  const { brandName, items, orderType, address, customerPhone, orderNote, deliveryNote } = params;
  const { itemCount, subtotal } = calculateCartTotals(items);

  const lines: string[] = [];
  lines.push(`🍔 *Nouvelle Commande — ${brandName}*`);
  lines.push('━━━━━━━━━━━━━━━━━━━━');

  if (orderType === 'delivery') {
    lines.push('🛵 *Mode :* Livraison (توصيل)');
    lines.push(`📍 *Quartier / Adresse :* ${(address || '').trim() || 'À préciser'}`);
  } else {
    lines.push('🛍️ *Mode :* Sur place / À emporter (في المحل / إستلام)');
  }

  if (customerPhone && customerPhone.trim()) {
    lines.push(`📞 *Téléphone :* ${customerPhone.trim()}`);
  }

  lines.push('');
  lines.push(`🧾 *Détails de la commande (${itemCount} article${itemCount > 1 ? 's' : ''}) :*`);

  for (const item of items) {
    const effectiveUnit = item.unitPrice + item.extrasPrice;
    const lineTotal = effectiveUnit * item.quantity;
    lines.push(`• *${item.quantity}x ${item.name}* — ${lineTotal} DH`);

    const details: string[] = [];
    if (item.sauce) details.push(`Sauce: ${item.sauce}`);
    if (item.spicy && item.spicy !== 'Normal') details.push(item.spicy);
    if (item.extras && item.extras.length > 0) details.push(`Suppléments: ${item.extras.join(', ')}`);
    if (item.note && item.note.trim()) details.push(`Note: ${item.note.trim()}`);

    if (details.length > 0) {
      lines.push(`   _${details.join(' · ')}_`);
    }
  }

  if (orderNote && orderNote.trim()) {
    lines.push('');
    lines.push(`📝 *Note client :* ${orderNote.trim()}`);
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 *Total estimé : ${subtotal} DH*`);

  if (orderType === 'delivery' && deliveryNote && deliveryNote.trim()) {
    lines.push(`ℹ️ _${deliveryNote.trim()}_`);
  }

  lines.push('');
  lines.push(`✅ _La confirmation finale et les détails de livraison sont confirmés sur WhatsApp par ${brandName}._`);

  return lines.join('\n');
}

export function buildWhatsAppUrl(rawPhoneNumber: string, message: string): string {
  const formatted = formatMoroccanWhatsAppNumber(rawPhoneNumber);
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
}
